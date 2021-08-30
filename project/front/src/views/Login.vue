<template>
  <ion-page>
    <ion-content>
      <ion-card id="login-card" class="slide-bottom">
        <ion-card-header color="light">
          <ion-title class="ion-text-start ion-no-padding">
            <ion-icon
              class="ion-float-left"
              size="large"
              :icon="logInOutline"
            ></ion-icon>
            <span style="position: relative; left: 8px; display: inline-block">
              Lahti.TK
            </span>
          </ion-title>
        </ion-card-header>
        <ion-card-content>
          <!-- LoginForm -->
          <form id="login-form" @submit="onSubmit" @keyup.enter="onSubmit">
            <ion-item class="ion-margin-top" color="light">
              <ion-label position="floating">Sähköposti </ion-label>
              <ion-input
                id="email"
                name="email"
                type="email"
                v-model="login.email"
              ></ion-input>
            </ion-item>

            <ion-item-divider />

            <ion-item color="light">
              <ion-label position="floating">Salasana</ion-label>
              <ion-input
                id="password"
                name="password"
                type="password"
                v-model="login.password"
              >
              </ion-input>
            </ion-item>

            <ion-item
              lines="none"
              class="ion-text-center ion-margin-top"
              v-if="login.error"
            >
              <div
                :title="login.errorMsg"
                style="width: 100%; color: var(--ion-color-danger)"
              ></div>
            </ion-item>

            <!-- LoginButton -->
            <ion-button
              color="success"
              button-type="button"
              type="submit"
              expand="full"
            >
              Kirjaudu
            </ion-button>
            <!-- /LoginButton -->
          </form>
          <!-- /LoginForm -->

          <ion-button
            href="signup"
            size="small"
            expand="full"
            router-animation="true"
            color="warning"
            >Luo tunnukset</ion-button
          >
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonLabel,
  IonIcon,
  IonPage,
  IonInput,
  IonItem,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonItemDivider,
  IonCardContent,
} from "@ionic/vue";
// eslint-disable-next-line
import { isLoggedIn, setAuthTokens, clearAuthTokens } from "axios-jwt";
import { logInOutline } from "ionicons/icons";
import { defineComponent, getCurrentInstance } from "vue";
import $ from "jquery";
import { axiosInstance } from "@/api";

export default defineComponent({
  name: "LoginPage",
  components: {
    IonPage,
    IonInput,
    IonButton,
    IonLabel,
    IonItem,
    IonIcon,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonItemDivider,
    IonCardContent,
  },
  setup() {
    return {
      logInOutline,
    };
  },
  data: function () {
    return {
      login: {
        errorMsg: "Virhe kirjautumisessa!",
        error: false,
        loggedIn: false,
        email: "",
        password: "",
      },
    };
  },
  mounted(): void {
    const app = getCurrentInstance();
    this.apiHost = app.appContext.config.globalProperties.apiHost;
    clearAuthTokens();

    /// Stupid autofill agent css fix
    $("#email, #password").on("change", function (event) {
      setTimeout(function () {
        if ($(event.target).is(":-internal-autofill-selected")) {
          const clone = $(event.target).clone(true, true);
          $(event.target).after(clone);
          $(event.target).remove();
        }
      }, 1);
    });
  },
  methods: {
    /**
     * Login form submit
     */
    onSubmit: function (e: any) {
      const router = this.$router;
      const apiHost = this.$apiHost;
      e.preventDefault();
      if (this.login.email != null && this.login.password != null) {
        if (this.login.password.length > 6) {
          this.login.error = false;

          axiosInstance({
            responseType: "json",
            method: "post",
            url: `${apiHost}/login`,
            data: {
              error: false,
              password: this.login.password,
              email: this.login.email,
            },
          })
            .then(function (response) {
              setAuthTokens({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
              });
              router.push({
                path: "/pages/main",
              });
            })
            .catch(function (error) {
              console.log(error);
              this.login.error = true;
            });
        }
      }
      this.login.error = true;
    },
  },
});
</script>


<style scoped>
ion-title {
  font-size: 26px;
}

ion-item-divider {
  min-height: 4px;
  --background: var(
    --ion-card-background,
    var(--ion-item-background, var(--ion-background-color, rgb(136, 31, 31)))
  );
  --color: var(
    --ion-card-color,
    var(--ion-item-color, var(--ion-color-step-550, #737373))
  );
}

#login-card {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  opacity: 1;
  height: auto;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}
</style>