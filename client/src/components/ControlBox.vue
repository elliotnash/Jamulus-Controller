<template>
  <div class="contentbox">
    <div class="itemdiv">
      <div class="left">
        <span class="boxtitle">TOGGLE RECORDING STATE</span>
      </div>
      <div class="right">
        <button slot="pure" onselectstart="return false;" id="toggle-record" @click="$emit('recordToggle',$event)"
                :class="recordingState ? 'redbtn' : 'bluebtn'" v-wave
                v-text="recordingState ? 'STOP RECORDING' : 'START RECORDING'" />
      </div>
    </div>
    
    <div class="itemdiv">
      <div class="left">
        <span class="boxtitle">REFRESH RECORDING LIST</span>
      </div>
      <div class="right">
        <button slot="pure" onselectstart="return false;" id="refresh-recordings" @click="refreshRecordings($event)"
                class="bluebtn" v-wave >REFRESH</button>
      </div>
    </div>
    <div class="itemdiv">
      <div class="left">
        <span class="boxtitle">RESTART JAMULUS</span>
      </div>
      <div class="right">
        <button slot="pure" onselectstart="return false;" id="restart-jamulus" @click="restartJamulus($event)"
                class="orangebtn" v-wave >RESTART</button>
      </div>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script>

import Vue from 'vue'
import VWave from 'v-wave'

Vue.use(VWave, {
  color: '#2E3440',
  startingOpacity: 0.5,
  easing: 'ease-out',
})


export default {
  name: "ControlBox",
  props: {
    recordingState: Boolean
  },
  methods: {
    newRecording(event){
      console.log(event)
    },
    refreshRecordings(event){
      console.log(event)
    }
  }
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
    background: #3B4252
    margin-top: 20px
    height: 60px
    border-radius: 5px
  &.spacer
    height: 20px

  &.left
    display: flex
    width: 60%
    justify-content: center
    align-content: center

  &.right
    display: flex
    flex-grow: 1
    justify-content: center
    align-content: center

button
  &.bluebtn
    margin: auto
    border: none
    background-color: #88C0D0
    border-radius: 6px
    font-size: 13px
    font-family: ABeeZee, sans-serif
    color: #4C566A
    padding: 10px
    outline: none

    -webkit-touch-callout: none
    -webkit-user-select: none
    -khtml-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    -o-user-select: none
    user-select: none

    &:hover
      background-color: #8FBCBB

  &.redbtn
    @extend button.bluebtn
    background-color: #BF616A

    &:hover
      background-color: #c46e77

  &.orangebtn
    @extend button.bluebtn
    background-color: #D08770

    &:hover
      background-color: #da9e8b

span.boxtitle
  margin: auto
  font-family: ABeeZee, sans-serif
  font-size: 15px
  color: #ECEFF4

</style>