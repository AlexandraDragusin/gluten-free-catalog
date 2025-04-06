  export default {
	name: "FavoriteProducts",
	data() {
		return {
			favoriteProducts: [],
			noImage: require('@/assets/no-image.png') ,
			shoppingLists: [],
			showListDialog: false,
			selectedListId: null,
			productToAdd: null,
			snackbar: false,
			snackbarMessage: "",
			snackbarColor: "success",
		};
	},
	created() {
		this.fetchFavoriteProducts();
	},
	methods: {
		async fetchFavoriteProducts() {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.warn("Token lipsă – utilizatorul nu e autentificat.");
					return;
				}

				const response = await fetch("http://localhost:5000/api/favorites", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Eroare la încărcarea produselor favorite");
				}

				this.favoriteProducts = await response.json();
			} catch (error) {
				console.error("Eroare la fetch favorite products:", error);
			}
		},
		async removeFromFavorites(productId) {
			try {
				const token = localStorage.getItem("token");
				await fetch("http://localhost:5000/api/favorites", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ product_id: productId }),
				});
				this.favoriteProducts = this.favoriteProducts.filter(p => p.id !== productId);
			} catch (err) {
				console.error("Eroare la ștergerea din favorite:", err);
			}
		},
		async fetchShoppingLists() {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch("http://localhost:5000/api/shopping-lists", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				this.shoppingLists = await response.json();
			} catch (err) {
				console.error("Eroare la fetch shopping lists:", err);
			}
		},
		async confirmAddToList() {
			try {
				const alreadyInList = await this.isProductInList(this.productToAdd, this.selectedListId);
				if (alreadyInList) {
					this.snackbarMessage = "Produsul există deja în listă.";
					this.snackbarColor = "warning";
					this.snackbar = true;
					this.showListDialog = false;
					return;
				}

				const token = localStorage.getItem("token");
				await fetch(`http://localhost:5000/api/shopping-lists/${this.selectedListId}/items`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ product_id: this.productToAdd }),
				});

				this.snackbarMessage = "Produsul a fost adăugat cu succes!";
				this.snackbarColor = "success";
				this.snackbar = true;

			} catch (err) {
				console.error("Eroare la adăugarea în lista de cumpărături:", err);

				this.snackbarMessage = "Eroare la adăugare în listă!";
				this.snackbarColor = "error";
				this.snackbar = true;
			}  finally {
				this.showListDialog = false;
				this.productToAdd = null;
				this.selectedListId = null;
			}
		},
		async isProductInList(productId, listId) {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(`http://localhost:5000/api/shopping-lists/${listId}/items`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const items = await response.json();
				return items.some(item => item.product_id === productId);
			} catch (err) {
				console.error("Eroare la verificarea existenței produsului în listă:", err);
				return false;
			}
		},
		openListDialog(productId) {
			this.productToAdd = productId;
			this.fetchShoppingLists();
			this.showListDialog = true;
		},
		getProductName(id) {
			const product = this.favoriteProducts.find(p => p.id === id);
			return product?.name || "produs";
		}
	},
};