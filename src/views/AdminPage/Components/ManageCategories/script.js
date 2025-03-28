export default {
	name: "ManageCategories",
	data() {
		return {
			categories: [],
			editedCategory: null,
			newCategory: "",
			editDialog: false,
			originalName: null,
			showAddDialog: false,
			selectionMode: false,
			selectedCategories: [],
			showConfirmDialog: false,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			pagination: {
				page: 1,
				itemsPerPage: 10,
			},
			headers: [
				{ title: "", value: "placeholder", sortable: false, width: "56px"},
				{ title: "Nume categorie", value: "name" },
				{ title: "Acțiuni", value: "actions", sortable: false, width: '112px' }
			]
		};
	},
	computed: {
		headersToUse() {
			return this.selectionMode
				? this.headers.filter(h => h.value !== "placeholder")
				: this.headers;
		}
	},
	created() {
		this.fetchCategories();
	},
	methods: {
		async fetchCategories() {
			try {
				const res = await fetch("http://localhost:5000/api/categories");
				const data = await res.json();
				this.categories = data.map((name) => ({ name }));
			} catch (err) {
				console.error("Eroare la preluarea categoriilor:", err);
			}
		},
		editCategory(category) {
			this.editedCategory = { ...category };
			this.originalName = category.name;
			this.editDialog = true;
		},
		cancelEdit() {
			this.editedCategory = null;
			this.editDialog = false;
			this.originalName = null;
		},
		cancelSelection() {
			this.selectionMode = false;
			this.selectedCategories = [];
		},
		async updateCategory() {
			try {
				const res = await fetch(`http://localhost:5000/api/categories/${this.originalName}`, {
					method: "PUT",
					headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify({ name: this.editedCategory.name })
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.error || "Eroare la actualizare.");
				}

				this.showSnackbar("Categorie actualizată cu succes.");
				this.cancelEdit();
				this.fetchCategories();
			} catch (err) {
				this.showSnackbar(err.message, "error");
			}
		},
		async confirmBulkDelete() {
			if (this.selectedCategories.length === 0) return;
		
			try {
				const token = localStorage.getItem("token");
		
				await Promise.all(
					this.selectedCategories.map(async (cat) => {
						const res = await fetch(`http://localhost:5000/api/categories/${cat.name}`, {
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
						if (!res.ok) throw new Error("Eroare la ștergere");
					})
				);
		
				this.categories = this.categories.filter(
					(c) => !this.selectedCategories.some((sel) => sel.name === c.name)
				);
		
				this.showSnackbar(`${this.selectedCategories.length} categorie(i) șters(e).`);
				this.cancelSelection();
				this.showConfirmDialog = false;
			} catch (err) {
				console.error("Eroare la ștergerea în masă:", err);
				this.showSnackbar("Eroare la ștergerea în masă.", "error");
				this.cancelSelection();
				this.showConfirmDialog = false;
			}
		},
		async submitAddCategory() {
			if (!this.newCategory.trim()) {
				this.showSnackbar("Completează denumirea categoriei.", "error");
				return;
			}
		
			try {
				const res = await fetch("http://localhost:5000/api/categories", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({ name: this.newCategory }),
				});
		
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || "Eroare la adăugare.");
				}
		
				this.newCategory = "";
				this.showAddDialog = false;
				this.showSnackbar("Categorie adăugată cu succes.");
				await this.fetchCategories();
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