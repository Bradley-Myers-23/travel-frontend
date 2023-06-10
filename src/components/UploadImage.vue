<template>
  <div>
    Upload Image
    <div class="row">
      <div class="col-8">
        <label class="btn btn-default p-0">
          <input
            type="file"
            accept="image/*"
            ref="file"
            @change="selectImage"
          />
        </label>
      </div>
    </div>

    <div v-if="previewImage">
      <div>
        <img class="preview my-3" :src="previewImage" alt="" />
      </div>
    </div>

    <div v-if="message" class="alert alert-secondary" role="alert">
      {{ message }}
    </div>

    <div class="card mt-3">
      <div class="card-header"></div>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item"
          v-for="(image, index) in imageInfos"
          :key="index"
        >
          <a :href="image.url">{{ image.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "upload-image",
  props: ["newSite"],
  data() {
    return {
        currentImage: undefined,
        previewImage: undefined,

        progress: 0,
        message: "",

        imageInfos: [],
    };
  },
  methods: {
    async selectImage() {
        this.currentImage = this.$refs.file.files.item(0);
        this.previewImage = URL.createObjectURL(this.currentImage);
        this.progress = 0;
        this.message = "";
        this.newSite.picture = Buffer.from(await this.currentImage.arrayBuffer(), "base64").toString('base64');
        console.log(this.newSite.picture);
    },
    upload() {
      this.progress = 0;

      UploadService.upload(this.currentImage, (event) => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then((response) => {
          this.message = response.data.message;
          return UploadService.getFiles();
        })
        .then((images) => {
          this.imageInfos = images.data;
        })
        .catch((err) => {
          this.progress = 0;
          this.message = "Could not upload the image! " + err;
          this.currentImage = undefined;
        });
    },
  }
};
</script>