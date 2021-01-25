<template>
  <div class="background">
    <Header @clickLogOut="onLogOutClick($event)" displayName="Jamulus Recordings"/>
    <div class="mainbox">
      <div class="left">
        <div class="itemdiv">
          <div class="box">
            <div class="boxheader">

            </div>
          </div>
        </div>
        <div class="itemdiv">
          <div class = "box">
            <div class="boxheader">
            </div>
          </div>
        </div>
      </div>
      <div class = "right">
        <div class = "box">
          <div class="boxheader">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header'
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
    Header
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
    @media screen and (min-width: 1201px)
      width: 1200px
      margin: auto

  &.left
    flex-flow: column
    display: flex
    width: 33.33%

  &.right
    display: flex
    flex-grow: 1

  &.itemdiv
    align-content: center
    display: flex
    width: 100%
    height: 100%

  &.box
    box-shadow: 0 0 8px 8px #00000010
    display: flex
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

</style>
