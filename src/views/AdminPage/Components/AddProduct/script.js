export default {
	data() {
		return {
			product: {
				name: "",
				brand: "",
				made_in_romania: false,
				certified_arig: false,
				producer_gluten_declaration: false,
				weight: null,
				unit: "",
				ean_code: "",
				image_url: "",
				description: "",
				cross_grain_cert_code: "",
				category_id: null,
				store_id: null,
				allergen_tags: [],
			},
			categories: [],
			stores: [],
			allergens: ["Gluten", "Lactoză", "Soia", "Ouă", "Alune", "Nuci", "Pește", "Crustacee", "Muștar", "Susan"],
			rules: {
				required: (v) => !!v || "Acest câmp este obligatoriu.",
				isNumber: (v) =>
					!v || !isNaN(parseFloat(v)) || "Trebuie să fie un număr valid.",
				requiredSelect: (v) => v !== null && v !== "" || "Selectează o opțiune.",
			},
			logoPreview: null,
			imageFile: null,
			isSubmitting: false,
			snackbar: {
				show: false,
				message: "",
				color: "success"
			}
		};
	},
	created() {
		this.fetchCategories();
		this.fetchStores();
	},
	methods: {
		async fetchCategories() {
			try {
				const response = await fetch("http://localhost:5000/api/categories");
				const data = await response.json();
				this.categories = data.map(category => ({
					id: category.id,
					name: category.name
				}));
			} catch (error) {
				console.error("Eroare la preluarea categoriilor:", error);
			}
		},
		async fetchStores() {
			try {
				const response = await fetch("http://localhost:5000/api/stores");
				const data = await response.json();
				this.stores = data.map(store => ({
					id: store.id,
					name: store.name
				}));
			} catch (error) {
				console.error("Eroare la preluarea magazinelor:", error);
			}
		},
		async submitForm() {
			const form = this.$refs.form;
			const isValid = await form.validate();

			if (!isValid) return;

			this.isSubmitting = true;

			try {
				const token = localStorage.getItem("token");

				// Check if the image file is selected and upload it
				if (this.imageFile) {
					const formData = new FormData();
					formData.append("image", this.imageFile);
				
					const uploadRes = await fetch("http://localhost:5000/api/products/upload-image", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`
						},
						body: formData
					});

					const uploadData = await uploadRes.json();

					if (!uploadRes.ok || !uploadData.imageUrl) {
						throw new Error(uploadData.error || "Eroare la încărcarea imaginii.");
					}

					this.product.image_url = uploadData.imageUrl;
				}
		
				// Send the product data to the server
				const response = await fetch("http://localhost:5000/api/products", {
					method: "POST",
					headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(this.product),
				});
		
				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message || "Eroare la salvarea produsului.");
				}
		
				const data = await response.json();
				console.log("Produs adăugat:", data);

				this.showSnackbar("Produs adăugat cu succes!");
				this.resetForm();
		
			} catch (error) {
				console.error("Eroare la adăugarea produsului:", error);
				this.showSnackbar("A apărut o eroare. Verifică datele introduse.", "error");
			} finally {
				this.isSubmitting = false;
			}
		},
		triggerImageUpload() {
			this.$refs.imageInput.click();
		},
		handleImageFile(event) {
			const file = event.target.files[0];
			if (file) {
				this.imageFile = file;
				this.logoPreview = URL.createObjectURL(file);
				this.showSnackbar("Imagine selectată.");
			}
		},
		removeImage() {
			this.imageFile = null;
			this.logoPreview = null;
			this.product.image_url = "";
			this.showSnackbar("Imaginea a fost eliminată.");
		},
		resetForm() {
			this.product = {
				name: "",
				brand: "",
				made_in_romania: false,
				certified_arig: false,
				producer_gluten_declaration: false,
				weight: null,
				unit: "",
				ean_code: "",
				image_url: "",
				description: "",
				cross_grain_cert_code: "",
				category_id: null,
				store_id: null,
				allergen_tags: [],
			};

			this.logoPreview = null;
			this.imageFile = null;

			this.$refs.form.reset();
		},
		showSnackbar(message, color = "success") {
			this.snackbar = {
				show: true,
				message,
				color,
			};
		}
	},
};
