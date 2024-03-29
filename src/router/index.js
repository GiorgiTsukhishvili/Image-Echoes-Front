import { createRouter, createWebHistory } from "vue-router";
import {
  HomeView,
  SingleBlog,
  NotFound,
  SingleUserView,
  CollectionView,
  UserSettings,
  UserCollections,
  UserBlogs,
  UserSubscriptions,
  UserSubscribers,
} from "@/views";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/settings",
      name: "settings",
      component: UserSettings,
    },
    {
      path: "/user-collections",
      name: "user-collections",
      component: UserCollections,
    },
    {
      path: "/user-subscriptions",
      name: "user-subscriptions",
      component: UserSubscriptions,
    },
    {
      path: "/user-subscribers",
      name: "user-subscribers",
      component: UserSubscribers,
    },
    {
      path: "/user-blogs",
      name: "user-blogs",
      component: UserBlogs,
    },
    {
      path: "/blog/:name/:id",
      name: "blog",
      component: SingleBlog,
    },
    {
      path: "/user/:name",
      name: "user",
      component: SingleUserView,
    },
    {
      path: "/:user",
      name: "collection",
      component: CollectionView,
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
    },
  ],
});

export default router;
