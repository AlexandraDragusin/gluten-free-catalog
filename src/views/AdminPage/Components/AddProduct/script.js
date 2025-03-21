export default {
	data() {
		return {
			product: {
				name: "",
				brand: "",
				made_in_romania: false,
				certified_arig: false,
				weight: null,
				unit: "",
				ean_code: "",
				image_url: "",
				description: "",
				cross_grain_cert_code: "",
				category: "",
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
			},
			isSubmitting: false,
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
					category
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

				alert("Produs adăugat cu succes!");
				this.resetForm();
		
			} catch (error) {
				console.error("Eroare la adăugarea produsului:", error);
				alert("A apărut o eroare. Verifică datele introduse.");
			}
		},
		resetForm() {
			this.product = {
				name: "",
				brand: "",
				made_in_romania: false,
				certified_arig: false,
				weight: null,
				unit: "",
				ean_code: "",
				image_url: "",
				description: "",
				cross_grain_cert_code: "",
				category: "",
				store: "",
				allergen_tags: [],
			};

			this.$refs.form.reset();
		},
	},
};
