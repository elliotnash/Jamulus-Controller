<template lang="html">
  <div class="contentbox">
    <RecordingItem v-for="recording in $store.state.recordings" :recording="recording" :key="recording.name"/>

    <span v-if="$store.state.recordings[0] == null" class="norecordings">No recordings, press start to start a recording</span>

    <div class="spacer"></div>
  </div>
</template>

<script>

import RecordingItem from "@/components/RecordingItem";

export default {
  name: "RecordingBox",
  components: {
    RecordingItem
  },
  props: ['recordings'],
  created() {
  }
};
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

span
  &.boxtitle
    margin: auto
    font-family: ABeeZee, sans-serif
    font-size: 15px
    color: #ECEFF4
  &.norecordings
    margin: auto
    padding: 20px
    font-family: ABeeZee, sans-serif
    font-size: 20px
    color: #ECEFF4

</style>