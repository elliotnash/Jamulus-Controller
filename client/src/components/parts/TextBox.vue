<template>
  <input class="inputbox" type="password" name="password" v-model="input.password" @keydown="passKeyDown($event)" placeholder="Password" />
</template>

<script lang=ts>

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class Button extends Vue {

  @Prop(String) title!: string
  @Prop({default: 'blue'}) color!: string
  @Prop({default: 13}) fontSize!: number

  @Emit() click(){}

}

</script>

<style scoped lang=sass>

input.inputbox
  border: none
  width: auto
  padding: 12px 20px
  margin: 10px
  box-sizing: border-box
  border-radius: 10px
  outline: none
  background-color: #4C566A
  color: #D8DEE9
  box-shadow: 0 0 8px 8px #00000008

</style>