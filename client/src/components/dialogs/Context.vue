<template lang="html">
  <div :style="{ '--x': x+'px', '--y': y+'px' }" class="background" v-show="show" >
  </div>
</template>

<script lang="ts">

import { Vue, Component, Emit } from 'vue-property-decorator';

@Component
export default class Context extends Vue {
  x = 0;
  y = 0;

  show = false;

  openMenu(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.show = true;
  }

  closeMenu() {
    this.show = false;
  }

  @Emit()
  created() {
    return {open: this.openMenu, close: this.closeMenu};
  }

}
</script>

<style scoped lang="sass">

div
  &.background
    position: fixed
    background-color: #ECEFF4
    border-radius: 5px

    left: var(--x)
    top: var(--y)
    right: calc( (100% - 150px) - var(--x) )
    bottom: calc( (100% - 150px) - var(--y) )


</style>