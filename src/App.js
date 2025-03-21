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
			userRole: null
		};
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
		goToStoresPage() {
			this.$router.push("/stores");
		},
		goToProfilePage() {
			this.$router.push("/profile");
		},
		goToAdminPage() {
			this.$router.push("/admin");
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