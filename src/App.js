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
		};
	},
	created() {
		this.isLoggedIn = checkLoginStatus();

		this.tokenCheckInterval = setInterval(() => {
			checkTokenExpiration(() => this.handleLogout());
		}, 100000);
	},
	beforeUnmount() {
		clearInterval(this.tokenCheckInterval);
	},
	methods: {
		handleLoginSuccess() {
			this.isLoggedIn = true;
			this.goToHomePage();
		},
		handleLogout() {
			localStorage.removeItem("token");

			this.isLoggedIn = false;
			this.goToLoginPage();
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