import Header from './components/HeaderComponent/HeaderComponent.vue';
import Footer from './components/FooterComponent/FooterComponent.vue';

export default {
	name: 'App',
	components: {
		Header,
		Footer
	},
	data: () => ({
		//
	}),
	methods: {
		goToStoresPage() {
			this.$router.push("/stores");
		},
		goToProfilePage() {
			this.$router.push("/profile");
		},
		goToLoginPage() {
			this.$router.push("/login");
		},
		goToHomePage() {
			this.$router.push("/");
		}
	},
};