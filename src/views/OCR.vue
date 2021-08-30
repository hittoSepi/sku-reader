<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>OCR Reader</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true">
      <img id="image" />
      <ion-button id="takePhoto" v-on:click="takePhoto()">Ota kuva</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonTitle, IonToolbar, IonHeader, IonButton } from "@ionic/vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { defineComponent } from "vue";
import Tesseract from "tesseract.js";

export default defineComponent({
  name: "OCR testi",
  components: {
    IonTitle,
    IonToolbar,
    IonHeader,
    IonButton,
  },
  data() {
    return {};
  },

  methods: {
    ocr: function (url) {
      Tesseract.recognize(url);
    },
    takePhoto: function () {
      const takePicture = async () => {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        });

        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        const imageUrl = image.webPath;
        this.ocr(imageUrl);
        // Can be set to the src of an image now
        //const imageElement = document.getElementById("image") as Image;
        //imageElement.src = imageUrl;
      };
      takePicture();
    },
  },
  //mounted() {},
});
</script>