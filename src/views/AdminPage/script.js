import AddStore from "./Components/AddStore/AddStore.vue";
import AddProduct from "./Components/AddProduct/AddProduct.vue";
import UploadExcel from "./Components/UploadExcel/UploadExcel.vue";
import ManageUsers from "./Components/ManageUsers/ManageUsers.vue";

export default {
	components: {
		AddStore,
		AddProduct,
		UploadExcel,
		ManageUsers,
	},
	data() {
		return {
			selectedTab: "add-store",
		};
	},
	methods: {
		logout() {
			this.$emit("logout");
		}
	}
};
