export default {
	data() {
		return {
			shoppingLists: [],
			newShoppingList: "",
		};
	},
	created() {
		this.fetchShoppingLists();
	},
	methods: {
		async fetchShoppingLists() {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch("http://localhost:5000/api/shopping-lists", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			});

			if (!response.ok) {
				throw new Error("Failed to load shopping lists");
			}

			this.shoppingLists = await response.json();
		} catch (error) {
			console.error("Error fetching shopping lists:", error);
		}
		},
		async addShoppingList() {
		if (!this.newShoppingList.trim()) return;
		try {
			const token = localStorage.getItem("token");
			const response = await fetch("http://localhost:5000/api/shopping-lists", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ name: this.newShoppingList }),
			});

			if (!response.ok) {
				throw new Error("Failed to add shopping list");
			}

			this.shoppingLists.push(await response.json());
			this.newShoppingList = "";
		} catch (error) {
			console.error("Error adding shopping list:", error);
		}
		},
		async deleteShoppingList(listId) {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`http://localhost:5000/api/shopping-lists/${listId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			});

			if (!response.ok) {
				throw new Error("Failed to delete shopping list");
			}

			this.shoppingLists = this.shoppingLists.filter(list => list.id !== listId);
		} catch (error) {
			console.error("Error deleting shopping list:", error);
		}
		},
	},
};