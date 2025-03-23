export default {
	name: "ManageAllergens",
	data() {
	return {
		allergens: [],
		newAllergen: { code: "", name: "" },
		editedAllergen: null,
		editDialog: false,
		originalCode: null,
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
		async deleteAllergen(item) {
			if (!confirm(`Sigur vrei să ștergi alergenul "${item.name}"?`)) return;
			try {
				const res = await fetch(
					`http://localhost:5000/api/allergens/${item.code}`,
					{
						method: "DELETE",
						headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`
						}
					}
				);

				if (!res.ok) throw new Error("Eroare la ștergere");

				this.fetchAllergens();
			} catch (err) {
				console.error("Eroare la ștergere alergen:", err);
			}
		}
	}
};