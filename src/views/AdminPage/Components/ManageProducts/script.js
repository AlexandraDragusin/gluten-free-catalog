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
			pagination: {
				page: 1,
				itemsPerPage: 10,
			},
			storeOptions: [],
			filterDraft: {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			},
			filters: {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			},
			filteredProducts: [],
			showFilterDialog: false,
			productImageFile: null,
			productImagePreview: null,
			headers: [
				{ title: "", value: "placeholder", sortable: false, width: "56px"},
				{ title: "Nume", value: "name", sortable: true },
				{ title: "Brand", value: "brand", sortable: true },
				{ title: "Cantitate", value: "weight" },
				{ title: "Unitate de masura", value: "unit" },
				{ title: "Imagine", value: "image_url" },
				{ title: "Cod EAN", value: "ean_code" },
				{ title: "Categorie", value: "category_name" },
				{ title: "Magazin", value: "store_name" },
				{ title: "Acțiuni", value: "actions", sortable: false, width: "112px" },
			]
		};
	},
	computed: {
		headersToUse() {
			return this.selectionMode
				? this.headers.filter(h => h.value !== "placeholder")
				: this.headers;
		},
		hasActiveFilters() {
			return Object.values(this.filterDraft).some(v => {
				if (Array.isArray(v)) return v.length > 0;
				return v !== '' && v !== null;
			});
		}
	},
	watch: {
		pagination: {
			handler(newVal, oldVal) {
				if (newVal.page !== oldVal.page) {
					this.scrollToTop();
				}
			},
			deep: true
		}
	},
	created() {
		this.fetchStores();
		this.fetchAllergens();
		this.fetchCategories();
		this.fetchProducts();
	},
	methods: {
		async fetchProducts() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products`);
				const data = await res.json();

				const mappedProducts = data.map(p => {
					const allergenNames = p.allergen_tags.map(code => {
						const found = this.allergens.find(a => a.code === code);
						return found ? found.name : code;
					});
					const store = this.storeOptions.find(s => s.id === p.store_id);
					const category = this.categories.find(c => c.id === p.category_id);
				
					return {
						...p,
						allergen_tags_display: allergenNames.join(", "),
						store_name: store?.name || "Nespecificat",
						category_name: category?.name || "Nespecificat"
					};
				});

				this.products = mappedProducts;
				this.applyFilters();
			} catch (err) {
				console.error("Eroare la preluarea produselor:", err);
			}
		},
		async fetchCategories() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/categories`);
				const data = await res.json();
				this.categories = data;
			} catch (err) {
				console.error("Eroare la preluarea categoriilor:", err);
			}
		},
		async fetchAllergens() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/allergens`);
				const data = await res.json();
				this.allergens = data;
			} catch (err) {
				console.error("Eroare la preluarea alergenilor:",
				err);
			}
		},
		async fetchStores() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/stores`);
				const data = await res.json();
				this.storeOptions = data;
			} catch (err) {
				console.error("Eroare la preluarea magazinelor:", err);
			}
		},
		scrollToTop() {
			setTimeout(() => {
					window.scrollTo({
					top: 0,
					behavior: 'auto'
				});
			}, 0);
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
			this.productImageFile = null;
			this.productImagePreview = null;
		},
		cancelSelection() {
			this.selectionMode = false;
			this.selectedProducts = [];
		},
		async updateProduct() {
			try {
				// 
				if (this.productImageFile) {
					const formData = new FormData();
					formData.append("image", this.productImageFile);

					const uploadRes = await fetch(`${process.env.VUE_APP_API_URL}/api/products/upload-image`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`
						},
						body: formData
					});
				
					const uploadData = await uploadRes.json();
					if (!uploadRes.ok || !uploadData.imageUrl) {
						throw new Error("Eroare la upload imagine.");
					}
					this.editedProduct.image_url = uploadData.imageUrl;
				}				

				const payload = {
					...this.editedProduct,
					allergen_tags: Array.isArray(this.editedProduct.allergen_tags)
						? this.editedProduct.allergen_tags.map(tag =>
							typeof tag === 'string' ? tag : tag.code
						)
						: [],
					producer_gluten_declaration: !!this.editedProduct.producer_gluten_declaration,
				};

				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products/${payload.id}`, {
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
						const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products/${product.id}`, {
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

				this.applyFilters();
		
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
		applyFilters() {
			this.filteredProducts = this.products.filter(product => {
				const {
					name,
					brand,
					categories,
					made_in_romania,
					certified_arig,
					producer_gluten_declaration,
					excluded_allergens,
					stores
				} = this.filters;

				const matchesName = !name || product.name?.toLowerCase().includes(name.toLowerCase());
				const matchesBrand = !brand || product.brand?.toLowerCase().includes(brand.toLowerCase());
				const matchesMadeInRo = made_in_romania === null || product.made_in_romania === made_in_romania;
				const matchesCertArig = certified_arig === null || product.certified_arig === certified_arig;
				const matchesDecl = producer_gluten_declaration === null || product.producer_gluten_declaration === producer_gluten_declaration;
				const matchesCategory = categories.length === 0 || categories.includes(product.category_id);
				const excludedCodes = excluded_allergens.map(tag => typeof tag === 'string' ? tag : tag.code);
				const matchesAllergens = excludedCodes.length === 0 || !excludedCodes.some(code => product.allergen_tags.includes(code));
				const matchesStores = stores.length === 0 || stores.includes(product.store_id);
				return matchesName && matchesBrand && matchesMadeInRo && matchesCertArig &&
					matchesDecl && matchesCategory &&
					matchesAllergens && matchesStores;
			});
		},
		openFilterDialog() {
			this.filterDraft = JSON.parse(JSON.stringify(this.filters));
			this.showFilterDialog = true;
		},
		applyFilterDialog() {
			this.filters = {
				...this.filterDraft,
				categories: this.filterDraft.categories.map(cat => typeof cat === 'object' ? cat.id : cat),
				excluded_allergens: this.filterDraft.excluded_allergens.map(tag =>
					typeof tag === 'string' ? tag : tag.code
				)
			};

			this.showFilterDialog = false;
			this.applyFilters();
		},
		resetFilters() {
			this.filterDraft = {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			};

			this.filters = { ...this.filterDraft };
			this.applyFilters();
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		},
		getEmptyFilter() {
			return {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			};
		},
		toggleSwitch(field) {
			if (this.filterDraft[field] === null) {
				this.filterDraft[field] = true;
			} else if (this.filterDraft[field] === true) {
				this.filterDraft[field] = false;
			} else {
				this.filterDraft[field] = null;
			}
		},
		triggerImageUpload() {
			this.$refs.imageInput.click();
		},
		handleImageFile(event) {
			const file = event.target.files[0];
			if (!file) return;
		
			this.productImageFile = file;
			this.productImagePreview = URL.createObjectURL(file);
		
			const img = new Image();
			img.src = this.productImagePreview;
			img.onload = () => {
				const el = this.$refs.editImage?.$el;
				if (el) {
					const isLandscape = img.width > img.height;
					if (isLandscape) {
						el.style.width = "100%";
						el.style.height = "auto";
					} else {
						el.style.height = "100%";
						el.style.width = "auto";
					}
				}
			};
		},
		removeImage() {
			this.productImageFile = null;
			this.productImagePreview = null;
			this.editedProduct.image_url = "";
		},
		formatWeight(value) {
			if (value == null) return '';
			return parseFloat(value).toFixed(value % 1 === 0 ? 0 : 2);
		}
	}
};