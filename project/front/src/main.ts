import { createApp } from 'vue'

import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';


/* Theme variables */
import './theme/variables.css';

const app = createApp(App)
	.use(IonicVue)
	.use(router)

app.config.globalProperties.$apiHost = 'https://app.lahti.tk:8081';

import Mittari from './components/Mittari.vue';
app.component('mittari', Mittari);

import PowerButton from './components/PowerButton.vue';
app.component('power-button', PowerButton);

app.component('fake-item', {
	template: `<div class="white-widget grey-bg author-area">
      <div class="auth-info row">
        <div class="timeline-wrapper">
          <div class="timeline-item">
            <div class="animated-background">
              <div class="background-masker header-top"></div>
              <div class="background-masker header-left"></div>
              <div class="background-masker header-right"></div>
              <div class="background-masker header-bottom"></div>
              <div class="background-masker subheader-left"></div>
              <div class="background-masker subheader-right"></div>
              <div class="background-masker subheader-bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`
})


router.isReady().then(() => {
	app.mount('#app');
});