<template>
  <div v-bind:class="divClass">
    <input class="inputbox2" :type="type" name="textbox"
      :value="value" :placeholder="placeholder" 
      @input="$emit('input', $event.target.value)"
      @keydown="passKeyDown($event)"
    />
  </div>
</template>

<script lang=ts>

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

@Component
export default class Button extends Vue {

  @Prop({default: ''}) placeholder!: string
  @Prop({default: 'text'}) type!: string
  @Prop({default: ''}) value!: string

  passKeyDown(event: KeyboardEvent){
    if(event.key === 'Enter') {
      this.enter();
    }
  }

  @Emit() enter(){}

  divClass= {div: true, error: false}
  animateEvent = () => {
    console.log('animate event called');
    this.divClass.error = true;
    console.log(this.divClass);
    //TODO reset shake when done
  }

  @Emit()
  created() {
    return this.animateEvent;
  }

}

</script>

<style scoped lang="sass">

div.div
  display: flex
  flex-flow: column
  flex-grow: 1
  justify-content: center

input.inputbox2
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

.error
  position: relative
  animation: shake .1s linear
  animation-iteration-count: 3

@keyframes shake
  0%
    left: -5px
  100% 
    right: -5px

</style>