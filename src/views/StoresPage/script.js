export default {
	name: "StoresPage",
	data() {
		return {
			stores: [],
			sortOrder: 'asc',
			filters: {
				type: '',
				arig_partner: null,
				city: '',
				country: '',
				categories: []
			},
			filterDraft: {
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
			showFilterDialog: false,
			pagination: {
				page: 1,
				itemsPerPage: 5,
			},
		};
	},
	emits: ["navigate-to-store-detail"],
	watch: {
		"$route.params.type"(newType) {
			if (this.filterOptions.types.includes(newType)) {
				this.filters.type = newType;
				this.filterDraft.type = newType;
				this.pagination.page = 1;
			} else {
				this.filters.type = '';
				this.filterDraft.type = '';
			}
		} 
	},
	computed: {
		pageCount() {
			return Math.ceil(this.filteredStores.length / this.pagination.itemsPerPage);
		},
		paginatedStores() {
			const start = (this.pagination.page - 1) * this.pagination.itemsPerPage;
			const end = start + this.pagination.itemsPerPage;
			return this.filteredStores.slice(start, end);
		},
		filteredStores() {
			const filtered = this.stores.filter(store => {
				const matchesType = !this.filters.type || store.type === this.filters.type;
				const matchesPartner = this.filters.arig_partner === null || store.arig_partner === this.filters.arig_partner;
				const matchesCity = !this.filters.city || (store.addresses || []).some(addr => addr.city === this.filters.city);
				const matchesCountry = !this.filters.country || (store.addresses || []).some(addr => addr.country === this.filters.country);
				const matchesCategories =
					this.filters.categories.length === 0 ||
					this.filters.categories.some(filterCat => 
						store.categories.includes(filterCat.id)
					);
		
				return matchesType && matchesPartner && matchesCity && matchesCountry && matchesCategories;
			});

			return filtered.sort((a, b) => {
				if (!a.name || !b.name) return 0;
		
				if (this.sortOrder === 'asc') {
					return a.name.localeCompare(b.name);
				} else {
					return b.name.localeCompare(a.name);
				}
			});
		},
	},
	created() {
		const typeFromParams = this.$route.params.type;
		if (this.filterOptions.types.includes(typeFromParams)) {
			this.filters.type = typeFromParams;
			this.filterDraft.type = typeFromParams;
		}

		this.fetchStores();
	},
	methods: {
		async fetchStores() {
			try {
					const categoriesRes = await fetch(`${process.env.VUE_APP_API_URL}/api/categories`);
					const categories = await categoriesRes.json();

					const storesRes = await fetch(`${process.env.VUE_APP_API_URL}/api/stores`);
					const storesData = await storesRes.json();

					const usedCategoryIds = new Set();

					const storesWithCategories = await Promise.all(
						storesData.map(async (store) => {
							const storeCategoriesRes = await fetch(`${process.env.VUE_APP_API_URL}/api/store_categories/${store.id}`);
							const storeCategories = await storeCategoriesRes.json();
							store.categories = storeCategories.map(cat => cat.category_id);

							store.categories.forEach(catId => usedCategoryIds.add(catId));
							return store;
						})
					);

					this.stores = storesWithCategories;

					this.filterOptions.categories = categories.filter(cat => usedCategoryIds.has(cat.id));

					this.filterOptions.cities = [
						...new Set(storesData.flatMap(store => store.addresses?.map(addr => addr.city).filter(Boolean)))
					];
					this.filterOptions.countries = [
						...new Set(storesData.flatMap(store => store.addresses?.map(addr => addr.country).filter(Boolean)))
					];

			} catch (err) {
				console.error("Eroare la încărcarea magazinelor:", err);
			}
		},
		formatAddress(address) {
			if (!address) return "-";
			return `${address.address || ""}, ${address.city || ""}, ${address.country || ""}`.trim();
		},
		extractUniqueCities(addresses) {
			return [...new Set(
				addresses
					.map(addr => addr.city)
					.filter(Boolean)
			)];
		},
		applyFilters() {
			this.filters = JSON.parse(JSON.stringify(this.filterDraft));
			this.pagination.page = 1;
			this.showFilterDialog = false;

			this.$emit("navigate-to-stores", this.filters.type || null);
		},
		openFilterDialog() {
			this.filterDraft = JSON.parse(JSON.stringify(this.filters));
			this.showFilterDialog = true;
		},
		resetFilters() {
			this.filters = {
				type: '',
				arig_partner: null,
				city: '',
				country: '',
				categories: []
			};

			this.filterDraft = JSON.parse(JSON.stringify(this.filters));
			this.pagination.page = 1;

			this.$emit("navigate-to-stores");
		},
		toggleSortOrder() {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
		},
		goToStoreDetail(storeId, storeName) {
			this.$emit("navigate-to-store-detail", storeId, storeName);
		}
	},
};