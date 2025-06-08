export default {
	data() {
		return {
			store: {
				name: "",
				type: "",
				logo_url: "",
				website: "",
				description: "",
				arig_partner: false,
				discount_percentage: null,
				addresses: [
					{ address: "", city: "", county: "", country: "România" }
				],
			},
			logoFile: null,
			logoPreview: null,
			isSubmitting: false,
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			rules: {
				required: (v) => !!v || "Acest câmp este obligatoriu.",
			}
		};
	},
	methods: {
		addAddress() {
			this.store.addresses.push({
				address: "",
				city: "",
				county: "",
				country: "România"
			});
		},
		removeAddress(index) {
			this.store.addresses.splice(index, 1);
		},
		async submitForm() {
			const { valid } = await this.$refs.form.validate();
			if (!valid) {
				this.showSnackbar("Completează câmpurile obligatorii.", "error");
				return;
			}

			this.isSubmitting = true;

			try {
				const token = localStorage.getItem("token");

				// Check if a logo file is selected and upload it to AWS S3
				if (this.logoFile) {
					const token = localStorage.getItem("token");
					const formData = new FormData();
					formData.append("logo", this.logoFile);

					const uploadRes = await fetch(`${process.env.VUE_APP_API_URL}/api/stores/upload-logo`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
						},
						body: formData,
					});

					const uploadData = await uploadRes.json();

					if (!uploadRes.ok || !uploadData.logoUrl) {
						throw new Error(uploadData.error || "Eroare la încărcarea logo-ului.");
					}

					this.store.logo_url = uploadData.logoUrl;
				}

				// Send the store data to the backend
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/stores`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(this.store),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.message || "Eroare la salvarea magazinului.");
				}

				const data = await response.json();
				console.log("Magazin adăugat:", data);

				this.showSnackbar("Magazin adăugat cu succes.");
				this.resetForm();

			} catch (error) {
				console.error("Eroare la adăugarea magazinului:", error);
				this.showSnackbar("A apărut o eroare. Verifică datele introduse.", "error");
			} finally {
				this.isSubmitting = false;
			}
		},
		uploadLogo(event) {
			const file = event.target.files[0];
			if (file) {
				this.logoFile = file;
				this.logoPreview = URL.createObjectURL(file);
				this.showSnackbar("Imaginea a fost selectată.");
			}
		},
		async removeLogo() {
			// If the logo was not saved yet, just remove the file from the input
			if (this.logoFile) {
				this.logoFile = null;
				this.logoPreview = null;
				this.store.logo_url = "";
				this.showSnackbar("Logo-ul a fost eliminat.");
				return;
			}

			// If the store was not saved yet
			if (!this.store.id) {
				this.logoFile = null;
				this.logoPreview = null;
				this.store.logo_url = "";
				this.showSnackbar("Logo-ul a fost eliminat.");
				return;
			}

			// If the store was saved, send a request to delete the logo from the server
			try {
				const token = localStorage.getItem("token");
		
				const response = await fetch(`${process.env.VUE_APP_API_URL}/api/stores/${this.store.id}/logo`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
		
				if (!response.ok) throw new Error("Eroare la ștergerea logo-ului");

				this.logoFile = null;
				this.logoPreview = null;
				this.store.logo_url = "";

				this.showSnackbar("Logo șters cu succes");
			} catch (err) {
				console.error(err);
				this.showSnackbar("Eroare la ștergerea logo-ului", "error");
			}
		},
		resetForm() {
			this.store = {
				name: "",
				type: "",
				logo_url: "",
				website: "",
				description: "",
				arig_partner: false,
				discount_percentage: null,
				addresses: [
					{ address: "", city: "", county: "", country: "România" }
				],
			};
			this.logoPreview = null;
			this.logoFile = null; 
			this.$refs.form.resetValidation();
		},
		triggerLogoUpload() {
			this.$refs.logoInput.click();
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	},
  };
  