export default {
	data() {
		return {
			users: [],
			loading: false,
			headers: [
				{ title: "Id unic", key: "id", align: "start", sortable: true },
				{ title: "Nume de utilizator", key: "username", sortable: true },
				{ title: "Email", key: "email", sortable: true },
				{ title: "Data înregistrării", key: "created_at", sortable: true },
				{ title: "Acțiuni", key: "actions", sortable: false }
			],
			selectedUser: null,
			showConfirmDialog: false,
		};
	},
	created() {
		this.fetchUsers();
	},
	methods: {
		async fetchUsers() {
			this.loading = true;
			try {
				const token = localStorage.getItem("token");
				const res = await fetch("http://localhost:5000/api/users", {
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
			} finally {
				this.loading = false;
			}
		},
		confirmDelete(user) {
			this.selectedUser = user;
			this.showConfirmDialog = true;
		},
		async deleteUser() {
			const token = localStorage.getItem("token");

			try {
				const res = await fetch(`http://localhost:5000/api/users/${this.selectedUser.id}`, {
					method: "DELETE",
					headers: {
					Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) throw new Error("Eroare la ștergere");

				this.users = this.users.filter((u) => u.id !== this.selectedUser.id);
				this.showConfirmDialog = false;
				this.selectedUser = null;

			} catch (err) {
				console.error("Eroare la ștergerea utilizatorului:", err);
				alert("Nu s-a putut șterge utilizatorul.");
			}
		}
	},
};
