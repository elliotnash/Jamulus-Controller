<template lang="html">
  <Popup ref="popup" v-if="show" @close="close" >
    <audio class="player" controls preload="none" autoplay="false" >
      <source :src="url" type="audio/mp3" />
    </audio>
  </Popup>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

import Popup from './Popup.vue';
import Button from '../parts/Button.vue';
import TextBox from '../parts/TextBox.vue';

@Component({components: {
  Button,
  TextBox,
  Popup
}})
export default class FileDialog extends Vue {

  url = ""

  //TODO make this use promises and take a string of old name and resolve with string of new name,
  //then no specific code goes here
  recording: {name: string, uuid: string, created: Date, processed: boolean} | null = null;

  private show = false;

  open(recording: {name: string, uuid: string, created: Date, processed: boolean}){
    this.$store.dispatch("getMp3URL", recording).then((url) => {
      this.url = url;
      console.log("WE HAVE IT "+url);
    });
    this.show = true;
  }

  close(){
    this.show = false;
  }

  $refs!: {popup: Popup}

}

</script>

<style scoped lang="sass">

audio.player
  &:focus
    outline: none

</style>