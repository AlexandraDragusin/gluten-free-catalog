import { debounce } from 'lodash';
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
			loadingSearch: false
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
	created() {
		this.fetchAllCategories();
		this.fetchAllProducts();
		this.fetchAllStores();
	},
	methods: {
		async fetchAllProducts() {
			try {
				const res = await fetch('http://localhost:5000/api/products');
				const products = await res.json();
		
				this.allProducts = products.map(prod => {
					const category = this.allCategories.find(cat => cat.id === prod.category_id);
					return {
						...prod,
						categoryName: category ? category.name : 'Fără categorie'
					};
				});
			} catch (err) {
				console.error('Eroare la încărcarea produselor:', err);
			}
		},
		async fetchAllStores() {
			try {
				const res = await fetch('http://localhost:5000/api/stores');
				this.allStores = await res.json();
			} catch (err) {
				console.error('Eroare la încărcarea magazinelor:', err);
			}
		},
		async fetchAllCategories() {
			try {
				const res = await fetch('http://localhost:5000/api/categories');
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
			const query = this.searchQuery.toLowerCase().trim();

			if (!query) {
				this.searchResults.products = [];
				this.searchResults.stores = [];
				this.menuOpen = false;
				this.loadingSearch = false;
				return;
			}

			const matchedProducts = this.allProducts.filter(prod =>
				prod.name.toLowerCase().includes(query) ||
				(prod.categoryName || '').toLowerCase().includes(query)
			);

			const matchedStores = this.allStores.filter(store =>
				store.name.toLowerCase().includes(query)
			);

			this.searchResults.products = matchedProducts;
			this.searchResults.stores = matchedStores;

			this.menuOpen = matchedProducts.length > 0 || matchedStores.length > 0;

			this.$nextTick(() => {
				if (this.menuOpen && this.$refs.searchField) {
					this.$refs.searchField.focus();
					this.loadingSearch = false;
					this.menuOpen = (this.searchResults.products.length || this.searchResults.stores.length) > 0;
				}
			});
		},
		handleSearch: debounce(function () {
			this.performSearch();
		}, 300),
		onInput() {
			this.loadingSearch = true;
			this.handleSearch();
		},
		onFocus() {
			if (this.searchQuery.length > 0 && 
				(this.searchResults.products.length > 0 || this.searchResults.stores.length > 0)) {
				this.menuOpen = true;
			} else {
				this.menuOpen = false;
			}
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