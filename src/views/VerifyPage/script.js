export default {
	name: "VerifyPage",
	props: {
		email: String,
	},
	data() {
		return {
			code: "",
			loading: false,
			resending: false,
			error: "",
			success: false,
			showErrorSnackbar: false,
			showSuccessSnackbar: false
		};
	},
	methods: {
		async verifyCode() {
			this.error = "";
			this.loading = true;

			try {
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/auth/verify`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: this.email, code: this.code }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Cod invalid");
				}

				this.success = true;
				this.showSuccessSnackbar = true;

				localStorage.setItem("token", data.token);
				localStorage.setItem("role", data.user.role);

				setTimeout(() => {
					this.$emit("register-success");
				}, 1000);

			} catch (err) {
				this.error = err.message;
				this.showErrorSnackbar = true;
			} finally {
				this.loading = false;
			}
		},
		async resendCode() {
			this.resending = true;
			this.error = "";
			try {
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/auth/resend-code`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email: this.email }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Nu am putut retrimite codul");
				}
			} catch (err) {
				this.error = err.message;
			} finally {
				this.resending = false;
			}
		}
	},
};