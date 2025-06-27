import LoginRequiredPrompt from "@/components/LoginRequiredPrompt/LoginRequiredPrompt.vue";
import AddToListDialog from "@/components/AddToListDialog/AddToListDialog.vue";
import { groupedCategories } from "@/utils/categories";
import { jwtDecode } from "jwt-decode";

export default {
	name: 'ProductsPage',
	components: { LoginRequiredPrompt, AddToListDialog },
	data() {
		return {
			isLoading: true,
			products: [],
			filteredProducts: [],
			categories: [],
			sortOrder: 'asc',
			showFilterDialog: false,
			cardSize: 0,
			pagination: {
				page: 1,
				itemsPerPage: 30,
			},
			filterDraft: {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			},
			filters: {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			},
			snackbar: {
				show: false,
				text: '',
				color: 'success'
			},
			allergens: [],
			storeOptions: [],
			favoriteProductIds: [],
			userId: null,
			userRole: null,
			showLoginPrompt: false,
			showAddDialog: false,
			productToAdd: null
		};
	},
	emits: [
		'navigate-to-products',
		'navigate-to-product-detail'
	],
	computed: {
		pageCount() {
			return Math.ceil(this.filteredProducts.length / this.pagination.itemsPerPage);
		},
		paginatedProducts() {
			const start = (this.pagination.page - 1) * this.pagination.itemsPerPage;
			const end = start + this.pagination.itemsPerPage;
			return this.filteredProducts.slice(start, end);
		},
		hasActiveFilters() {
			const f = this.filters;
			return (
				f.categories.length > 0 ||
				f.excluded_allergens.length > 0 ||
				f.stores.length > 0 ||
				f.made_in_romania !== null ||
				f.certified_arig !== null ||
				f.producer_gluten_declaration !== null
			);
		}
	},
	watch: {
		'$route.params.category'(newVal) {
			if (!this.categories.length) return;

			const key = newVal?.toLowerCase();

			if (key && groupedCategories[key]) {
				const subcategoryNames = groupedCategories[key];
	
				const matchedIds = this.categories
					.filter(cat => subcategoryNames.includes(cat.name))
					.map(cat => cat.id);
	
				this.filters.categories = matchedIds;
				this.filterDraft.categories = matchedIds;
			} else {
				this.filters.categories = [];
				this.filterDraft.categories = [];
			}

			this.applyFilters();
		},
		pagination: {
			handler(newVal, oldVal) {
				if (newVal.page !== oldVal.page) {
					this.scrollToTop();
				}
			},
			deep: true
		}
	},
	created() {
		const routeCategory = this.$route.params.category;

		const token = localStorage.getItem("token");

		if (token) {
			try {
				const decoded = jwtDecode(token);

				this.userId = decoded.id;
				this.userRole = decoded.role;
			} catch (e) {
				console.error("Token invalid sau expirat", e);
				this.userId = null;
				this.userRole = null;
			}
		}

		this.fetchProducts();
		this.fetchCategories();
		this.fetchAllergens();
		this.fetchStores();
		this.fetchFavorites();

		if (routeCategory && groupedCategories[routeCategory]) {
			const subcategoryNames = groupedCategories[routeCategory];
	
			const matchedIds = this.categories
				.filter(cat => subcategoryNames.includes(cat.name))
				.map(cat => cat.id);
	
			this.filters.categories = matchedIds;
			this.filterDraft.categories = matchedIds;
		}
	},
	mounted() {
		this.updateCardSize();
		window.addEventListener('resize', this.updateCardSize);
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.updateCardSize);
	},
	methods: {
		async fetchProducts() {
			try {
				this.isLoading = true;
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products`);
				const data = await res.json();
				this.products = data;
				this.applyFilters();
			} catch (err) {
				console.error('Eroare la încărcarea produselor:', err);
			} finally {
				this.isLoading = false;
			}
		},
		async fetchCategories() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/categories`);
				const data = await res.json();
				this.categories = data;

				// If a category is passed in the route, filter the products based on that category
				const routeCategory = this.$route.params.category;
				if (routeCategory) {
					const key = routeCategory.toLowerCase();
					const subcategoryNames = groupedCategories[key] || [];

					const matchedIds = data
						.filter(cat => subcategoryNames.includes(cat.name))
						.map(cat => cat.id);

					this.filters.categories = matchedIds;
					this.filterDraft.categories = matchedIds;
					this.applyFilters();
				}
			} catch (err) {
				console.error('Eroare la încărcarea categoriilor:', err);
			}
		},
		async fetchAllergens() {
			const res = await fetch(`${process.env.VUE_APP_API_URL}/api/allergens`);
			this.allergens = await res.json();
		},
		async fetchStores() {
			const res = await fetch(`${process.env.VUE_APP_API_URL}/api/stores`);
			this.storeOptions = await res.json();
		},
		async fetchFavorites() {
			if (!this.userId || this.userRole === "admin") return;

			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/favorites`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				const data = await res.json();
				this.favoriteProductIds = data.map(p => p.id);
			} catch (err) {
				console.error("Eroare la încărcarea favoritelor:", err);
			}
		},
		async toggleFavorite(productId) {
			if (!this.userId || this.userRole === "admin") {
				this.showLoginPrompt = true;
				return;
			}
	
			const isFavorite = this.favoriteProductIds.includes(productId);
			const url = `${process.env.VUE_APP_API_URL}/api/favorites`;
			const method = isFavorite ? 'DELETE' : 'POST';

			try {
				await fetch(url, {
					method,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({ product_id: productId }),
				});

				if (isFavorite) {
					this.favoriteProductIds = this.favoriteProductIds.filter(id => id !== productId);

					this.snackbar = {
						show: true,
						text: 'Produsul a fost eliminat din favorite.',
						color: 'warning'
					};
				} else {
					this.favoriteProductIds.push(productId);

					this.snackbar = {
						show: true,
						text: 'Produsul a fost adăugat la favorite.',
						color: 'success'
					};
				}
			} catch (err) {
				console.error("Eroare la toggle favorite:", err);

				this.snackbar = {
					show: true,
					text: 'A apărut o eroare. Încearcă din nou.',
					color: 'error'
				};
			}
		},
		scrollToTop() {
			setTimeout(() => {
					window.scrollTo({
					top: 0,
					behavior: 'auto'
				});
			}, 0);
		},
		getProductName(id) {
			const product = this.products.find(p => p.id === id);
			return product?.name || "produs";
		},
		applyFilters() {
			const filteredProducts = this.products.filter(product => {
				const {
					categories,
					made_in_romania,
					certified_arig,
					producer_gluten_declaration,
					excluded_allergens,
					stores
				} = this.filters;

				let validCategories = categories;
				const routeCategory = this.$route.params.category;
				if (routeCategory && groupedCategories[routeCategory.toLowerCase()] && validCategories.length === 0) {
					validCategories = groupedCategories[routeCategory.toLowerCase()];
				}

				const matchesMadeInRo = made_in_romania === null || product.made_in_romania === made_in_romania;
				const matchesCertArig = certified_arig === null || product.certified_arig === certified_arig;
				const matchesDecl = producer_gluten_declaration === null || product.producer_gluten_declaration === producer_gluten_declaration;
				const matchesCategory = validCategories.length === 0 || validCategories.includes(product.category_id);
				const excludedCodes = (excluded_allergens || []).map(tag =>
					typeof tag === 'string' ? tag : tag.code
				);
				const matchesAllergens = excludedCodes.length === 0 || !excludedCodes.some(code => (product.allergen_tags || []).includes(code));
				const matchesStores = stores.length === 0 || stores.includes(product.store_id);

				return  matchesMadeInRo && matchesCertArig &&
					matchesDecl && matchesCategory &&
					matchesAllergens && matchesStores;
			});

			this.filteredProducts = filteredProducts.sort((a, b) => {
				if (!a.name || !b.name) return 0;
				return this.sortOrder === 'asc'
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name);
			});
		},
		toggleSortOrder() {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
			this.applyFilters();
		},
		toggleSwitch(field) {
			if (this.filterDraft[field] === null) {
				this.filterDraft[field] = true;
			} else if (this.filterDraft[field] === true) {
				this.filterDraft[field] = false;
			} else {
				this.filterDraft[field] = null;
			}
		},
		openFilterDialog() {
			this.filterDraft = JSON.parse(JSON.stringify(this.filters));
			this.showFilterDialog = true;
		},
		applyFilterDialog() {
			this.filters = {
				...this.filterDraft,
				categories: this.filterDraft.categories.map(cat =>
					typeof cat === 'object' ? cat.id : cat
				),
				excluded_allergens: this.filterDraft.excluded_allergens.map(tag =>
					typeof tag === 'string' ? tag : tag.code
				),
				stores: this.filterDraft.stores.map(store =>
					typeof store === 'object' ? store.id : store
				)
			};

			this.showFilterDialog = false;
			this.applyFilters();
		},
		openListDialog(productId) {
			if (!this.userId || this.userRole === "admin") {
				this.showLoginPrompt = true;
				return;
			}
			this.productToAdd = productId;
			this.showAddDialog = true;
		},
		resetFilters() {
			this.filters = {
				name: '',
				brand: '',
				categories: [],
				made_in_romania: null,
				certified_arig: null,
				producer_gluten_declaration: null,
				excluded_allergens: [],
				stores: []
			};
			this.applyFilters();
			this.$emit('navigate-to-products');
		},
		updateCardSize() {
			const containerEl = this.$refs.productContainer?.$el;
			if (!containerEl) return;

			const containerWidth = containerEl.getBoundingClientRect().width;
			const availableWidth = containerWidth * 0.9; // păstrăm 90%

			let itemsPerRow = 5;
			if (availableWidth < 1200) itemsPerRow = 4;
			if (availableWidth < 900) itemsPerRow = 3;
			if (availableWidth < 600) itemsPerRow = 2;
			if (availableWidth < 400) itemsPerRow = 1;

			const spacing = 24 * (itemsPerRow - 1);
			const totalCardWidth = availableWidth - spacing;
			const cardSize = Math.floor(totalCardWidth / itemsPerRow);

			this.cardSize = cardSize;
		}
	}
};