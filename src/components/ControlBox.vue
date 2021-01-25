<template>
  <div class="contentbox">
    <div class="itemdiv">

    </div>
    <div class="itemdiv">

    </div>
    <div class="itemdiv">

    </div>
    <div class="itemdiv">

    </div>
    <div class="spacer"></div>
  </div>
</template>

<script>
export default {
name: "ControlBox"
}
</script>

<style scoped lang="sass">
div
  &.contentbox
    display: flex
    flex-flow: column
    height: 100%
    width: 100%
  &.itemdiv
    background: #3B4252
    margin-top: 20px
    height: 60px
    border-radius: 5px
  &.spacer
    height: 20px

</style>