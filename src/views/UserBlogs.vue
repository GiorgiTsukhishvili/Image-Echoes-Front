<template>
  <div class="bg-neutral-100 min-h-screen pb-40 pt-60">
    <WrapperComponent>
      <div>
        <div
          class="mb-10 mt-16 pb-10 border-b-2 border-gray-500 w-full flex justify-between items-center md:flex-row flex-col-reverse"
        >
          <h1 class="md:text-4xl text-2xl font-semibold">My Blogs:</h1>
          <button
            class="md:text-2xl text-xl bg-green-500 text-white py-2 px-4 rounded-md"
            @click="() => (modalOpen = true)"
          >
            Create Blog
          </button>
        </div>
        <ul class="mt-16 flex flex-wrap gap-20">
          <li
            v-for="blog in blogs"
            :key="blog.id"
            class="flex-1 min-w-[300px] max-w-[600px]"
          >
            <div class="flex justify-end gap-5 mb-6">
              <span @click="() => editBlog(blog)">
                <EditIcon collection />
              </span>
              <span
                @click="() => deleteChoseBlog(blog.id)"
                class="cursor-pointer"
              >
                <DeleteIcon />
              </span>
            </div>
            <CollectionBlog
              :title="blog.title"
              :image="blog.image"
              :id="blog.id"
            />
          </li>
        </ul>
      </div>
    </WrapperComponent>
  </div>
  <BlogModal
    v-if="modalOpen"
    @changeModal="closeModal"
    @updateBlogs="(value, tags) => updateBlogs(value, tags)"
    :tagsAndCollections="tagsAndCollections"
    :updatable="updatable"
    :blogValues="blogValues"
  />
</template>

<script setup>
import { watchEffect, ref, onMounted } from "vue";

import {
  WrapperComponent,
  CollectionBlog,
  DeleteIcon,
  EditIcon,
  BlogModal,
} from "@/components";

import { getUserBlogs, deleteBlog, getTags } from "@/services";

import { useUserStore } from "@/stores";

const blogs = ref([]);
const modalOpen = ref(false);
const tagsAndCollections = ref({ tags: [], collections: [] });
const updatable = ref({ open: false, id: null });
const blogValues = ref({
  image: null,
  title: "",
  description: "",
  tags: [],
  chosenCollection: null,
});

const user = useUserStore();

const closeModal = () => {
  modalOpen.value = false;
  updatable.value = { open: false, id: null };
  blogValues.value = {
    image: null,
    title: "",
    description: "",
    tags: [],
    chosenCollection: null,
  };
};

const editBlog = (blog) => {
  modalOpen.value = true;
  updatable.value = { open: true, id: blog.id };
  blogValues.value = {
    image: blog.image,
    title: blog.title,
    description: blog.description,
    tags: blog.tags.map((tag) => tag.id),
    chosenCollection: blog.blog_collection_id,
  };
};

const getBlogs = async () => {
  const data = await getUserBlogs();

  blogs.value = data.data;
};

const deleteChoseBlog = async (id) => {
  try {
    await deleteBlog(id);
    blogs.value = blogs.value.filter((blog) => blog.id !== id);
  } catch (err) {
    console.log(err);
  }
};

const updateBlogs = (data, tags) => {
  if (blogs.value.every((el) => el.id !== data.id)) {
    blogs.value.unshift({ ...data, tags });
  } else {
    blogs.value = blogs.value.map((el) =>
      el.id === data.id ? { ...el, ...data, tags } : el
    );
  }
};

onMounted(async () => {
  try {
    const data = await getTags();

    tagsAndCollections.value = data.data;
  } catch (err) {
    console.log(err);
  }
});

watchEffect(() => {
  if (user.user) {
    getBlogs();
  }
});
</script>
