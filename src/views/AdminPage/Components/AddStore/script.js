export default {
	data() {
		return {
		store: {
			name: "",
			type: "",
			address: "",
			logo_url: "",
			website: "",
			description: "",
			arig_partner: false,
			discount_percentage: null,
		},
		};
	},
	methods: {
		async submitForm() {
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

				this.resetForm();

			} catch (error) {
				console.error("Eroare la adăugarea magazinului:", error);
				alert("A apărut o eroare. Verifică datele introduse.");
			}
		},
		resetForm() {
			this.store = {
				name: "",
				type: "",
				address: "",
				logo_url: "",
				website: "",
				description: "",
				arig_partner: false,
				discount_percentage: null,
			};
			this.$refs.form.resetValidation();
		},
	},
  };
  