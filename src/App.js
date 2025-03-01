import Header from './components/HeaderComponent/HeaderComponent.vue';

export default {
	name: 'App',
	components: {
		Header,
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