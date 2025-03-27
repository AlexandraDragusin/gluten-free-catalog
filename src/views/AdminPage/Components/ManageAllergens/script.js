export default {
	name: "ManageAllergens",
	data() {
	return {
		allergens: [],
		newAllergen: { code: "", name: "" },
		editedAllergen: null,
		editDialog: false,
		originalCode: null,
		selectionMode: false,
		selectedAllergens: [],
		showConfirmDialog: false,
		showAddDialog: false,
		snackbar: {
			show: false,
			message: "",
			color: "success",
		},
		headers: [
			{ title: "Cod", value: "code" },
			{ title: "Nume alergen", value: "name" },
			{ title: "Acțiuni", value: "actions", sortable: false }
		]
	};
	},
	created() {
		this.fetchAllergens();
	},
	methods: {
		async fetchAllergens() {
			try {
				const res = await fetch("http://localhost:5000/api/allergens");
				this.allergens = await res.json();
			} catch (err) {
				console.error("Eroare la preluarea alergenilor:", err);
			}
		},
		async addAllergen() {
			const duplicate = this.allergens.find(
				(a) => a.code.toLowerCase() === this.newAllergen.code.toLowerCase() || 
					a.name.toLowerCase() === this.newAllergen.name.toLowerCase()
			);

			if (duplicate) {
				alert("Alergenul cu acest cod sau nume există deja.");
				return;
			}

			try {
				const res = await fetch("http://localhost:5000/api/allergens", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify(this.newAllergen)
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.error || "Eroare la adăugare.");
				}

				this.newAllergen = { code: "", name: "" };
				this.fetchAllergens();
				this.showAddDialog = false;
				this.showSnackbar("Alergen adăugat cu succes.");

			} catch (err) {
				console.error("Eroare la adăugare alergen:", err);
			}
		},
		editAllergen(item) {
			this.editedAllergen = {
				code: item.code,
				name: item.name,
				originalCode: item.code
			};

			this.editDialog = true;
		},
		cancelSelection() {
			this.selectionMode = false;
			this.selectedAllergens = [];
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		},
		cancelEdit() {
			this.editDialog = false;
			this.editedAllergen = null;
		},
		async updateAllergen() {
			try {
				if (!this.editedAllergen) return;

				const duplicate = this.allergens.find(
					(a) =>
						a.code.toLowerCase() === this.editedAllergen.code.toLowerCase() &&
						a.code !== this.editedAllergen.originalCode
				);
		
				if (duplicate) {
					alert("Există deja un alergen cu acest cod.");
					return;
				}

				const res = await fetch(
					`http://localhost:5000/api/allergens/${this.editedAllergen.originalCode}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`
						},
						body: JSON.stringify({
							code: this.editedAllergen.code,
							name: this.editedAllergen.name
						})
					}
				);

				if (!res.ok) throw new Error("Eroare la actualizare.");

				this.editDialog = false;
				this.editedAllergen = null;
				this.fetchAllergens();
			} catch (err) {
				console.error("Eroare la actualizare alergen:", err);
			}
		},
		async confirmBulkDelete() {
			if (this.selectedAllergens.length === 0) return;
		
			try {
				await Promise.all(
					this.selectedAllergens.map(async (allergen) => {
						const res = await fetch(`http://localhost:5000/api/allergens/${allergen.code}`, {
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${localStorage.getItem("token")}`,
							},
						});
						if (!res.ok) throw new Error("Eroare la ștergere");
					})
				);
		
				this.allergens = this.allergens.filter(
					(a) => !this.selectedAllergens.some((sel) => sel.code === a.code)
				);
				this.showSnackbar(`${this.selectedAllergens.length} alergen(i) șters(i).`);
				this.cancelSelection();
				this.showConfirmDialog = false;
		
			} catch (err) {
				console.error("Eroare la ștergerea în masă:", err);
				this.showSnackbar("Eroare la ștergerea în masă.", "error");
				this.cancelSelection();
				this.showConfirmDialog = false;
			}
		},
	}
};