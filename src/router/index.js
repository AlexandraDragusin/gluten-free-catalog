import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage/HomePage.vue";
import StorePage from "@/views/StoresPage/StoresPage.vue";
import LoginPage from "@/views/LoginPage/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage/ProfilePage.vue";

const routes = [
	{ path: "/", name: "Home", component: HomePage },
	{ path: "/stores", name: "Stores", component: StorePage },
	{ path: "/login", name: "Login", component: LoginPage },
	{ path: "/profile", name: "Profile", component: ProfilePage },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
