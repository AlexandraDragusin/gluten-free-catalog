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

		this.selectTabFromQuery();
	},
	beforeUnmount() {
		window.removeEventListener("storage", this.handleStorageChange);
	},
	watch: {
		'$route.query.tab'() {
			this.selectTabFromQuery();
		}
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

				const rawUser = await response.json();
				this.user = {
					...rawUser,
					profilePicture: rawUser.profile_picture
				};

			} catch (error) {
				console.error("Error fetching user profile:", error);
				this.$emit("navigate-to-login");
			}
		},
		logout() {
			this.$emit("logout");
		},
		selectTabFromQuery() {
			const tab = this.$route.query.tab;
	
			if (tab === 'favorite-products') {
				this.selectedTab = 'favorite-products';
			} else if (tab === 'shopping-lists') {
				this.selectedTab = 'shopping-lists';
			} else {
				this.selectedTab = 'edit-profile';
			}
		},
		navigateToTab(tabKey) {
			this.selectedTab = tabKey;

			let queryTab = '';
			if (tabKey === 'favorite-products') queryTab = 'favorite-products';
			else if (tabKey === 'shopping-lists') queryTab = 'shopping-lists';

			this.$router.replace({ query: { tab: queryTab } });
		}
	}
};