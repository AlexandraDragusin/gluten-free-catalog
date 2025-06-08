import { debounce } from 'lodash';
import Fuse from 'fuse.js';
import LoginButton from "@/components/LoginButton/LoginButton.vue";
import Breadcrumb from "../BreadcrumbComponent/BreadcrumbComponent.vue";

export default {
	name: "HeaderComponent",
	components: {
		Breadcrumb,
		LoginButton,
	},
	props: {
		isLoggedIn: {
			type: Boolean,
			required: true,
			default: false
		},
		userRole: {
			type: String,
			default: null
		},
		breadcrumbs: {
			type: Array,
			default: () => [],
		},
	},	
	data() {
		return {
			searchQuery: '',
			searchResults: {
				products: [],
				stores: []
			},
			allProducts: [],
			allStores: [],
			allCategories: [],
			menuOpen: false,
			loadingSearch: false,
			productFuse: null,
			storeFuse: null
		};
	},
	emits: [
		"navigate-to-home",
		"navigate-to-stores",
		"navigate-to-login",
		"navigate-to-profile",
		"navigate-to-admin",
		"navigate-to-categories",
		"navigate-to-product-detail",
		"navigate-to-store-detail",
	],
	computed: {
		isSearchVisible() {
			const hiddenRoutes = ['Admin', 'Profile'];
			return !hiddenRoutes.includes(this.$route.name);
		},
		groupedProductsByCategory() {
			const groups = {};
			for (const product of this.searchResults.products) {
				const categoryName = product.categoryName || 'Fără categorie';
				if (!groups[categoryName]) {
					groups[categoryName] = [];
				}
				groups[categoryName].push(product);
			}
			return groups;
		}
	},
	watch: {
		isSearchVisible(newVal) {
			if (!newVal) {
				this.searchQuery = '';
				this.searchResults.products = [];
				this.searchResults.stores = [];
				this.menuOpen = false;
				this.loadingSearch = false;
			}
		},
	},
	created() {
		this.fetchAllCategories();
		this.fetchAllProducts();
		this.fetchAllStores();
	},
	methods: {
		async fetchAllProducts() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products`);
				const products = await res.json();
		
				this.allProducts = products.map(prod => {
					const category = this.allCategories.find(cat => cat.id === prod.category_id);
					return {
						...prod,
						categoryName: category ? category.name : 'Fără categorie'
					};
				});

				this.productFuse = new Fuse(this.allProducts, {
					keys: ['name', 'brand', 'categoryName'],
					threshold: 0.3
				});
			} catch (err) {
				console.error('Eroare la încărcarea produselor:', err);
			}
		},
		async fetchAllStores() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/stores`);
				this.allStores = await res.json();

				this.storeFuse = new Fuse(this.allStores, {
					keys: ['name'],
					threshold: 0.3
				});
			} catch (err) {
				console.error('Eroare la încărcarea magazinelor:', err);
			}
		},
		async fetchAllCategories() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/categories`);
				this.allCategories = await res.json();
			} catch (err) {
				console.error('Eroare la încărcarea categoriilor:', err);
			}
		},
		handleLoginClick() {
			if (this.isLoggedIn && this.userRole === 'admin') {
				this.$emit("navigate-to-admin");
			} else if (this.isLoggedIn) {
				this.$emit("navigate-to-profile");
			} else {
				this.$emit("navigate-to-login");
			}
		},
		navigateToHome() {
			this.$emit("navigate-to-home");
		},
		navigateToStores() {
			this.$emit("navigate-to-stores");
		},
		navigateToCategories() {
			this.$emit("navigate-to-categories");
		},
		async performSearch() {
			this.loadingSearch = true;
			const query = this.searchQuery.trim();

			if (!query || (!this.productFuse && !this.storeFuse)) {
				this.searchResults.products = [];
				this.searchResults.stores = [];
				this.menuOpen = false;
				this.loadingSearch = false;
				return;
			}

			const productResults = this.productFuse.search(query).map(r => r.item);
			const storeResults = this.storeFuse.search(query).map(r => r.item);

			this.searchResults.products = productResults;
			this.searchResults.stores = storeResults;

			this.menuOpen = productResults.length > 0 || storeResults.length > 0;

			this.loadingSearch = false;
		},
		handleSearch: debounce(function () {
			this.performSearch();
		}, 300),
		onInput() {
			if (this.searchQuery.trim() === '') {
				this.searchResults.products = [];
				this.searchResults.stores = [];
				this.menuOpen = false;
				this.loadingSearch = false;
			} else {
				this.loadingSearch = true;
				this.handleSearch();
			}
		},
		onFocus() {
			if (this.searchQuery.length > 0 && 
				(this.searchResults.products.length > 0 || this.searchResults.stores.length > 0)) {
				this.menuOpen = true;
			} else {
				this.menuOpen = false;
			}
		},
		onClear() {
			this.searchQuery = '';
			this.searchResults.products = [];
			this.searchResults.stores = [];
			this.menuOpen = false;
			this.loadingSearch = false;
		},
		navigateToProduct(productId) {
			this.$emit('navigate-to-product-detail', productId);
			this.searchQuery = '';
		},
		navigateToStore(storeId, storeName) {
			this.$emit('navigate-to-store-detail', storeId, storeName);
			this.searchQuery = '';
		},
		translateStoreType(type) {
			switch (type) {
				case 'physical':
					return 'Magazin fizic';
				case 'online':
					return 'Magazin online';
				case 'mixed':
					return 'Magazin fizic și online';
				case 'restaurant':
					return 'Restaurant';
				default:
					return 'Tip necunoscut';
			}
		},
	},
};