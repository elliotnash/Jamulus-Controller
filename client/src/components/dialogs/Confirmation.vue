<template lang="html">
  <Popup ref="popup" v-if="show" @close="close" >
    <div class="dialogbox">
      <div class="boxheader">
        <span class="boxtitle">{{title}}</span>
      </div>
      <div class="contentdiv">
        <div class="itemdiv">
          <span class="message" >{{message}}</span>
        </div>
        <div class="itemdiv">
          <Button @click="resolve(false)" :title="'CANCEL'" :fontSize="14" />
          <Button @click="resolve(true)" :title="title" :color="'red'" :fontSize="14" />
        </div>
        <div class ="spacer" />
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

  private show = false;
  private title = "";
  private message = "";

  private promise = (bool: boolean) => {};
  open(title: string, message: string){

    this.title = title;
    this.message = message;

    this.show = true;
    return new Promise<boolean>((promise) => {
      this.promise = promise;
    });
  }
  resolve(result: boolean){
    this.promise(result);
    this.$refs.popup.startClose();
  }

  close(){
    this.show = false;
  }

  $refs!: {popup: Popup}

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
    height: auto
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
  
  &.spacer
    height: 50px

span.message
  display: flex
  justify-content: left 
  align-content: center
  margin: auto
  margin-left: 12px
  font-family: ABeeZee, sans-serif
  font-size: 15px
  color: #ECEFF4

</style>