<template>
  <NavbarComponent />
  <RouterView />
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

import { NavbarComponent } from "@/components";

import { getCSRF, getLoggedInUser } from "@/services";

import { useUserStore } from "@/stores";

const { setUserInfo } = useUserStore();

const { path } = useRoute();
const { push } = useRouter();

const userRoutes = [
  "/settings",
  "/user-collection",
  "/user-subscriptions",
  "/user-subscribers",
  "/user-blogs",
];

const getUserInforMation = async () => {
  try {
    await getCSRF();
    const data = await getLoggedInUser();
    setUserInfo(data.data);
  } catch (err) {
    setUserInfo(null);

    if (userRoutes.some((route) => route.includes(path)) && path !== "/") {
      push("/");
    }
  }
};

onBeforeMount(() => {
  getUserInforMation();
});
</script>
