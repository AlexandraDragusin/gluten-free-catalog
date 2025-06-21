export default {
	name: "ShoppingListDialog",
	props: {
		list: Object,
		modelValue: Boolean,
	},
	emits: ["update:modelValue", "updated"],
	data() {
		return {
			items: [],
			localItems: [],
			noImage: require("@/assets/no-image.png"),
			availableProducts: [],
			isAdding: false,
			isLoading: true,
			selectedProduct: null,
			snackbar: false,
			snackbarMessage: "",
			snackbarColor: "warning",
		};
	},
	watch: {
		modelValue: {
			immediate: true,
			async handler(val) {
				if (val) {
				await this.loadData();
				}
			}
		},
	},
	mounted() {
		this.fetchAvailableProducts();
	},
	methods: {
		closeDialog() {
			this.$emit("update:modelValue", false);
		},
		async fetchItems() {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 8000);

			try {
				const token = localStorage.getItem("token");
				const res = await fetch(
					`${process.env.VUE_APP_API_URL}/api/shopping-lists/${this.list.id}/items`,
					{ 
					headers: { Authorization: `Bearer ${token}` },
					signal: controller.signal 
					}
				);

				clearTimeout(timeoutId);

				if (!res.ok) throw new Error('Failed to fetch items');

				this.items = await res.json();
			} catch (err) {
				console.error("Eroare la fetch items:", err);

				this.showError(err.message.includes('aborted') 
					? 'Timeout la încărcarea datelor' 
					: 'Eroare server');

				this.items = [];
				throw err;
			}
		},
		async fetchAvailableProducts() {
			try {
			const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products`);
			const data = await res.json();
			this.availableProducts = data;
			} catch (err) {
			console.error("Eroare la încărcarea produselor:", err);
			}
		},
		async toggleChecked(item) {
			try {
			const token = localStorage.getItem("token");
			await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/items/${item.id}/check`, {
				method: "PATCH",
				headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ checked: !item.checked }),
			});
			item.checked = !item.checked;
			} catch (err) {
			console.error("Eroare la check/uncheck:", err);
			}
		},
		async updateQuantity(item) {
			try {
				const token = localStorage.getItem("token");
				await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/items/${item.id}/quantity`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ quantity: item.quantity }),
				});
			
				this.fetchItems();
			} catch (err) {
				console.error("Eroare la actualizare cantitate:", err);
				this.snackbarMessage = "Eroare la modificarea cantității.";
				this.snackbarColor = "error";
				this.snackbar = true;
			}
		},
		async addProduct() {
			if (!this.selectedProduct || this.isAdding) return;

			const alreadyExists = this.localItems.some(
				item => item.product_id === this.selectedProduct.id
			);

			if (alreadyExists) {
				this.snackbarMessage = "Produsul este deja în listă.";
				this.snackbarColor = "warning";
				this.snackbar = true;

				this.selectedProduct = null;
				return;
			}

			this.localItems.push({
				id: `temp-${Date.now()}`, // id temporar
				product_id: this.selectedProduct.id,
				name: this.selectedProduct.name,
				brand: this.selectedProduct.brand,
				image_url: this.selectedProduct.image_url,
				quantity: 1,
				checked: false,
				isNew: true, // marcat pentru creare
			});
		
			this.selectedProduct = null;
		},
		async loadData() {
			this.isLoading = true;
			
			try {
			await this.fetchItems();
			
			this.localItems = JSON.parse(JSON.stringify(this.items));
			} catch (error) {
				console.error('Eroare în loadData:', error);
				this.showError('Eroare la încărcare');
			} finally {
				this.isLoading = false;
			}
		},

		showError(message) {
			this.snackbarMessage = message;
			this.snackbarColor = 'error';
			this.snackbar = true;
		},
		deleteItem(itemId) {
			this.localItems = this.localItems.filter(item => item.id !== itemId);
		},
		async handleSave() {
			const token = localStorage.getItem("token");
		
			const seenProductIds = new Set();
			const newItems = this.localItems.filter(item => {
				if (item.isNew && !seenProductIds.has(item.product_id)) {
					seenProductIds.add(item.product_id);
					return true;
				}
				return false;
			});

			const updatedItems = this.localItems.filter(item => {
				const original = this.items.find(i => i.id === item.id);
				return (
					original &&
					(original.quantity !== item.quantity || original.checked !== item.checked)
				);
			});

			const deletedItems = this.items.filter(
				item => !this.localItems.some(i => i.id === item.id)
			);
		
			try {
				for (const item of newItems) {
					await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/${this.list.id}/items`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							product_id: item.product_id,
							quantity: item.quantity,
						}),
					});
				}
		
				for (const item of updatedItems) {
					await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/items/${item.id}/quantity`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ quantity: item.quantity }),
					});
		
					await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/items/${item.id}/check`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ checked: item.checked }),
					});
				}
		
				for (const item of deletedItems) {
					await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/items/${item.id}`, {
						method: "DELETE",
						headers: { Authorization: `Bearer ${token}` },
					});
				}
		
				this.$emit("updated");
				this.snackbarMessage = "Lista a fost actualizată cu succes.";
				this.snackbarColor = "success";
				this.snackbar = true;

				setTimeout(() => {
				this.$emit("update:modelValue", false);
				}, 1000);

			} catch (err) {
				console.error("Eroare la salvare:", err);
				this.snackbarMessage = "Eroare la salvarea modificărilor.";
				this.snackbarColor = "error";
				this.snackbar = true;
			}
		},
		handleCancel() {
			this.$emit("update:modelValue", false);
		}
	},
};