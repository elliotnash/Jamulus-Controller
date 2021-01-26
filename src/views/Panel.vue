<template>
  <div class="background">
    <Header @clickLogOut="onLogOutClick($event)" displayName="Jamulus Recordings"/>
    <div class="mainbox">
      <div class="left">
        <div class="itemdiv">
          <div class="box">
            <div class="boxheader">
              <span class="boxtitle">CONTROLS</span>
            </div>
            <ControlBox v-bind:recording-state="recordingState" />

          </div>
        </div>
        <div class="itemdiv">
          <div class = "box">
            <div class="boxheader">
              <span class="boxtitle">SYSTEM INFO</span>
            </div>
            <InfoBox/>
          </div>
        </div>
      </div>
      <div class = "right">
        <div class = "box">
          <div class="boxheader">
            <span class="boxtitle">RECORDINGS</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import ControlBox from "@/components/ControlBox";
import InfoBox from "@/components/InfoBox";

import Vue from 'vue'
import VWave from 'v-wave'
Vue.use(VWave, {
  color: '#2E3440',
  startingOpacity: 0.5,
  easing: 'ease-out',
})

export default {
  name: 'Panel',
  components: {
    InfoBox,
    ControlBox,
    Header
  },
  data () {
    return {
      recordingState: false,
    }
  },
  methods: {
    onLogOutClick(event){
      console.log('Clicked it')
      console.log(event)
    }
  },
  created () {

    document.title = 'Jamulus Recordings'

  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto')
@import url('https://fonts.googleapis.com/css?family=ABeeZee')

div
  &.background
    overflow-y: auto
    display: flex
    flex-flow: column
    background: #3B4252
    position: fixed
    bottom: 0
    right: 0
    left: 0
    top: 0

  &.mainbox
    display: flex
    flex-grow: 1
    @media screen and (max-width: 800px)
      flex-flow: column
    @media screen and (min-width: 1201px)
      width: 1200px
      margin: auto

  &.left
    flex-flow: column
    display: flex
    @media screen and (min-width: 801px)
      width: 400px

  &.right
    display: flex
    flex-grow: 1

  &.itemdiv
    align-content: center
    display: flex
    width: 100%
    height: auto

  &.box
    box-shadow: 0 0 8px 8px #00000010
    display: flex
    flex-flow: column
    background: #434C5E
    width: 100%
    height: auto
    margin: 20px
    border-radius: 15px

  &.boxheader
    background: #2E3440
    height: 40px
    width: 100%
    border-radius: 15px 15px 0 0
    display: flex
    justify-content: left
    align-items: center

span.boxtitle
  margin-left: 12px
  margin-top: 1px
  font-family: ABeeZee, sans-serif
  @media screen and (min-width: 601px)
    font-size: 18px
  @media screen and (max-width: 600px)
    font-size: 16px
  color: #ECEFF4

</style>
