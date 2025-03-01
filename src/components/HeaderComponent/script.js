import LoginButton from "@/components/LoginButton/LoginButton.vue";

export default {
	components: {
		LoginButton,
	},
	data() {
		return {
			isLoggedIn: false, // Default state, should be dynamically set
		};
	},
	methods: {
		handleLoginClick() {
			if (this.isLoggedIn) {
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
	},
};