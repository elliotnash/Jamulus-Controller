<template>
  <div>
    <div :class="recording.processed ? 'elementdiv' : 'elementdivdisabled'" 
    v-wave @click="itemClick()" @contextmenu.prevent="context($event)">
      <div class="textdiv">
        <span class="boxtitle" >{{ recording.name }}</span>
      </div>
      <div v-wave class="rightdiv" @click.stop="context($event)">
        <font-awesome-icon class="icons" icon="ellipsis-h" />
      </div>
    </div>
    <FileDialog :recording="recording" @close="showDialog = false" v-if="showDialog" />
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import FileDialog from './dialogs/FileDialog.vue';

@Component({components: {
  FileDialog
}})
export default class RecordingItem extends Vue {

  showDialog = false
  
  @Prop() recording!: {name: string, created: Date, processed: boolean}

  @Emit()
  context(event: MouseEvent){
    return {x: event.clientX, y: event.clientY};
  }
  
  itemClick() {
    if (this.recording.processed){
      this.showDialog = true;
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
  
  &.elementdivdisabled
    @extend .elementdiv 
    background: #2E3440
    @media(hover: hover) and (pointer: fine)
      &:hover
        background: #2E3440

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