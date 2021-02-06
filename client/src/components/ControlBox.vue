<template>
  <div class="contentbox">
    <div class="itemdiv">
      <div class="left">
        <span class="boxtitle">TOGGLE RECORDING STATE</span>
      </div>
      <div class="right">
        <Button @click="onRecordToggle()"
                :color="recordingState ? 'red' : 'blue'"
                :title="recordingState ? 'STOP RECORDING' : 'START RECORDING'" />
      </div>
    </div>
    
    <div class="itemdiv">
      <div class="left">
        <span class="boxtitle">REFRESH RECORDING LIST</span>
      </div>
      <div class="right">
        <Button @click="refreshRecordings()" color="blue" title="REFRESH" />
      </div>
    </div>
    <div class="itemdiv">
      <div class="left">
        <span class="boxtitle">RESTART JAMULUS</span>
      </div>
      <div class="right">
        <Button @click="restartJamulus()" color="orange" title="RESTART" />
      </div>
    </div>
    <div class="spacer"></div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

import Button from '@/components/parts/Button.vue';

@Component({components: {
  Button
}})
export default class ControlBox extends Vue {

  @Prop(Boolean) recordingState!: boolean

  restartJamulus(){
    //TODO implement
  }

  refreshRecordings(){
    //TODO implement
  }

  onRecordToggle(){
    this.$store.dispatch('emitRecordToggle', !this.$store.state.recordingState);
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

span.boxtitle
  margin: auto
  font-family: ABeeZee, sans-serif
  font-size: 15px
  color: #ECEFF4

</style>