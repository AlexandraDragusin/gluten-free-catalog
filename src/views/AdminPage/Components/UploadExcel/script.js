export default {
	data() {
		return {
			selectedFile: null,
			loading: false,
			uploadSummary: null,
			snackbar: {
				show: false,
				message: "",
				color: "success"
			}
		};
	},
	methods: {
		async handleFileUpload() {
			if (!this.selectedFile) {
				this.showSnackbar("Te rugăm să selectezi un fișier.", "error");
				return;
			}

			const fileName = this.selectedFile.name;
			const validFileName = /^Tabel_Informatii_.+\.xlsx$/;

			if (!validFileName.test(fileName)) {
				this.showSnackbar("Numele fișierului trebuie să fie în formatul: 'Tabel_Informatii_Nume_Magazin.xlsx'", "error");
				return;
			}

			this.loading = true;
			this.uploadSummary = null;

			try {
				const formData = new FormData();
				formData.append("file", this.selectedFile);

				const token = localStorage.getItem("token");

				const response = await fetch("http://localhost:5000/api/products/upload", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Eroare la încărcare");
				}

				this.uploadSummary = {
					adaugate: data.added,
					actualizate: data.updated,
				};

				
				this.showSnackbar(
					`Fișier procesat: ${data.adaugate} adăugate, ${data.actualizate} actualizate.`,
					"success"
				);

				this.selectedFile = null;

			} catch (error) {
				this.showSnackbar(error.message, "error");
			} finally {
				this.loading = false;
			}
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	},
};
