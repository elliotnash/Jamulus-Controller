<template lang="html">
  <div id="recordingbox" class="contentbox" ref="recordingbox">

    <Context ref="context" @rename="openRename" @download="startDownload" @delete="openDelete" />

    <RenameDialog ref="rename" />

    <RecordingItem v-for="recording in $store.state.recordings" :recording="recording" :key="recording.name" @context="onContext" />

    <span v-if="$store.state.recordings[0] == null" class="norecordings">No recordings, press start to start a recording</span>

    <div class="spacer"></div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

import RecordingItem from "@/components/RecordingItem.vue";
import Context from "@/components/dialogs/Context.vue";
import RenameDialog from '@/components/dialogs/RenameDialog.vue';

@Component({components: {
  RecordingItem,
  Context,
  RenameDialog
}})
export default class RecordingBox extends Vue {

  @Prop() recordings!: {name: string, created: Date, processed: boolean}[]

  $refs!: {
    context: Context
    recordingbox: HTMLFormElement
    rename: RenameDialog
  }

  onContext(event: {x: number, y: number, recording: {name: string, created: Date, processed: boolean}}){

    //get top left of div and subtract to get relative coords 
    let left = this.$refs.recordingbox.getBoundingClientRect().left;
    let top = this.$refs.recordingbox.getBoundingClientRect().top;
    event.x -= left;
    event.y -= top;

    this.$refs.context.openMenu(event);

  }

  openRename(recording: {name: string, created: Date, processed: boolean}){
    this.$refs.rename.open(recording);
  }
  startDownload(recording: {name: string, created: Date, processed: boolean}){

  }
  openDelete(recording: {name: string, created: Date, processed: boolean}){

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