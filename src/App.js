import Header from './components/HeaderComponent/HeaderComponent.vue';
import Footer from './components/FooterComponent/FooterComponent.vue';
import jwtDecode from "jwt-decode";

export default {
	name: 'App',
	components: {
		Header,
		Footer
	},
	data() {
		return {
			isLoggedIn: false,
		};
	},
	created() {
		this.checkLoginStatus();

		this.tokenCheckInterval = setInterval(() => {
			this.checkTokenExpiration();
		}, 100000);
	},
	beforeUnmount() {
		clearInterval(this.tokenCheckInterval);
	},
	methods: {
		checkLoginStatus() {
			const token = localStorage.getItem("token");

			if (token) {
				const isExpired = this.isTokenExpired(token);
				if (!isExpired) {
					this.isLoggedIn = true;
				} else {
					this.handleLogout();
				}
			} else {
				this.isLoggedIn = false;
			}
		},
		handleLoginSuccess() {
			this.isLoggedIn = true;
			this.goToHomePage();
		},
		handleLogout() {
			localStorage.removeItem("token");
			this.isLoggedIn = false;
			this.goToLoginPage();
		},
		isTokenExpired(token) {
			try {
				const decoded = jwtDecode(token);
				const currentTime = Date.now() / 1000;
				return decoded.exp < currentTime;
			} catch (error) {
				return true;
			}
		},
		checkTokenExpiration() {
			const token = localStorage.getItem("token");
			if (token && this.isTokenExpired(token)) {
				this.handleLogout();
			}
		},
		goToStoresPage() {
			this.$router.push("/stores");
		},
		goToProfilePage() {
			this.$router.push("/profile");
		},
		goToLoginPage() {
			this.$router.push("/login");
		},
		goToRegisterPage() {
			this.$router.push("/register");
		},
		goToHomePage() {
			this.$router.push("/");
		}
	},
};