import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ShoppingListDialog from '../ShoppingListDialog/ShoppingListDialog.vue';

export default {
	name: "ShoppingLists",
	components: { ShoppingListDialog },
	data() {
		return {
			lists: [],
			searchQuery: "",
			sortOption: "recent",
			sortOptions: [
				{ text: "Cele mai recente", value: "recent" },
				{ text: "Cele mai vechi", value: "oldest" },
				{ text: "Alfabetic", value: "alpha" },
			],
			showAddListDialog: false,
			newListName: "",
			selectedList: null,
			showListDialog: false,
			showPdf: false,
		};
	},
	computed: {
		filteredAndSortedLists() {
			let filtered = this.lists.filter(list => {
				const name = list?.name ?? "";
				const query = this.searchQuery ?? "";
				return name.toLowerCase().includes(query.toLowerCase());
			});

			switch (this.sortOption) {
				case "alpha":
					return filtered.sort((a, b) => a.name.localeCompare(b.name));
				case "oldest":
					return filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
				default:
					return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
			}
		},
	},
	created() {
		this.fetchLists();
	},
	methods: {
		async fetchLists() {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			this.lists = await response.json();
		} catch (err) {
			console.error("Eroare la încărcarea listelor:", err);
		}
		},
		async createList() {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name: this.newListName }),
			});

			if (!response.ok) throw new Error("Eroare la creare listă");

			this.showAddListDialog = false;
			this.newListName = "";
			this.fetchLists();
		} catch (err) {
			console.error("Eroare la creare listă:", err);
		}
		},
		async deleteList(id) {
		try {
			const token = localStorage.getItem("token");
			await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			this.fetchLists();
		} catch (err) {
			console.error("Eroare la ștergere listă:", err);
		}
		},
		formatDate(dateStr) {
			return new Date(dateStr).toLocaleDateString("ro-RO");
		},
		openListDialog(list) {
			this.selectedList = list;
			this.showListDialog = true;
		},
		async exportToPDF(listId) {
			const list = this.lists.find(l => l.id === listId);
			if (!list) return;

			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/shopping-lists/${listId}/items`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				const items = await res.json();

				this.showPdf = true;
				await this.$nextTick();

				// Populate the PDF template
				const titleEl = document.getElementById("pdf-title");
				const dateEl = document.getElementById("pdf-date");
				const container = document.getElementById("pdf-items");
				const template = document.getElementById("pdf-template");
				
				if (!titleEl || !dateEl || !container || !template) {
					console.error("Template PDF lipsește din DOM.");
					return;
				}

				titleEl.textContent = list.name;
				dateEl.textContent = new Date(list.created_at).toLocaleDateString("ro-RO");
				container.innerHTML = "";

				items.forEach(item => {
					const checkbox = item.checked ? "☑" : "☐";
					const row = document.createElement("div");
					row.style.display = "flex";
					row.style.alignItems = "center";
					row.style.marginBottom = "12px";

					row.innerHTML = `
						<div style="margin-right: 12px; font-size: 18px;">${checkbox}</div>
						<div style="line-height: 1.4;">
						<div style="font-weight: bold;">${item.name}</div>
						<div style="font-size: 12px; color: #555;">
							${item.brand ?? "Fără brand"} – Cantitate: ${item.quantity}
						</div>
						</div>
					`;

					container.appendChild(row);
				});

				await this.$nextTick();

				const canvas = await html2canvas(template, {
					scale: 2,
					useCORS: true,
					backgroundColor: "#ffffff"
				});

				this.showPdf = false;

				const imgData = canvas.toDataURL("image/png");

				const pdf = new jsPDF();
				const margin = 10;
				const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
				const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

				pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
				pdf.save(`lista-${list.name}.pdf`);
			} catch (err) {
				console.error("Eroare la export PDF:", err.message);
			}
		}
	},
};