import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage/HomePage.vue";
import StorePage from "@/views/StoresPage/StoresPage.vue";
import LoginPage from "@/views/LoginPage/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage/RegisterPage.vue";
import ProfilePage from "@/views/ProfilePage/ProfilePage.vue";
import AdminPage from "@/views/AdminPage/AdminPage.vue";

const routes = [
	{ path: "/", name: "Home", component: HomePage },
	{ path: "/stores", name: "Stores", component: StorePage },
	{ path: "/login", name: "Login", component: LoginPage },
	{ path: "/register", name: "Register", component: RegisterPage },
	{ path: "/profile", name: "Profile", component: ProfilePage },
	{ path: '/admin', name: 'AdminPage', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
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
