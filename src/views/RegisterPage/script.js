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
			formValid: false,
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

			if (!isValid || !this.username || !this.email || !this.password || !this.confirmPassword) {
				this.registerError = "Te rog să completezi toate câmpurile.";
				return;
			}

			if (this.password !== this.confirmPassword) {
				this.registerError = "Parolele nu coincid.";
				return;
			}

			this.loading = true;
			this.registerError = false;

			try {
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/auth/register`, {
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

				this.$emit("navigate-to-verify", this.email);

				this.resetForm();

			} catch (error) {
				this.registerError = error.message;
			} finally {
				this.loading = false;
			}
		},
		navigateToLogin() {
			this.$emit("navigate-to-login");
		},
		resetForm() {
			this.username = "";
			this.email = "";
			this.password = "";
			this.confirmPassword = "";
			this.registerError = false;
		
			this.$refs.registerForm.reset();
			this.$refs.registerForm.resetValidation();
		}
	},
};