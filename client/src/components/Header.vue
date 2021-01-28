<template>
  <div class="panel">
    <div class="components">
      <div class="titlediv">
        <span id="title" class="title">{{ displayName }}</span>
      </div>
      <div v-if="showLogOut" class="buttondiv">
        <button v-wave onselectstart="return false;" id="logoutbtn" class="logoutbtn" @click="onLogOutClick($event)">Log Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VWave from 'v-wave'

Vue.use(VWave, {
  color: '#2E3440',
  startingOpacity: 0.5,
  easing: 'ease-out'
})

export default {
  name: 'Header',
  props: {
    displayName: String,
    showLogOut: Boolean
  },
  modules: ['v-wave/nuxt'],
  methods: {
    onLogOutClick(event) {
      this.$emit('clickLogOut', event)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

div
  &.panel
    margin-left: 5px
    margin-right: 5px
    border-radius: 0 0 10px 10px
    background: #2E3440
    height: 60px
    box-shadow: 0 0 8px 8px #00000020

  &.components
    position: center
    height: 100%
    @media screen and (min-width: 1201px)
      width: 1200px
    @media screen and (max-width: 1200px)
      width: 100%
    margin: auto

  &.titlediv
    display: flex
    justify-content: left
    margin-left: 30px
    align-items: center
    height: 100%
    width: auto
    float: left

  &.buttondiv
    display: flex
    justify-content: right
    margin-right: 30px
    align-items: center
    height: 100%
    width: auto
    float: right

button.logoutbtn
  border: none
  background-color: #88C0D0
  border-radius: 6px
  font-size: 14px
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



span.title
  font-family: ABeeZee, sans-serif
  @media screen and (min-width: 601px)
    font-size: 30px
  @media screen and (max-width: 600px)
    font-size: 20px
  color: #ECEFF4

</style>
