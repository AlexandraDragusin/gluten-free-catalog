export default {
	name: "ManageStores",
	data() {
		return {
			stores: [],
			showFilterDialog: false,
			filters: {
				search: '',
				type: '',
				arig_partner: null,
				city: '',
				country: '',
				categories: []
			},
			filterOptions: {
				types: ['physical', 'online', 'mixed', 'restaurant'],
				cities: [],
				countries: [],
				categories: []
			},
			filterDraft: {
				search: '',
				type: '',
				arig_partner: null,
				city: '',
				country: '',
				categories: []
			},
			filteredStores: [],
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
			pagination: {
				page: 1,
				itemsPerPage: 10,
			},
			logoFile: null,
			logoPreview: null,
			headers: [
				{ title: "", value: "placeholder", sortable: false, width: "56px"},
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
	computed: {
		headersToUse() {
			return this.selectionMode
				? this.headers.filter(h => h.value !== "placeholder")
				: this.headers;
		},
		hasActiveFilters() {
			const f = this.filters;
			return (
				f.search ||
				f.type ||
				f.arig_partner !== null ||
				f.city ||
				f.country ||
				(f.categories && f.categories.length > 0)
			);
		}
	},
	watch: {
		stores: {
			handler() {
				this.applyFilters();
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		this.fetchStores();
	},
	methods: {
		applyFilters() {
			this.filteredStores = this.stores.filter(store => {
				const matchesSearch = !this.filters.search || store.name.toLowerCase().includes(this.filters.search.toLowerCase());
				const matchesType = !this.filters.type || store.type === this.filters.type;
				const matchesPartner = this.filters.arig_partner === null || store.arig_partner === this.filters.arig_partner;
				const matchesCity = !this.filters.city || (store.addresses || []).some(addr => addr.city === this.filters.city);
				const matchesCountry = !this.filters.country || (store.addresses || []).some(addr => addr.country === this.filters.country);
				const matchesCategories =
					this.filters.categories.length === 0 ||
					(this.filters.categories.some(cat => store.categories?.includes(cat)));
				return matchesSearch && matchesType && matchesPartner && matchesCity && matchesCountry && matchesCategories;
			});
		},
		applyFilterDialog() {
			this.filters = JSON.parse(JSON.stringify(this.filterDraft));
			this.showFilterDialog = false;
			this.applyFilters();
		},
		openFilterDialog() {
			this.filterDraft = JSON.parse(JSON.stringify(this.filters));
			this.showFilterDialog = true;
		},
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

				this.filterOptions.cities = [
					...new Set(data.flatMap(store => store.addresses?.map(addr => addr.city).filter(Boolean)))
				];
				
				this.filterOptions.countries = [
					...new Set(data.flatMap(store => store.addresses?.map(addr => addr.country).filter(Boolean)))
				];

				const allCategories = data.flatMap(store => store.categories || []);
				this.filterOptions.categories = [...new Set(allCategories)];

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
			this.logoFile = null;
			this.logoPreview = null;
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
				if (this.logoFile) {
					const formData = new FormData();
					formData.append("logo", this.logoFile);
				
					const uploadRes = await fetch("http://localhost:5000/api/stores/upload-logo", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`
						},
						body: formData
					});
				
					const uploadData = await uploadRes.json();
				
					if (!uploadRes.ok || !uploadData.logoUrl) {
						throw new Error("Eroare la upload logo.");
					}
				
					this.editedStore.logo_url = uploadData.logoUrl;
				}

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
		triggerLogoUpload() {
			this.$refs.logoInput.click();
		},
		handleLogoFile(event) {
			const file = event.target.files[0];
			if (!file) return;

			this.logoFile = file;
			this.logoPreview = URL.createObjectURL(file);

			const img = new Image();
			img.src = this.logoPreview;
			img.onload = () => {
				const isLandscape = img.width > img.height;
				const el = this.$refs.editLogo?.$el;
				if (el) {
					if (isLandscape) {
						el.style.width = "100%";
						el.style.height = "auto";
					} else {
						el.style.height = "100%";
						el.style.width = "auto";
					}
				}
			};
		},
		removeLogo() {
			this.logoFile = null;
			this.logoPreview = null;
			this.editedStore.logo_url = "";
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		},
		resetFilters() {
			this.filters = {
				search: '',
				type: '',
				arig_partner: null,
				city: '',
				country: '',
				categories: []
			};
			this.filterDraft = { ...this.filters };
			this.applyFilters();
		}
	}
};