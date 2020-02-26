import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/add-foodie",
    name: "AddFoodie",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AddFoodie.vue")
  },
  {
    path: "/edit-foodie/:foodie_slug",
    name: "EditFoodie",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EditFoodie.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
