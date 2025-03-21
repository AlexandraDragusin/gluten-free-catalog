
export default {
	props: {
		isLoggedIn: {
			type: Boolean,
			required: true,
		},
		userRole: {
			type: String,
			default: null,
		}
	},
	data: () => ({
		//
	}),
	methods: {
		handleClick() {
			this.$emit("login-click");
		},
	},
};