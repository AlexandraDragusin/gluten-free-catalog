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
	{ path: '/admin', name: 'AdminPage', component: AdminPage }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Navigation Guard (Redirect if not logged in)
router.beforeEach((to, from, next) => {
	const isLoggedIn = !!localStorage.getItem("token");

	if (to.meta.requiresAuth && !isLoggedIn) {
		next("/login");
	} else {
		next();
	}
});

export default router;
