<template lang="html">
  <div class="div">

    <button v-wave onselectstart="return false;" id="logoutbtn" :class="color" @click="onClick()">{{title}}</button>
    
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

//TODO replace emit with @ syntax
@Component
export default class Button extends Vue {

  @Prop(String) title!: string
  @Prop({default: 'blue'}) color!: string

  onClick(){
      this.$emit('click');
  }
  
}
</script>

<style scoped lang="sass">
div.div
    display: flex
    flex-flow: column
    flex-grow: 1
    justify-content: center
button
    &.blue
        margin: auto
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
        box-shadow: 0 0 8px 8px #00000008

        &:hover
            background-color: #8FBCBB

    &.orange
        @extend button.blue
        background-color: #D08770

        &:hover
            background-color: #da9e8b

</style>