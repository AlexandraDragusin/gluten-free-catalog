export default {
	name: "ManageStores",
	data() {
		return {
			stores: [],
			selectedStores: [],
			selectionMode: false,
			showConfirmDialog: false,
			editedStore: null,
			editDialog: false,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			headers: [
				{ title: "Logo", value: "logo_url" },
				{ title: "Nume", value: "name", sortable: true },
				{ title: "Tip", value: "type_display", sortable: false },
				{ title: "Website", value: "website" },
				{ title: "Partener ARIG", value: "arig_partner" },
				{ title: "Discount", value: "discount_percentage" },
				{ title: "Acțiuni", value: "actions", sortable: false }
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
		cancelSelection() {
			this.selectionMode = false;
			this.selectedStores = [];
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
		async confirmBulkDeleteStores() {
			if (this.selectedStores.length === 0) return;
		
			const token = localStorage.getItem("token");
			try {
				await Promise.all(
					this.selectedStores.map(async (store) => {
						const res = await fetch(`http://localhost:5000/api/stores/${store.id}`, {
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
						if (!res.ok) throw new Error("Eroare la ștergere");
					})
				);
		
				this.stores = this.stores.filter(
					s => !this.selectedStores.some(sel => sel.id === s.id)
				);
		
				this.showSnackbar(`${this.selectedStores.length} magazin(e) șters(e).`);
				this.cancelSelection();
				this.showConfirmDialog = false;
			} catch (err) {
				console.error("Eroare la ștergerea în masă:", err);
				this.showSnackbar("Eroare la ștergerea în masă.", "error");
				this.cancelSelection();
				this.showConfirmDialog = false;
			}
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	}
};