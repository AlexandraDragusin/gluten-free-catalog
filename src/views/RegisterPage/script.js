export default {
	data() {
		return {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			showPassword: false,
			showConfirmPassword: false,
			loading: false,
			registerError: false,
			rules: {
				required: (value) => !!value || "Câmp obligatoriu",
				email: (value) => /.+@.+\..+/.test(value) || "Email invalid",
				minLength: (value) => (value && value.length >= 6) || "Minim 6 caractere",
				matchPassword: (value) => value === this.password || "Parolele nu coincid",
			},
		};
	},
	methods: {
		async handleRegister() {
			const isValid = await this.$refs.registerForm.validate();
			if (!isValid) return;

			if (this.password !== this.confirmPassword) {
				this.registerError = true;
				return;
			}

			this.loading = true;
			this.registerError = false;

			try {
				const response = await fetch("http://localhost:5000/api/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						username: this.username,
						email: this.email,
						password: this.password,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Înregistrarea a eșuat");
				}

				// Save the token in the local storage
				localStorage.setItem("token", data.token);

				this.$emit("register-success");

			} catch (error) {
				this.registerError = error.message;
			} finally {
				this.loading = false;
			}
		},
		navigateToLogin() {
			this.$emit("navigate-to-login");
		},
	},
};