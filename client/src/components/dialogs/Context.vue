<template lang="html">
  <div class="relativebackground" >
    <div :style="{ '--x': x+'px', '--y': y+'px' }" class="background" v-show="show" @click.stop >
      <div class="spacer" />
      <div v-wave class="contextitem" >
        <span class="itemtext" >
          <font-awesome-icon class="icons" icon="edit" />
          Rename
        </span>
      </div>
      <div v-wave class="contextitem" >
        <span class="itemtext" >
          <font-awesome-icon class="icons" icon="download" />
          Download
        </span>
      </div>
      <div v-wave class="contextitem" >
        <span class="itemtext" >
          <font-awesome-icon class="icons" icon="trash-alt" />
          Delete
        </span>
      </div>
      <div class="spacer" />
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Context extends Vue {
  x = 0;
  y = 0;

  show = false;

  openMenu(event: {x: number, y: number, recording: {name: string, created: Date, processed: boolean}}) {
    this.x = event.x;
    this.y = event.y;
    this.show = true;
  }

  closeMenu() {
    this.show = false;

    //remove global event listeners to not 

  }

  onClick() {
    if (this.show) {
      this.closeMenu();
    }
  }

  created(){
    //set global onclick listener so we can close menu when clickout
    document.addEventListener('click', this.onClick );
    document.addEventListener('contextmenu', this.onClick );
  }

}
</script>

<style scoped lang="sass">

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
    height: 40px
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