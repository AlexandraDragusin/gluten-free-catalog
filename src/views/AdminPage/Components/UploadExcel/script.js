export default {
	data() {
		return {
			selectedFile: null,
			loading: false,
			uploadError: null,
		};
	},
	methods: {
		async handleFileUpload() {
			if (!this.selectedFile) {
				this.uploadError = "Te rugăm să selectezi un fișier.";
				return;
			}

			const fileName = this.selectedFile.name;
			const validFileName = /^Tabel_Informatii_.+\.xlsx$/;

			if (!validFileName.test(fileName)) {
				this.uploadError = "Numele fișierului trebuie să fie în formatul: 'Tabel_Informatii_Nume_Magazin.xlsx'.";
				return;
			}

			this.loading = true;
			this.uploadError = null;

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

				alert("Fișierul a fost încărcat cu succes!");
				this.selectedFile = null;

			} catch (error) {
				this.uploadError = error.message;
			} finally {
				this.loading = false;
			}
		},
	},
};
