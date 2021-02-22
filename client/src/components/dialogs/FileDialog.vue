<template lang="html">
  <div>

    <transition name="shaderfade" mode="in-out">
      <div v-if="show" class="shader"/>
    </transition>

    <div @mousedown.left="startClose()" class="fullpage">
      <transition name="scale">
        <div v-if="show" class="dialogdiv">
          <div @mousedown.left.stop class="dialogbox">
            <div class="boxheader">
              <span class="boxtitle">Choose an action</span>
            </div>
            <div class="contentdiv">
              <div class="spacer"/>
              <div class="itemdiv">
                <TextBox type="text" v-model="newname" @enter="renameFile()" />
                <Button @click="renameFile()" :title="'RENAME'" :fontSize="14" />
              </div>
              <div class="itemdiv">
                <Button @click="deleteFile()" :title="'DELETE'"  :color="'orange'" :fontSize="14" />
                <Button @click="downloadFile()" :title="'DOWNLOAD'" :fontSize="14" />
              </div>
              <div class="spacer"/>
            </div>
          </div>
        </div>
      </transition>
    </div>
    
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import Button from '../parts/Button.vue';
import TextBox from '../parts/TextBox.vue';


@Component({components: {
  Button,
  TextBox
}})
export default class FileDialog extends Vue {

  @Prop() recording!: {name: string, created: Date, processed: boolean}

  newname = this.recording.name
  show = false

  startClose(){
    this.show = false;
    //wait for animation to set dialog as closed
    setTimeout(() => {
      this.close();
    }, 200);
  }
  @Emit() close(){}

  downloadFile(){
    this.$store.dispatch('downloadFile', this.recording.name);
    this.close();
  }
  renameFile(){
    console.log(this.newname);
    this.$store.dispatch('renameFile', {oldname: this.recording.name, newname: this.newname});
    this.close();
  }
  deleteFile(){
    this.$store.dispatch('deleteFile', this.recording.name);
    this.close();
  }
  
  mounted() {
    this.show = true;
  }
}

</script>

<style scoped lang="sass">

div
  &.fullpage
    display: flex
    flex-flow: column
    position: fixed
    bottom: 0
    right: 0
    left: 0
    top: 0
    align-content: center
    justify-content: center

  &.shader
    @extend .fullpage
    background: #00000080

  &.dialogdiv
    margin: auto
    display: flex
    border-radius: 10px
    height: 250px
    width: 400px
    @media screen and (max-width: 400px)
      width: 100%

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
    height: 40%

.shaderfade-enter-active
  animation: fade-in 0.2s

.shaderfade-leave-active
  animation: fade-in 0.2s reverse

.scale-enter-active
  animation: bounce-in 0.2s

.scale-leave-active
  animation: bounce-in 0.2s reverse;

@keyframes bounce-in 
  from 
    
  to 
    
  0%
    transform: scale(0)
  70% 
    transform: scale(1.1)
  100% 
    transform: scale(1)

@keyframes fade-in
  from 
    opacity: 0
  to 
    opacity: 1
  


</style>