<template>
  <div
    class="fixed top-0 left-0 w-screen min-h-screen flex justify-center scrollbar-hide items-center overflow-scroll z-50"
  >
    <div
      class="bg-black bg-opacity-20 fixed top-0 left-0 w-screen min-h-screen"
      @click="emits('changeModal', false)"
    />
    <div
      class="bg-white scrollbar-hide rounded-lg shadow-2xl md:max-w-[700px] md:w-full pb-10 h-screen w-screen md:min-h-fit overflow-scroll relative md:h-auto z-10"
    >
      <div
        class="absolute top-10 right-10 md:hidden"
        @click="emits('changeModal', false)"
      >
        <CloseIcon />
      </div>
      <Form
        @submit="handleSubmit"
        class="md:px-10 px-5 py-10 flex flex-col gap-6"
      >
        <div class="relative w-full">
          <label for="name" class="text-2xl">Name:</label>
          <Field
            type="text"
            name="name"
            id="name"
            rules="required"
            :validate-on-input="true"
            class="border border-black focus:border-blue-600 hover:border-blue-600 duration-300 rounded-md bg-transparent focus:border focus:outline-none px-4 py-3 text-lg w-full block text-black mb-3"
            v-model="name"
            placeholder="Input Your New Collection Name"
          />
          <ErrorMessage name="name" class="text-red-600 absolute -bottom-4" />
        </div>

        <div class="w-full h-[300px] relative">
          <img
            v-if="image"
            :src="typeof image === 'string' ? image : createUrl(image)"
            alt="collection image"
            class="w-full h-[300px] absolute top-0 left-0 object-cover"
          />
          <Field
            type="file"
            name="image"
            class="opacity-0 z-[2] absolute top-0 left-0 w-full h-[300px] rounded-full"
            @input="(e) => handleFileUpload(e.target.files, 'image')"
          />
          <span
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] flex flex-col items-center"
          >
            <h2 class="text-3xl" v-if="image === null">Upload Image</h2>
            <CameraIcon />
          </span>
        </div>
        <button
          type="submit"
          class="bg-green-500 text-white py-2 px-4 md:inline block w-full md:max-w-[160px] rounded-md uppercase hover:bg-green-600 duration-300 text-lg"
        >
          Submit
        </button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";

import { createCollection, updateCollection } from "@/services";

import { CloseIcon, CameraIcon } from "@/components";

const props = defineProps({
  collectionValues: { required: true },
  updatable: { required: true },
});

const image = ref(props.collectionValues.image ?? null);
const name = ref(props.collectionValues.name);

const handleFileUpload = (data) => {
  if (data !== null) {
    if (data[0]) {
      image.value = data[0];
    }
  }
};

const createUrl = (url) => URL.createObjectURL(url);

const emits = defineEmits(["changeModal", "updateCollections"]);

const handleSubmit = async (info) => {
  const data = new FormData();
  if (image.value) {
    data.append("image", image.value);
  }
  data.append("name", info.name);

  try {
    let returnedData;
    if (props.updatable.open) {
      returnedData = await updateCollection(props.updatable.id, data);
    } else {
      returnedData = await createCollection(data);
    }

    emits("updateCollections", returnedData.data.data);
    emits("changeModal", false);
  } catch (err) {
    console.log(err);
  }
};
</script>
