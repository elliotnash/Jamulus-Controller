<template lang="html">
  <Popup ref="popup" v-if="show" @close="close" >
    <div class="dialogbox">
      <div class="boxheader">
        <span class="boxtitle">RENAME</span>
      </div>
      <div class="contentdiv">
        <div class="itemdiv">
          <TextBox type="text" v-model="newname" @enter="renameFile()" />
          <Button @click="renameFile()" :title="'RENAME'" :fontSize="14" />
        </div>
      </div>
    </div>
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

  newname = ""

  recording: {name: string, created: Date, processed: boolean} | null = null;

  private show = false;

  open(recording: {name: string, created: Date, processed: boolean}){
    this.newname = recording.name;
    this.recording = recording;
    this.show = true;
  }

  close(){
    this.show = false;
  }

  $refs!: {popup: Popup}

  renameFile(){
    this.$store.dispatch('renameFile', {
      oldname: (this.recording as {name: string, created: Date, processed: boolean}).name, 
      newname: this.newname
    });
    this.$refs.popup.startClose();
  }

}

</script>

<style scoped lang="sass">

div
  &.dialogbox
    background: #434C5E
    margin: 20px
    display: flex
    flex-flow: column
    border-radius: 10px
    height: 100px
    width: 100%

  &.boxheader
    background: #2E3440
    height: 40px
    width: 100%
    border-radius: 10px 10px 0 0
    display: flex
    justify-content: left
    align-items: center

  &.contentdiv
    height: auto
    display: flex
    flex-grow: 1
    flex-flow: column
    width: 100%
    border-radius: 10px
  
  &.itemdiv
    @extend .contentdiv
    display: flex
    flex-flow: row
    height: 100%

</style>