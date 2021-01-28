<template>
  <div class="elementdiv" v-wave @click="divClick" >
    <div class="textdiv">
      <span class="boxtitle" >{{ recording.name }}</span>
    </div>
    <div v-wave @click="moreClick($event)" class="rightdiv">
      <font-awesome-icon class="icons" icon="ellipsis-h" />
    </div>
  </div>
</template>

<script>
export default {

  name: "RecordingItem",
  props: {
    recording: {}
  },
  methods: {
    moreClick(event) {
      event.stopPropagation();
    },
    divClick() {
      console.log('div clicked')
    }
  }
}
</script>

<style scoped lang="sass">
div
  &.elementdiv
    display: flex
    background: #3B4252
    margin-top: 2px
    height: 40px
    @media(max-width: 600px)
      height: 60px
    border-radius: 5px
    align-items: center
    @media(hover: hover) and (pointer: fine)
      &:hover
        background: #4C566A

  &.textdiv
    border-radius: 10px
    float: left
    height: auto
    width: 100%

  &.rightdiv
    border-radius: 10px
    float: right
    height: auto
    width: auto
    margin-right: 10px

.icons
  padding: 5px
  color: #ECEFF4
  user-select: none

span.boxtitle
  margin: auto auto auto 14px
  float: left
  font-family: ABeeZee, sans-serif
  font-size: 15px
  color: #ECEFF4
  user-select: none

</style>