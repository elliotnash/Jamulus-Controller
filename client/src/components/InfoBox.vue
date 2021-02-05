<template lang="html">
  <div class="contentbox">
    <div class="itemdiv">
      <span class="boxtitle">JAMULUS STATUS: RUNNING</span>
    </div>
    <div class="itemdiv">
      <span class="boxtitle">CLIENTS CONNECTED: 0</span>
    </div>
    <div class="itemdiv">
      <span class="boxtitle">CPU USAGE: {{systemInfo.cpuUsage}}%</span>
    </div>
    <div class="itemdiv">
      <span class="boxtitle">MEMORY USAGE: {{systemInfo.memUsed}}/{{systemInfo.totalMem}}MB</span>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class InfoBox extends Vue {
  @Prop() readonly systemInfo!: {memUsed: number, totalMem: number, cpuUsage: number}
}
</script>

<style scoped lang="sass">
div
  &.contentbox
    display: flex
    flex-flow: column
    height: auto
    width: 100%
  &.itemdiv
    display: flex
    background: #3B4252
    margin-top: 20px
    height: 60px
    border-radius: 5px
    justify-content: center
    align-content: center
  &.spacer
    height: 20px

span.boxtitle
  margin: auto
  font-family: ABeeZee, sans-serif
  font-size: 15px
  color: #ECEFF4

</style>