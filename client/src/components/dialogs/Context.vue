<template lang="html">
  <div class="relativebackground" >
    <div :style="{ '--x': x+'px', '--y': y+'px' }" class="background" v-show="show" >
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Emit } from 'vue-property-decorator';

@Component
export default class Context extends Vue {
  x = 0;
  y = 0;

  show = false;

  openMenu(event: {x: number, y: number}) {
    this.x = event.x;
    this.y = event.y;
    this.show = true;

    //set global onclick listener so we can close menu when clickout
    document.addEventListener('click', this.closeMenu );

  }

  closeMenu() {
    this.show = false;
  }

}
</script>

<style scoped lang="sass">

div
  &.background
    position: absolute
    background-color: #ECEFF4
    border-radius: 5px

    left: var(--x)
    top: var(--y)

    width: 100px
    height: 150px

    z-index: 10

  *.relativebackground
    position: relative
    background-color: coral
    width: 100%
    height: 100%


</style>