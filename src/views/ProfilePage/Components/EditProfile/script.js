export default {
	props: {
		user: Object, // Receives the user object from ProfilePage.vue
	},
	data() {
		return {
			password: "",
			showPassword: false,
			snackbar: {
				show: false,
				message: "",
				color: "success"
			},
		};
	},
	emits: ["profile-updated"],
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

			const response = await fetch(`${process.env.VUE_APP_API_URL}/api/users/update`, {
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

			this.showSnackbar("Profil actualizat cu succes!");
			this.password = "";

			} catch (error) {
				console.error("Error updating profile:", error);
				this.showSnackbar("Eroare la actualizarea profilului", "error");
			}
		},
		async uploadProfilePicture(event) {
			const file = event.target.files[0];
			if (!file) return;

			const formData = new FormData();
			formData.append("profilePicture", file);

			try {
				const token = localStorage.getItem("token");

				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/users/upload-profile-picture`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`
					},
					body: formData
				});

				const data = await response.json();

				if (data.imageUrl) {
					this.user.profilePicture = data.imageUrl;

					this.$emit("profile-updated");

					this.showSnackbar("Imaginea a fost actualizată cu succes!");
				} else {
					this.showSnackbar("Eroare la încărcarea imaginii", "error");
				}

			} catch (err) {
				console.error("Eroare la upload:", err);
			}
		},
		async deleteProfilePicture() {
			try {
				const token = localStorage.getItem("token");
		
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/users/profile-picture`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
		
				if (!response.ok) throw new Error("Eroare la ștergerea imaginii");

				const data = await response.json();
				this.user.profilePicture = data.profile_picture || null;

				this.showSnackbar("Imaginea a fost ștearsă");
				this.$emit("profile-updated");

			} catch (err) {
				console.error(err);
				this.showSnackbar("Eroare la ștergerea imaginii", "error");
			}
		},
		triggerFileInput() {
			this.$refs.fileInput.click();
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		},
	},
};