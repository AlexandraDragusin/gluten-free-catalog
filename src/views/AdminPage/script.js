import AddStore from "./Components/AddStore/AddStore.vue";
import AddProduct from "./Components/AddProduct/AddProduct.vue";
import UploadExcel from "./Components/UploadExcel/UploadExcel.vue";
import ManageUsers from "./Components/ManageUsers/ManageUsers.vue";
import ManageCategories from "./Components/ManageCategories/ManageCategories.vue";
import ManageAllergens from "./Components/ManageAllergens/ManageAllergens.vue";
import ManageProducts from "./Components/ManageProducts/ManageProducts.vue";
import ManageStores from "./Components/ManageStores/ManageStores.vue";

export default {
	components: {
		AddStore,
		AddProduct,
		UploadExcel,
		ManageUsers,
		ManageCategories,
		ManageAllergens,
		ManageProducts,
		ManageStores
	},
	data() {
		return {
			selectedTab: "add-store",
		};
	},
	watch: {
		selectedTab() {
			window.scrollTo({ top: 0, behavior: "auto" });
		}
	},
	methods: {
		logout() {
			this.$emit("logout");
		}
	}
};
