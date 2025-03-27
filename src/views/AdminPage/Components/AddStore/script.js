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

				const response = await fetch("http://localhost:5000/api/stores", {
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
			this.$refs.form.resetValidation();
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	},
  };
  