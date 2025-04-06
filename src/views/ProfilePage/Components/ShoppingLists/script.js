import ShoppingListDialog from '../ShoppingListDialog/ShoppingListDialog.vue';

export default {
	name: "ShoppingLists",
	components: { ShoppingListDialog },
	data() {
		return {
			lists: [],
			searchQuery: "",
			sortOption: "recent",
			sortOptions: [
				{ text: "Cele mai recente", value: "recent" },
				{ text: "Cele mai vechi", value: "oldest" },
				{ text: "Alfabetic", value: "alpha" },
			],
			showAddListDialog: false,
			newListName: "",
			selectedList: null,
			showListDialog: false,
		};
	},
	computed: {
		filteredAndSortedLists() {
			let filtered = this.lists.filter(list => {
				const name = list?.name ?? "";
				const query = this.searchQuery ?? "";
				return name.toLowerCase().includes(query.toLowerCase());
			});

			switch (this.sortOption) {
				case "alpha":
					return filtered.sort((a, b) => a.name.localeCompare(b.name));
				case "oldest":
					return filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
				default:
					return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
			}
		},
	},
	created() {
		this.fetchLists();
	},
	methods: {
		async fetchLists() {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch("http://localhost:5000/api/shopping-lists", {
				headers: { Authorization: `Bearer ${token}` },
			});

			this.lists = await response.json();
		} catch (err) {
			console.error("Eroare la încărcarea listelor:", err);
		}
		},
		async createList() {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch("http://localhost:5000/api/shopping-lists", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name: this.newListName }),
			});

			if (!response.ok) throw new Error("Eroare la creare listă");

			this.showAddListDialog = false;
			this.newListName = "";
			this.fetchLists();
		} catch (err) {
			console.error("Eroare la creare listă:", err);
		}
		},
		async deleteList(id) {
		try {
			const token = localStorage.getItem("token");
			await fetch(`http://localhost:5000/api/shopping-lists/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			this.fetchLists();
		} catch (err) {
			console.error("Eroare la ștergere listă:", err);
		}
		},
		formatDate(dateStr) {
			return new Date(dateStr).toLocaleDateString("ro-RO");
		},
		openListDialog(list) {
			this.selectedList = list;
			this.showListDialog = true;
		},
		exportToPDF(id) {
			// Placeholder – va fi implementat mai jos
			console.log("Export to PDF list ID:", id);
		},
		shareList(list) {
			// Placeholder – deschide dialog / copiază link
			console.log("Partajează lista:", list);
		},
	},
};