export default {
	name: "HomePage",
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
		};
	},
};