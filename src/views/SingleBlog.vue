<template>
  <div v-if="blogInfo" class="bg-neutral-100 min-h-screen py-40">
    <WrapperComponent>
      <div class="w-full flex items-start md:flex-row flex-col">
        <img
          :src="blogInfo.user.image"
          :alt="blogInfo.user.name + 'image'"
          class="w-20 h-20 rounded-full"
        />
        <div class="md:ml-10 mt-10 md:mt-0">
          <div
            class="md:border-l-[3px] border-t-[3px] md:border-t-0 md:pl-10 pt-10 md:pt-0 border-black"
          >
            <h3 class="md:text-xl text-lg font-medium mb-2">
              {{ formatDate(blogInfo.created_at) }}
            </h3>
            <RouterLink
              :to="{ name: 'user', params: { name: blogInfo.user.name } }"
              class="font-semibold md:text-2xl text-xl"
            >
              {{ blogInfo.user.name }}
            </RouterLink>
          </div>
          <h1 class="mt-10 font-bold md:text-3xl text-2xl">
            {{ blogInfo.title }}
          </h1>
          <img
            :src="blogInfo.image"
            alt="blog image"
            class="h-[600px] mt-10 w-full object-cover cursor-pointer"
            @click="() => (modals.imageWindow = true)"
          />
          <p
            class="md:text-2xl text-xl font-medium mt-20 pt-20 border-t-2 border-gray-400"
          >
            {{ blogInfo.description }}
          </p>

          <div class="mt-20 pt-20 border-t-2 border-gray-400">
            <div class="flex gap-5 items-center">
              <LikeIcon />
              <h3 class="md:text-2xl text-xl font-medium">
                {{ blogInfo.likes.length }} Likes
              </h3>
            </div>
          </div>

          <ul class="mt-20 pt-20 border-t-2 border-gray-400">
            <li
              v-for="comment in slicedComments"
              :key="comment.id"
              class="border-b border-b-gray-400 last:border-b-0 py-10"
            >
              <div class="flex gap-5">
                <img
                  :src="comment.user.image"
                  alt="commenter image"
                  class="w-16 h-16 rounded-full"
                />
                <div class="flex flex-col justify-between">
                  <h3 class="md:text-xl text-lg font-semibold">
                    {{ comment.user.name }}
                  </h3>
                  <h4 class="md:text-lg font-medium">
                    {{ calculateData(comment.created_at) }}
                  </h4>
                </div>
              </div>
              <p class="mt-10 md:text-xl text-lg">{{ comment.comment }}</p>
            </li>
          </ul>
          <button
            @click="() => (modals.isCommentsOpen = !modals.isCommentsOpen)"
            class="md:text-2xl text-lg font-medium mt-10 mx-auto block"
          >
            {{ modals.isCommentsOpen ? "Show Less" : "Show More" }}
          </button>
        </div>
      </div>
    </WrapperComponent>
  </div>
  <div v-if="modals.imageWindow" class="fixed top-0 left-0 h-screen w-screen">
    <div
      class="bg-black absolute top-0 left-0 h-screen w-screen bg-opacity-60 blur-xl"
      @click="() => (modals.imageWindow = false)"
    />
    <img
      :src="blogInfo.image"
      alt="blog image"
      class="w-auto h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 md:p-20"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { WrapperComponent, LikeIcon } from "@/components";

import { getSingleBlog, getCSRF } from "@/services";

import { formatDate, calculateData } from "@/helpers";

const {
  params: { id },
} = useRoute();
const { push } = useRouter();

const blogInfo = ref();
const modals = ref({ imageWindow: false, isCommentsOpen: false });

const slicedComments = computed(() =>
  modals.value.isCommentsOpen
    ? blogInfo.value.comments
    : blogInfo.value.comments.slice(0, 3)
);

const getData = async (id) => {
  try {
    await getCSRF();
    const data = await getSingleBlog(id);

    blogInfo.value = data.data;
  } catch (err) {
    push("/notFound");
  }
};

onMounted(() => {
  getData(id);
});
</script>