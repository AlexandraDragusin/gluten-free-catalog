
export default {
	props: {
		isLoggedIn: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		//
	},
	methods: {
		handleClick() {
			this.$emit("login-click");
		},
	},
};