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
			//
		};
	},
	emits: [
		"navigate-to-home",
		"navigate-to-stores",
		"navigate-to-login",
		"navigate-to-profile",
		"navigate-to-admin",
	],
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