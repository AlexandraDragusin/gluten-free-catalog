import LoginButton from "@/components/LoginButton/LoginButton.vue";

export default {
	components: {
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
		}
	},
	data() {
		return {
			//
		};
	},
	methods: {
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
	},
};