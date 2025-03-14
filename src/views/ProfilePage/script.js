import EditProfile from "./Components/EditProfile/EditProfile.vue";
import FavoriteProducts from "./Components/FavoriteProducts/FavoriteProducts.vue";
import ShoppingLists from "./Components/ShoppingLists/ShoppingLists.vue";

export default {
	components: {
		EditProfile,
		FavoriteProducts,
		ShoppingLists,
	},
	data() {
		return {
			selectedTab: "edit-profile",
			user: null,
		};
	},
	created() {
		this.fetchUserProfile();
	},
	mounted() {
		window.addEventListener("storage", (event) => {
			if (event.key === "token" && !event.newValue) {
				this.logout();
			}
		});
	},
	beforeUnmount() {
		window.removeEventListener("storage", this.handleStorageChange);
	},
	methods: {
		async fetchUserProfile() {
			if (this.user) return;

			try {
				const token = localStorage.getItem("token");
		
				if (!token) {
					this.$emit("navigate-to-login");
					throw new Error("No authentication token found");
				}

				const response = await fetch("http://localhost:5000/api/users/profile", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.status === 401 || response.status === 403) {
					console.log("Unauthorized access, logging out...");
					this.logout();
					return;
				}

				if (!response.ok) {
					throw new Error("Failed to load profile");
				}

				this.user = await response.json();
				console.log("User profile:", this.user);

			} catch (error) {
				console.error("Error fetching user profile:", error);
				this.$emit("navigate-to-login");
			}
		},
		logout() {
			this.$emit("logout");
		}
	}
};