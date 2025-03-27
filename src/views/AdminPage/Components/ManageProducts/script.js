export default {
	name: "ManageProducts",
	data() {
		return {
			products: [],
			selectedProducts: [],
			selectionMode: false,
			showConfirmDialog: false,
			editedProduct: null,
			editDialog: false,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			categories: [],
			allergens: [],
			headers: [
				{ title: "Nume", value: "name", sortable: true },
				{ title: "Brand", value: "brand", sortable: true },
				{ title: "Cantitate", value: "weight" },
				{ title: "Unitate de masura", value: "unit" },
				{ title: "Imagine", value: "image_url" },
				{ title: "Cod EAN", value: "ean_code" },
				{ title: "Categorie", value: "category" },
				{ title: "Acțiuni", value: "actions", sortable: false, width: "112px" },
			]
		};
	},
	created() {
		this.fetchProducts();
		this.fetchAllergens();
		this.fetchCategories();
	},
	methods: {
		async fetchProducts() {
			try {
				const res = await fetch("http://localhost:5000/api/products");
				const data = await res.json();
				this.products = data.map(p => {
					const names = p.allergen_tags
						.map(code => {
							const found = this.allergens.find(a => a.code === code);
							return found ? found.name : code;
						});
					return {
						...p,
						allergen_tags_display: names.join(", ")
					};
				});
			} catch (err) {
				console.error("Eroare la preluarea produselor:", err);
			}
		},
		async fetchCategories() {
			try {
				const res = await fetch("http://localhost:5000/api/categories");
				const data = await res.json();
				this.categories = data;
			} catch (err) {
				console.error("Eroare la preluarea categoriilor:", err);
			}
		},
		async fetchAllergens() {
			try {
				const res = await fetch("http://localhost:5000/api/allergens");
				const data = await res.json();
				this.allergens = data;
			} catch (err) {
				console.error("Eroare la preluarea alergenilor:",
				err);
			}
		},
		editProduct(product) {
			this.editedProduct = {
				...product,
				producer_gluten_declaration: product.producer_gluten_declaration ?? false,
				allergen_tags: product.allergen_tags.map(code => {
					const match = this.allergens.find(a => a.code === code);
					return match || { code, name: code };
				})
			};
			this.editDialog = true;
		},
		cancelEdit() {
			this.editedProduct = null;
			this.editDialog = false;
		},
		cancelSelection() {
			this.selectionMode = false;
			this.selectedProducts = [];
		},
		async updateProduct() {
			try {
				const payload = {
					...this.editedProduct,
					allergen_tags: Array.isArray(this.editedProduct.allergen_tags)
						? this.editedProduct.allergen_tags.map(tag =>
							typeof tag === 'string' ? tag : tag.code
						)
						: [],
					producer_gluten_declaration: !!this.editedProduct.producer_gluten_declaration,
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
		async confirmBulkDeleteProducts() {
			if (this.selectedProducts.length === 0) return;
		
			const token = localStorage.getItem("token");
			try {
				await Promise.all(
					this.selectedProducts.map(async (product) => {
						const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
						if (!res.ok) throw new Error("Eroare la ștergere.");
					})
				);
		
				this.products = this.products.filter(
					p => !this.selectedProducts.some(sel => sel.id === p.id)
				);
		
				this.showSnackbar(`${this.selectedProducts.length} produs(e) șters(e).`);
				this.cancelSelection();
				this.showConfirmDialog = false;
			} catch (err) {
				console.error("Eroare la ștergerea în masă:", err);
				this.showSnackbar("Eroare la ștergerea în masă.", "error");
				this.cancelSelection();
				this.showConfirmDialog = false;
			}
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	}
};