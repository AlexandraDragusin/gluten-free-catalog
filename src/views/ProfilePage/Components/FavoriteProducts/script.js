export default {
	data() {
		return {
			favoriteProducts: [],
		};
	},
	created() {
		this.fetchFavoriteProducts();
	},
	methods: {
		async fetchFavoriteProducts() {
			return;

		//	TO DO - fetch favorite products from the server

		// 	try {
		// 		const token = localStorage.getItem("token");
		// 		const response = await fetch("http://localhost:5000/api/favorites", {
		// 		method: "GET",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 		});

		// 		if (!response.ok) {
		// 		throw new Error("Failed to load favorite products");
		// 		}

		// 		this.favoriteProducts = await response.json();
		// 	} catch (error) {
		// 		console.error("Error fetching favorite products:", error);
		// 	}
		},
	},
};