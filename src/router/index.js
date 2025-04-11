import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage/HomePage.vue";
import StoresPage from "@/views/StoresPage/StoresPage.vue";
import ProductsPage from "@/views/ProductsPage/ProductsPage.vue";
import LoginPage from "@/views/LoginPage/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage/RegisterPage.vue";
import ProfilePage from "@/views/ProfilePage/ProfilePage.vue";
import AdminPage from "@/views/AdminPage/AdminPage.vue";
import VerifyPage from "@/views/VerifyPage/VerifyPage.vue";

const routes = [
	{ path: "/", name: "Home", component: HomePage },
	{ path: "/stores/:type?", name: "Stores", component: StoresPage },
	{ path: "/products/:category?", name: "Products", component: ProductsPage},
	{ path: "/login", name: "Login", component: LoginPage },
	{ path: "/register", name: "Register", component: RegisterPage },
	{ path: "/verify/:email", name: "Verify", component: VerifyPage, props: true },
	{ path: "/profile", name: "Profile", component: ProfilePage },
	{ path: '/admin', name: 'AdminPage', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 };
	}
});

// Navigation Guard (Redirect if not logged in)
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem("token");
	const role = localStorage.getItem("role");

	const isLoggedIn = !!token;
	const isAdmin = role === "admin";

	if (to.meta.requiresAuth && !isLoggedIn) {
		next("/login");
	} else if (to.meta.requiresAdmin && !isAdmin) {
		next("/");
	} else {
		next();
	}
});

export default router;
