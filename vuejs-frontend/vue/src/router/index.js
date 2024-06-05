import { createRouter, createWebHashHistory } from 'vue-router';

import PageNotFound from "../views/PageNotFound.vue"
import Home from "../views/Home.vue"
import Register from "../views/Register.vue";
import PersonalProfile from "../views/PersonalProfile.vue";
import AdminProfile from "../views/AdminProfile.vue";

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/login",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/profile",
    name: "PersonalProfile",
    component: PersonalProfile
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminProfile
  },
  {
    path: "/404",
    component: PageNotFound
  },
  {
    path: "/pages/:catchAll(.*)",
    redirect: (to) => {
      return { path: to.path };
    }
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404"
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;