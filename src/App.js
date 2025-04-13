import Header from './components/HeaderComponent/HeaderComponent.vue';
import Footer from './components/FooterComponent/FooterComponent.vue';
import { checkLoginStatus, checkTokenExpiration } from "./utils/auth.js";

export default {
	name: 'App',
	components: {
		Header,
		Footer
	},
	data() {
		return {
			isLoggedIn: false,
			userRole: null,
			breadcrumbs: []
		};
	},
	watch: {
		'$route': {
			handler: 'updateBreadcrumbs',
			immediate: true,
		}
	},
	created() {
		this.isLoggedIn = checkLoginStatus();
		this.userRole = localStorage.getItem("role");

		this.tokenCheckInterval = setInterval(() => {
			checkTokenExpiration(() => this.handleLogout());
		}, 100000);
	},
	beforeUnmount() {
		clearInterval(this.tokenCheckInterval);
	},
	methods: {
		async handleLoginSuccess() {
			const token = localStorage.getItem("token");

			if (!token) return;

			try {
				const response = await fetch("http://localhost:5000/api/users/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) throw new Error("Eroare la obținerea profilului");

				const userData = await response.json();
				this.userRole = userData.role || null;

				localStorage.setItem("role", this.userRole);

				this.isLoggedIn = true;
				this.goToHomePage();

			} catch (e) {
				console.error("Eroare la decodarea token-ului:", e);
				this.handleLogout();
			}
		},
		handleLogout() {
			localStorage.removeItem("token");
			localStorage.removeItem("role");

			this.isLoggedIn = false;
			this.userRole = null;

			this.goToLoginPage();
		},
		goToStoresPage(type = '') {
			if (type) {
				this.$router.push(`/stores/${type}`);
			} else {
				this.$router.push('/stores');
			}
		},
		goToStoreDetailPage(storeId) {
			this.$router.push({ name: 'StoreDetail', params: { id: storeId } });
		},
		goToProductsPage(category) {
			if (category) {
				this.$router.push({ name: 'Products', params: { category } });
			} else {
				this.$router.push({ name: 'Products' });
			}
		},
		goToProductDetailPage(productId) {
			this.$router.push({ name: 'ProductDetail', params: { id: productId } });
		},
		goToProfilePage() {
			this.$router.push("/profile");
		},
		goToProfileFavoritesPage() {
			this.$router.push({ path: '/profile', query: { tab: 'favorite-products' } });
		},
		goToAdminPage() {
			this.$router.push("/admin");
		},
		goToCategories() {
			if (this.$route.name === 'Home') {
				this.scrollToCategoriesSection();
			} else {
				this.$router.push('/')
					.then(() => {
						this.$nextTick(() => {
							setTimeout(() => {
								this.scrollToCategoriesSection();
							}, 300);
						});
					});
			}
		},
		goToLoginPage() {
			this.$router.push("/login");
		},
		goToRegisterPage() {
			this.$router.push("/register");
		},
		goToHomePage() {
			this.$router.push("/");
		},
		goToVerifyPage(email) {
			console.log("Navigating to Verify Page with email:", email);
			this.$router.push({ name: 'Verify', params: { email } });
		},
		translateStoreType(type) {
			const types = {
				online: "Online",
				physical: "Fizic",
				mixed: "Mixt",
				restaurant: "Restaurant"
			};
			return types[type] || type;
		},
		updateBreadcrumbs() {
			const { name, params } = this.$route;

			if (name === 'Stores') {
				let crumbs = [
					{ label: 'Acasă', route: '/' },
					{ label: 'Magazine', route: '/stores' },
				];
				
				if (params.type) {
					const translatedType = this.translateStoreType(params.type);
					crumbs.push({
						label: translatedType,
						route: `/stores/${params.type}`
					});
				}

				this.breadcrumbs = crumbs;
				return;
			}

			if (name === 'Products') {
				let crumbs = [
					{ label: 'Acasă', route: '/' },
					{ label: 'Produse', route: '/products' },
				];

				if (params.category) {
					crumbs.push({
						label: params.category,
						route: `/products/${params.category}`
					});
				}

				this.breadcrumbs = crumbs;
				return;
			}

			if (name === 'ProductDetail') {
				this.breadcrumbs = [
					{ label: 'Acasă', route: '/' },
					{ label: 'Produse', route: '/products' },
					{ label: 'Detalii produs', route: this.$route.fullPath }
				];
				return;
			}

			this.breadcrumbs = [];
		},
		scrollToCategoriesSection() {
			const el = document.getElementById("categories-section");
			if (el) {
				el.scrollIntoView({ behavior: "smooth" });
			}
		}
	},
};