<template>
  <div class="background">
    <Header @click-log-out="onLogOutClick()" displayName="Jamulus Recordings" :show-log-out="true"/>
    <div class="mainbox">
      <div class="leftpanel">
        <div class="itemdiv">
          <div class="box">
            <div class="boxheader" @contextmenu.prevent >
              <span class="boxtitle">CONTROLS</span>
            </div>
            <ControlBox v-bind:recording-state="$store.state.recordingState" @recordToggle="onRecordToggle()"/>

          </div>
        </div>
        <div class="itemdiv">
          <div class = "box" @contextmenu.prevent >
            <div class="boxheader"  >
              <span class="boxtitle">SYSTEM INFO</span>
            </div>
            <InfoBox :system-info="$store.state.systemInfo"/>
          </div>
        </div>
      </div>
      <div class = "rightpanel">
        <div class = "recordingsbox" @contextmenu.prevent >
          <div class="boxheader">
            <span class="boxtitle">RECORDINGS</span>
          </div>
          <RecordingBox/>
        </div>
      </div>
    </div>
    <span class="copyright">©2020 Elliot Nash</span>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import Header from '@/components/Header.vue';
import ControlBox from "@/components/ControlBox.vue";
import InfoBox from "@/components/InfoBox.vue";
import RecordingBox from "@/components/RecordingBox.vue";

import VWave from 'v-wave';
Vue.use(VWave, {
  color: '#2E3440',
  startingOpacity: 0.5,
  easing: 'ease-out',
});

@Component({components: {
  Header,
  ControlBox,
  InfoBox,
  RecordingBox
}})
export default class Panel extends Vue {

  onLogOutClick(){
    console.log('logout clicked');
    this.$store.commit('setAuthentication', false);
    this.$router.push('/login');
  }
  
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto')
@import url('https://fonts.googleapis.com/css?family=ABeeZee')

div
  &.background
    overflow-y: auto
    flex-flow: column
    background: #3B4252
    position: fixed
    bottom: 0
    right: 0
    left: 0
    top: 0
    align-content: center

  &.mainbox
    display: flex
    height: fit-content
    margin: auto
    @media screen and (max-width: 800px)
      flex-flow: column-reverse
    @media screen and (min-width: 1201px)
      width: 1200px

  &.leftpanel
    flex-flow: column
    display: flex
    height: fit-content
    @media screen and (min-width: 801px)
      width: 400px

  &.rightpanel
    display: flex
    flex-grow: 1
    height: fit-content

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
    border-radius: 10px

  &.recordingsbox
    @extend div.box
    border-radius: 10px 10px 5px 5px

  &.boxheader
    background: #2E3440
    height: 40px
    width: 100%
    border-radius: 10px 10px 0 0
    display: flex
    justify-content: left
    align-items: center

span
  &.boxtitle
    margin-left: 12px
    margin-top: 1px
    font-family: ABeeZee, sans-serif
    @media screen and (min-width: 601px)
      font-size: 18px
    @media screen and (max-width: 600px)
      font-size: 16px
    color: #ECEFF4

  &.copyright
    font-family: ABeeZee, sans-serif
    font-size: 10px
    color: #8994a9
    padding-bottom: 20px



</style>
