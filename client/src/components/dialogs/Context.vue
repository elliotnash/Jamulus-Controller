<template lang="html">
  <div class="background">
  </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Context extends Vue {

}
</script>

<style scoped lang="sass">

div
  &.background
    position: fixed
    background-color: coral

    top: 20px
    left: 20px

</style>