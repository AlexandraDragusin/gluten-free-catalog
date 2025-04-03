import { groupedCategories } from "@/utils/categories";

export default {
	name: 'ProductsPage',
	data() {
		return {
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
			allergens: [],
			storeOptions: [],
		};
	},
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
			return this.filters.name || this.filters.brand || this.filters.categories.length > 0;
		}
	},
	watch: {
		'$route.params.category'(newVal) {
			if (newVal && groupedCategories[newVal.toLowerCase()]) {
				const subcategories = groupedCategories[newVal.toLowerCase()];
				this.filters.categories = subcategories;
				this.filterDraft.categories = subcategories;
			} else {
				this.filters.categories = [];
				this.filterDraft.categories = [];
			}
			this.applyFilters();
		}
	},
	created() {
		const routeCategory = this.$route.params.category;

		this.fetchProducts();
		this.fetchCategories();
		this.fetchAllergens();
		this.fetchStores();

		if (routeCategory && groupedCategories[routeCategory.toLowerCase()]) {
			const subcategories = groupedCategories[routeCategory.toLowerCase()];
			this.filters.categories = subcategories;
			this.filterDraft.categories = subcategories;
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
				const res = await fetch('http://localhost:5000/api/products');
				const data = await res.json();
				this.products = data;
				this.applyFilters();
			} catch (err) {
				console.error('Eroare la încărcarea produselor:', err);
			}
		},
		async fetchCategories() {
			try {
				const res = await fetch('http://localhost:5000/api/categories');
				const data = await res.json();
				this.categories = data;
			} catch (err) {
				console.error('Eroare la încărcarea categoriilor:', err);
			}
		},
		async fetchAllergens() {
			const res = await fetch("http://localhost:5000/api/allergens");
			this.allergens = await res.json();
		},
		async fetchStores() {
			const res = await fetch("http://localhost:5000/api/stores");
			this.storeOptions = await res.json();
		},
		applyFilters() {
			const filteredProducts = this.products.filter(product => {
				const {
					name,
					brand,
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

				const matchesName = !name || product.name?.toLowerCase().includes(name.toLowerCase());
				const matchesBrand = !brand || product.brand?.toLowerCase().includes(brand.toLowerCase());
				const matchesMadeInRo = made_in_romania === null || product.made_in_romania === made_in_romania;
				const matchesCertArig = certified_arig === null || product.certified_arig === certified_arig;
				const matchesDecl = producer_gluten_declaration === null || product.producer_gluten_declaration === producer_gluten_declaration;
				const matchesCategory = validCategories.length === 0 || validCategories.includes(product.category);
				const excludedCodes = (excluded_allergens || []).map(tag =>
					typeof tag === 'string' ? tag : tag.code
				);
				const matchesAllergens = excludedCodes.length === 0 || !excludedCodes.some(code => (product.allergen_tags || []).includes(code));
				const matchesStores = stores.length === 0 || stores.some(storeId => (product.stores || []).includes(storeId));

				return matchesName && matchesBrand && matchesMadeInRo && matchesCertArig &&
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
			this.filters = JSON.parse(JSON.stringify(this.filterDraft));
			this.showFilterDialog = false;
			this.applyFilters();
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
		},
	}
};