import LoginRequiredPrompt from "@/components/LoginRequiredPrompt/LoginRequiredPrompt.vue";
import { jwtDecode } from 'jwt-decode';

export default {
	name: "HomePage",
	components: { LoginRequiredPrompt },
	data() {
		return {
			categories: [
				{ name: "Făină și panificație", image: require("@/assets/categories/bread.png") },
				{ name: "Ingrediente de gătit", image: require("@/assets/categories/ingredients.png") },
				{ name: "Produse de bază", image: require("@/assets/categories/basics.png") },
				{ name: "Paste și cereale", image: require("@/assets/categories/pasta.png") },
				{ name: "Dulciuri", image: require("@/assets/categories/sweets.png") },
				{ name: "Gustări sărate", image: require("@/assets/categories/snacks.png") },
				{ name: "Conserve", image: require("@/assets/categories/canned.png") },
				{ name: "Tartinabile și îndulcitori", image: require("@/assets/categories/spreads.png") },
				{ name: "Lactate", image: require("@/assets/categories/dairy.png") },
				{ name: "Fructe și legume", image: require("@/assets/categories/fruits.png") },
				{ name: "Sosuri", image: require("@/assets/categories/sauces.png") },
				{ name: "Mezeluri", image: require("@/assets/categories/meat.png") },
				{ name: "Ulei și oțet", image: require("@/assets/categories/oils.png") },
				{ name: "Băuturi", image: require("@/assets/categories/drinks.png") },
				{ name: "Suplimente", image: require("@/assets/categories/supplements.png") },
				{ name: "Semipreparate", image: require("@/assets/categories/readymeals.png") },
			],
			showLoginPrompt: false,
			userId: null
		};
	},
	created() {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwtDecode(token);
				this.userId = decoded.id;
			} catch {
				this.userId = null;
			}
		}
	},
	methods: {
		handleFavoritesClick() {
			if (!this.userId || this.userRole !== "user") {
				this.showLoginPrompt = true;
			} else {
				this.$emit('navigate-to-profile-favorites');
			}
		}
	}
};