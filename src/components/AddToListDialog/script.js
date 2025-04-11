export default {
	name: 'AddToListDialog',
	props: {
		modelValue: Boolean,
		productName: String,
		productId: Number
	},
	emits: ['update:modelValue'],
	data() {
		return {
			selected: null,
			existingProductIds: [],
			shoppingLists: [],
			snackbar: false,
			snackbarColor: "success",
			snackbarText: ""
		};
	},
	watch: {
		modelValue(newVal) {
			if (!newVal) {
				this.snackbar = false;
				this.snackbarText = "";
				this.snackbarColor = "success";
				this.selected = null;
				this.existingProductIds = [];
			}
		},
		selected(newVal) {
			if (newVal) this.fetchItemsForList(newVal);
		}
	},
	async mounted() {
		await this.fetchShoppingLists();
	},
	methods: {
		cancel() {
			this.selected = null;
			this.$emit('update:modelValue', false);
		},
		async fetchItemsForList(listId) {
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`http://localhost:5000/api/shopping-lists/${listId}/items`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				const data = await res.json();
				this.existingProductIds = data.map(item => item.product_id);
			} catch (err) {
				console.error("Eroare la verificarea produselor din listă:", err);
			}
		},
		async fetchShoppingLists() {
			try {
				const token = localStorage.getItem("token");
				const res = await fetch("http://localhost:5000/api/shopping-lists", {
					headers: { Authorization: `Bearer ${token}` }
				});
				this.shoppingLists = await res.json();
			} catch (err) {
				console.error("Eroare la fetch shopping lists:", err);
			}
		},
		async confirm() {
			if (this.existingProductIds.includes(this.productId)) {
				this.snackbarText = "Produsul există deja în listă.";
				this.snackbarColor = "warning";
				this.snackbar = true;
				return;
			}
		
			try {
				await fetch(`http://localhost:5000/api/shopping-lists/${this.selected}/items`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify({ product_id: this.productId })
				});
		
				this.snackbarText = "Produsul a fost adăugat cu succes!";
				this.snackbar = true;
				this.snackbarColor = "success";

				setTimeout(() => {
					this.$emit("update:modelValue", false);
					this.selected = null;
				}, 1200);
		
			} catch (err) {
				console.error("Eroare la adăugare:", err);
				this.snackbarText = "A apărut o eroare la adăugare.";
				this.snackbarColor = "error";
				this.snackbar = true;
			}
		}
	},
};