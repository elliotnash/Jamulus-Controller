<template lang="html">
  <div class="relativebackground" >
    <transition name="dialog-animation">
      <div :style="{ '--x': x+'px', '--y': y+'px' }" class="background" v-show="show" @mousedown.stop >
        <div class="spacer" />
        <div v-wave class="contextitem" @click="rename" >
          <span class="itemtext" >
            <font-awesome-icon class="icons" icon="edit" />
            Rename
          </span>
        </div>
        <div v-wave class="contextitem" @click="download" >
          <span class="itemtext" >
            <font-awesome-icon class="icons" icon="download" />
            Download
          </span>
        </div>
        <div v-wave class="contextitem" @click="deleteRecording" >
          <span class="itemtext" >
            <font-awesome-icon class="icons" icon="trash-alt" />
            Delete
          </span>
        </div>
        <div class="spacer" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Emit } from 'vue-property-decorator';
//TODO make a mobile friednly context menu, probably using popup :S
@Component
export default class Context extends Vue {
  x = 0;
  y = 0;

  show = false;
  recording: {name: string, uuid: string, created: Date, processed: boolean} | null = null;

  openMenu(event: {x: number, y: number, recording: {name: string, uuid: string, created: Date, processed: boolean}}) {
    this.recording = event.recording;
    this.x = event.x;
    this.y = event.y;
    this.show = true;
  }

  closeMenu() {
    this.show = false;
  }

  onClick() {
    if (this.show) {
      this.closeMenu();
    }
  }

  created(){
    //set global onclick listener so we can close menu when clickout
    document.addEventListener('mousedown', this.onClick );
  }

  @Emit() rename(){
    this.closeMenu();
    return this.recording;
  }
  @Emit() download(){
    this.closeMenu();
    return this.recording;
  }
  @Emit('delete') deleteRecording(){
    this.closeMenu();
    return this.recording;
  }

}
</script>

<style scoped lang="sass">

.dialog-animation-enter-active
  animation: expand 0.1s

.dialog-animation-leave-active
  animation: expand 0.1s reverse;

@keyframes expand    
  from
    opacity: 0
  to
    opacity: 100%

div
  &.background
    position: absolute
    background-color: #ECEFF4
    border-radius: 5px

    --width: 150px

    left: Min( calc( 100% - var(--width) ), var(--x) )
    top: var(--y)

    width: var(--width)
    height: fit-content

    z-index: 10

  &.relativebackground
    position: relative
    background-color: coral

  &.spacer
    height: 5px

  &.contextitem
    margin: 0 5px 0 5px
    border-radius: 5px
    width: auto
    height: 35px
    &:hover 
      background-color: #4C566A50

span
  &.itemtext
    display: flex
    font-family: ABeeZee, sans-serif
    font-size: 15px
    align-items: center
    margin-left: 8px
    justify-content: left
    cursor: pointer
    height: 100%
    white-space: pre-wrap
    user-select: none

</style>