import AddToListDialog from "@/components/AddToListDialog/AddToListDialog.vue";

  export default {
	name: "FavoriteProducts",
	components: { AddToListDialog },
	data() {
		return {
			favoriteProducts: [],
			noImage: require('@/assets/no-image.png') ,
			showListDialog: false,
			productToAdd: null,
		};
	},
	emits: ["navigate-to-product-detail"],
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

				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/favorites`, {
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
				await fetch(`${process.env.VUE_APP_API_URL}/api/favorites`, {
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
		openListDialog(productId) {
			this.productToAdd = productId;
			this.showListDialog = true;
		},
		getProductName(id) {
			const product = this.favoriteProducts.find(p => p.id === id);
			return product?.name || "produs";
		}
	},
};