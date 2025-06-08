import LoginRequiredPrompt from "@/components/LoginRequiredPrompt/LoginRequiredPrompt.vue";
import AddToListDialog from "@/components/AddToListDialog/AddToListDialog.vue";
import { jwtDecode } from "jwt-decode";

export default {
	name: 'ProductDetailPage',
	components: { LoginRequiredPrompt, AddToListDialog },
	data() {
		return {
			product: {},
			isFavorite: false,
			userId: null,
			userRole: null,
			showListDialog: false,
			showLoginPrompt: false,
			imageStyle: {},
			reviews: [],
			newReview: {
				rating: null,
				comment: ''
			},
			snackbar: false,
			snackbarMessage: '',
			snackbarColor: 'success'
		};
	},
	async created() {
		this.loadProduct(this.$route.params.id);
	},
	watch: {
		'$route.params.id': {
			immediate: true,
			handler(newId) {
				this.loadProduct(newId);
			}
		}
	},
	methods: {
		formatAllergens(tags) {
			if (!Array.isArray(tags) || tags.length === 0) {
				return "Nu există alergeni cunoscuți.";
			}
			return tags.join(', ');
		},
		translateStoreType(type) {
			const map = {
				online: 'Online',
				physical: 'Fizic',
				mixed: 'Mixt',
				restaurant: 'Restaurant'
			};
			return map[type] || type;
		},
		async toggleFavorite() {
			if (!this.userId || this.userRole === 'admin') {
				this.showLoginPrompt = true;
				return;
			}

			const method = this.isFavorite ? 'DELETE' : 'POST';
			await fetch(`${process.env.VUE_APP_API_URL}/api/favorites`, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ product_id: this.product.id })
			});
			this.isFavorite = !this.isFavorite;
		},
		async checkIfFavorite(productId) {
			const res = await fetch(`${process.env.VUE_APP_API_URL}/api/favorites`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			});
			const data = await res.json();
			this.isFavorite = data.some(p => p.id === parseInt(productId));
		},
		async fetchReviews() {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/reviews/${this.product.id}`);
				this.reviews = await res.json();
			} catch (err) {
				console.error("Eroare la încărcarea recenziilor:", err);
			}
		},
		async submitReview() {
			if (!this.newReview.rating || !this.newReview.comment) {
				this.snackbarMessage = 'Te rog să completezi toate câmpurile.';
				this.snackbarColor = 'error';
				this.snackbar = true;
				return;
			}

			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/reviews`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						product_id: this.product.id,
						user_id: this.userId,
						rating: this.newReview.rating,
						comment: this.newReview.comment
					})
				});
				if (!res.ok) throw new Error("Eroare la trimiterea recenziei");

				this.snackbarMessage = 'Recenzia a fost adăugată!';
				this.snackbarColor = 'success';
				this.snackbar = true;

				this.newReview.rating = null;
				this.newReview.comment = '';

				await this.fetchReviews();

				this.$nextTick(() => {
					const section = document.querySelector('.reviews-list');
					if (section) section.scrollIntoView({ behavior: 'smooth' });
				});

			} catch (err) {
				console.error("Eroare la adăugarea recenziei:", err);
			}
		},
		async deleteReview(id) {
			try {
				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/reviews/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				if (!res.ok) throw new Error("Eroare la ștergere.");

				await this.fetchReviews();
			} catch (err) {
				console.error("Eroare la ștergerea recenziei:", err);
				this.snackbarText = "Eroare la ștergere.";
				this.snackbarColor = "error";
				this.snackbar = true;
			}
		},
		openListDialog() {
			if (!this.userId || this.userRole === 'admin') {
				this.showLoginPrompt = true;
				return;
			}
			this.showListDialog = true;
		},
		adjustImageStyle() {
			this.$nextTick(() => {
				const imageEl = this.$refs.productImage?.$el?.querySelector('img');
				if (!imageEl) return;

				const width = imageEl.naturalWidth;
				const height = imageEl.naturalHeight;
		
				if (!width || !height) return;

				const ratio = width / height;

				if (ratio >= 1) {
					this.imageStyle = {
						width: '100%',
						height: 'auto',
						objectFit: 'contain',
						borderRadius: '16px',
					};
				} else {
					this.imageStyle = {
						width: 'auto',
						height: '100%',
						objectFit: 'contain',
						borderRadius: '16px',
					};
				}
			});
		},
		async loadProduct(productId) {
			try {
				const token = localStorage.getItem("token");

				if (token) {
					const decoded = jwtDecode(token);
					this.userId = decoded.id;
					this.userRole = decoded.role;

					await this.checkIfFavorite(productId);
				}

				const res = await fetch(`${process.env.VUE_APP_API_URL}/api/products/${productId}`);
				const data = await res.json();
				this.product = data;

				await this.fetchReviews();
			} catch (err) {
				console.error('Eroare la încărcarea produsului:', err);
			}
		},
	}
};