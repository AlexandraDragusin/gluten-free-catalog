export default {
	data() {
		return {
			email: "",
			password: "",
			showPassword: false,
			loading: false,
			loginError: false,
			rules: {
				required: (value) => !!value || "Câmp obligatoriu"
			},
		};
	},
	methods: {
		async handleLogin() {
			if (localStorage.getItem("token")) return;

			// Validate email and password
			if (!this.email || !this.password) {
				this.loginError = "Te rugăm să completezi toate câmpurile";
				return;
			}

			this.loginError = false;
			this.loading = true;

			try {
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: this.email,
						password: this.password,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Autentificare eșuată");
				}

				// Save the token in the local storage
				localStorage.setItem("token", data.token);

				// Emit login success
				this.$emit("login-success");

			} catch (error) {
				this.loginError = error.message;
			} finally {
				this.loading = false;
			}

		},
		navigateToRegister() {
			this.$emit("navigate-to-register");
		}
	},
};
