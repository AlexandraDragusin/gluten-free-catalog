export default {
	name: "LoginRequiredPrompt",
	props: {
		modelValue: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		goToLogin() {
			this.$emit("update:modelValue", false);
			this.$router.push("/login");
		},
		goToRegister() {
			this.$emit("update:modelValue", false);
			this.$router.push("/register");
		}
	}
};