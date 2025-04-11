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
			imageStyle: {}
		};
	},
	async created() {
		const productId = this.$route.params.id;
		const token = localStorage.getItem("token");

		if (token) {
			const decoded = jwtDecode(token);
			this.userId = decoded.id;
			this.userRole = decoded.role;

			await this.checkIfFavorite(productId);
		}

		try {
			const res = await fetch(`http://localhost:5000/api/products/${productId}`);
			const data = await res.json();
			this.product = data;
		} catch (err) {
			console.error('Eroare la încărcarea produsului:', err);
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
			await fetch('http://localhost:5000/api/favorites', {
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
			const res = await fetch('http://localhost:5000/api/favorites', {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
			});
			const data = await res.json();
			this.isFavorite = data.some(p => p.id === parseInt(productId));
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
		}		
	}
};