export default {
	name: "ManageCategories",
	data() {
		return {
			categories: [],
			editedCategory: null,
			newCategory: "",
			editDialog: false,
			originalName: null,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			headers: [
				{ title: "Nume categorie", value: "name" },
				{ title: "Acțiuni", value: "actions", sortable: false, width: '112px' }
			]
		};
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
		async deleteCategory(category) {
			if (!confirm(`Sigur vrei să ștergi categoria "${category.name}"?`)) return;

			try {
				const res = await fetch(`http://localhost:5000/api/categories/${category.name}`, {
					method: "DELETE",
					headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.error || "Eroare la ștergere.");
				}

				this.showSnackbar("Categorie ștearsă cu succes.");
				this.fetchCategories();

			} catch (err) {
				this.showSnackbar(err.message, "error");
			}
		},
		async addCategory() {
			try {
				const res = await fetch("http://localhost:5000/api/categories", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify({ name: this.newCategory })
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message || "Eroare la adăugare.");
				}

				this.newCategory = "";
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