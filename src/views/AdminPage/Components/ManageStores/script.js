export default {
	name: "ManageStores",
	data() {
		return {
			stores: [],
			editedStore: null,
			editDialog: false,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			headers: [
				{ title: "Logo", value: "logo_url" },
				{ title: "Nume", value: "name" },
				{ title: "Tip", value: "type_display", sortable: false },
				{ title: "Website", value: "website" },
				{ title: "Partener ARIG", value: "arig_partner" },
				{ title: "Discount", value: "discount_percentage" },
				{ title: "Descriere", value: "description" },
				{ title: "Acțiuni", value: "actions", sortable: false, width: "100px" }
			]
		};
	},
	created() {
		this.fetchStores();
	},
	methods: {
		async fetchStores() {
			try {
				const res = await fetch("http://localhost:5000/api/stores");
				const data  = await res.json();

				this.stores = data.map(store => ({
					...store,
					type_display: {
							physical: "Fizic",
							online: "Online",
							mixed: "Mixt",
							restaurant: "Restaurant"
					}[store.type] || store.type
				}));

			} catch (err) {
				console.error("Eroare la preluarea magazinelor:", err);
			}
		},
		openEditDialog(store) {
			this.editedStore = { ...store };
			this.editDialog = true;
		},
		cancelEdit() {
			this.editDialog = false;
			this.editedStore = null;
		},
		async updateStore() {
			const valid = this.$refs.storeForm?.validate?.();
			if (valid === false) return;

			if (this.editedStore.discount_percentage < 0 || this.editedStore.discount_percentage > 100) {
				this.showSnackbar("Discountul trebuie să fie între 0 și 100.", "error");
				return;
			}

			try {
				const res = await fetch(`http://localhost:5000/api/stores/${this.editedStore.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify(this.editedStore)
				});

				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.error || "Eroare la actualizare magazin.");
				}

				this.showSnackbar("Magazin actualizat cu succes.");
				this.fetchStores();
				this.cancelEdit();
			} catch (err) {
				this.showSnackbar(err.message, "error");
			}
		},
		async deleteStore(store) {
			if (!confirm(`Sigur vrei să ștergi magazinul "${store.name}"?`)) return;

			try {
			const res = await fetch(`http://localhost:5000/api/stores/${store.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`
				}
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || "Eroare la ștergere.");
			}

			this.showSnackbar("Magazin șters cu succes.");

			this.fetchStores();
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