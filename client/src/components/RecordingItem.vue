<template>
  <div>
    <div :class="recording.processed ? 'elementdiv' : 'elementdivdisabled'" 
    v-wave @click="itemClick()" @contextmenu.prevent.stop="contextClicked($event)">
      <div class="textdiv">
        <span class="boxtitle" >{{ recording.name }}</span>
      </div>
      <div v-wave class="rightdiv" @click.stop="context($event)">
        <font-awesome-icon class="icons" icon="ellipsis-h" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class RecordingItem extends Vue {
  
  @Prop() recording!: {name: string, uuid: string, created: Date, processed: boolean}


  contextClicked(event: MouseEvent){
    if (this.recording.processed)
      this.context(event);
  }
  @Emit()
  context(event: MouseEvent){
    return {x: event.clientX, y: event.clientY, recording: this.recording};
  }
  
  itemClick() {
    if (this.recording.processed){
      this.click(this.recording);
    }
  }
  @Emit()
  click(recording: {name: string, uuid: string, created: Date, processed: boolean}) {
    return recording;
  }

}
</script>

<style scoped lang="sass">
div
  &.elementdiv
    display: flex
    background: #3B4252
    cursor: pointer
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