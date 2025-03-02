export default {
	data() {
		return {
			user: null,
		};
	},
	created() {
		this.fetchUserProfile();
	},
	methods: {
		async fetchUserProfile() {
			try {
				const token = localStorage.getItem("token");

				if (!token) {
					this.goToLogin();
					throw new Error("No authentication token found");
				}

				const response = await fetch("http://localhost:5000/api/users/profile", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error(data.error || "Failed to load profile");
				}

				const data = await response.json();

				this.user = data;
			} catch (error) {
				console.error("Error fetching user profile:", error);
				this.goToLogin();
			}
		},
		goToLogin() {
			this.$emit("navigate-to-login");
		},
		logout() {
			this.$emit("logout");
		},
	},
};