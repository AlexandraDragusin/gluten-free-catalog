export default {
	name: "ManageProducts",
	data() {
		return {
			products: [],
			editedProduct: null,
			editDialog: false,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			headers: [
				{ title: "Nume", value: "name", sortable: true },
				{ title: "Brand", value: "brand", sortable: true },
				{ title: "Fabricat in Romania", value: "made_in_romania" },
				{ title: "Certificat ARIG", value: "certified_arig" },
				{ title: "Cantitate", value: "weight" },
				{ title: "Unitate de masura", value: "unit" },
				{ title: "Imagine", value: "image_url" },
				{ title: "Cod EAN", value: "ean_code" },
				{ title: "Etichete alergeni", value: "allergen_tags" },
				{ title: "Categorie", value: "category" },
				{ title: "Descriere", value: "description" },
				{ title: "Certificat Cross Grain", value: "cross_grain_cert_code" },
				{ title: "Acțiuni", value: "actions", sortable: false, width: "112px" },
			]
		};
	},
	created() {
		this.fetchProducts();
	},
	methods: {
		async fetchProducts() {
			try {
				const res = await fetch("http://localhost:5000/api/products");
				const data = await res.json();

				this.products = data.map(p => ({
					...p,
					allergen_tags: Array.isArray(p.allergen_tags) ? p.allergen_tags.join(", ") : ""
				}));
			} catch (err) {
				console.error("Eroare la preluarea produselor:", err);
			}
		},
		editProduct(product) {
			this.editedProduct = { ...product };
			this.editDialog = true;
		},
		cancelEdit() {
			this.editedProduct = null;
			this.editDialog = false;
		},
		async updateProduct() {
			try {
				const payload = {
					...this.editedProduct,
					allergen_tags: this.editedProduct.allergen_tags
						.split(",")
						.map((t) => t.trim().toLowerCase())
						.filter(Boolean),
				};
		
				const res = await fetch(`http://localhost:5000/api/products/${payload.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify(payload),
				});
	
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.error || "Eroare la actualizare produs.");
				}
		
				this.showSnackbar("Produs actualizat cu succes.");
				this.fetchProducts();
				this.cancelEdit();
			} catch (err) {
				this.showSnackbar(err.message, "error");
			}
		},
		async deleteProduct(product) {
			if (!confirm(`Sigur vrei să ștergi produsul "${product.name}"?`)) return;

			try {
				const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				});

				if (!res.ok) throw new Error("Eroare la ștergere.");
				this.showSnackbar("Produs șters cu succes.");
				this.fetchProducts();
			} catch (err) {
				this.showSnackbar(err.message, "error");
			}
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	}
};