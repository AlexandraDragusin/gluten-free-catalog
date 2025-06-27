export default {
	data() {
		return {
			users: [],
			loading: false,
			selectionMode: false,
			selectedUsers: [],
			showConfirmDialog: false,
			headers: [
				{ title: "", value: "placeholder", sortable: false, width: "56px"},
				{ title: "Nume de utilizator", key: "username", sortable: true },
				{ title: "Email", key: "email", sortable: true },
				{ title: "Data înregistrării", key: "created_at", sortable: true }
			],
			snackbar: {
				show: false,
				message: "",
				color: "success",
			},
			pagination: {
				page: 1,
				itemsPerPage: 10,
			},
		};
	},
	computed: {
		headersToUse() {
			return this.selectionMode
				? this.headers.filter(h => h.value !== "placeholder")
				: this.headers;
		}
	},
	watch: {
		pagination: {
			handler(newVal, oldVal) {
				if (newVal.page !== oldVal.page) {
					this.scrollToTop();
				}
			},
			deep: true
		}
	},
	created() {
		this.fetchUsers();
	},
	methods: {
		scrollToTop() {
			setTimeout(() => {
					window.scrollTo({
					top: 0,
					behavior: 'auto'
				});
			}, 0);
		},
		async fetchUsers() {
			this.loading = true;
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/users`, {
					headers: {
					Authorization: `Bearer ${token}`,
					},
				});

				const data = await res.json();
				this.users = data.map(user => ({
					...user,
					created_at: new Date(user.created_at).toLocaleDateString("en-GB")
				}));

			} catch (err) {
				console.error("Eroare la obținerea utilizatorilor:", err);
				this.showSnackbar("Eroare la încărcarea utilizatorilor", "error");
			} finally {
				this.loading = false;
			}
		},
		cancelSelection() {
			this.selectionMode = false;
			this.selectedUsers = [];
		},
		async confirmBulkDelete() {
			if (this.selectedUsers.length === 0) return;

			const token = localStorage.getItem("token");
			try {
				await Promise.all(
					this.selectedUsers.map(async (user) => {
						const res = await fetch(`${process.env.VUE_APP_API_URL}/api/users/${user.id}`, {
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						});
						if (!res.ok) throw new Error("Eroare la ștergere");
					})
				);

				// Update the user list without fetching it again
				this.users = this.users.filter(
					u => !this.selectedUsers.some(sel => sel.id === u.id)
				);

				this.showSnackbar(`${this.selectedUsers.length} utilizator(i) șters(i).`);
				this.cancelSelection();
				this.showConfirmDialog = false;

			} catch (err) {
				console.error("Eroare la ștergerea în masă:", err);
				this.showSnackbar("Eroare la ștergerea în masă.", "error");
				this.cancelSelection();
				this.showConfirmDialog = false;
			}
		},
		showSnackbar(message, color = "success") {
			this.snackbar.message = message;
			this.snackbar.color = color;
			this.snackbar.show = true;
		}
	},
};
