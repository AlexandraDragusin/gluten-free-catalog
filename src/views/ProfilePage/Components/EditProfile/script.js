export default {
	props: {
		user: Object, // Receives the user object from ProfilePage.vue
	},
	data() {
		return {
			password: "",
			showPassword: false,
		};
	},
	methods: {
		async updateProfile() {
			try {
			const token = localStorage.getItem("token");

			const updatedData = {
				username: this.user.username,
				email: this.user.email,
			};

			if (this.password.trim()) {
				updatedData.password = this.password;
			}

			const response = await fetch("http://localhost:5000/api/users/update", {
				method: "PUT",
				headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedData),
			});

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}

			const data = await response.json();

			localStorage.setItem("token", data.token);

			this.$emit("profile-updated");

			alert("Profil actualizat cu succes!");
			this.password = "";

			} catch (error) {
				console.error("Error updating profile:", error);
			}
		},
		// Function to upload profile picture (Backend API should handle the storage)
		async uploadProfilePicture(event) {
			const file = event.target.files[0];
			if (!file) return;

			const formData = new FormData();
			formData.append("profilePicture", file);

			// TO DO: Upload the file to the server
		},
		triggerFileInput() {
			this.$refs.fileInput.click();
		},
	},
};