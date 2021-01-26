<template lang="html">
  <div class="contentbox">
    <div class="itemdiv">
      <span class="boxtitle">JAMULUS STATUS: RUNNING</span>
    </div>
    <div class="itemdiv">
      <span class="boxtitle">CLIENTS CONNECTED: 0</span>
    </div>
    <div class="itemdiv">
      <span class="boxtitle">CPU USAGE: 0%</span>
    </div>
    <div class="itemdiv">
      <span class="boxtitle">MEMORY USAGE: 0/2000MB</span>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script>
export default {
name: "RecordingBox"
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
    margin-top: 2px
    height: 40px
    border-radius: 5px
    justify-content: center
    align-content: center
  &.spacer
    height: 2px

span.boxtitle
  margin: auto
  font-family: ABeeZee, sans-serif
  font-size: 15px
  color: #ECEFF4

</style>