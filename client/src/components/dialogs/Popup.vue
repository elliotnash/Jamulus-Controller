<template lang="html">
  <div>

    <transition name="shaderfade" mode="in-out">
      <div v-if="show" class="shader"/>
    </transition>

    <div @mousedown.left="startClose()" class="fullpage">
      <transition name="scale">
        <div @mousedown.left.stop v-if="show" class="dialogdiv">
          <slot>
            <!-- This is where things inside Popup go (actual dialog) -->
          </slot>
        </div>
      </transition>
    </div>
    
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import Button from '../parts/Button.vue';
import TextBox from '../parts/TextBox.vue';


@Component({components: {
  Button,
  TextBox
}})
export default class FileDialog extends Vue {

  show = false

  readonly timeout = 200;

  startClose(){
    this.show = false;
    //wait for animation to set dialog as closed
    setTimeout(() => {
      this.close();
    }, this.timeout);
  }
  @Emit() close(){}
  
  mounted() {
    this.show = true;
  }
}

</script>

<style scoped lang="sass">

div
  &.fullpage
    display: flex
    flex-flow: column
    position: fixed
    bottom: 0
    right: 0
    left: 0
    top: 0
    align-content: center
    justify-content: center

  &.shader
    @extend .fullpage
    background: #00000080

  &.dialogdiv
    margin: auto
    display: flex
    border-radius: 10px
    height: auto
    width: 400px
    @media screen and (max-width: 400px)
      width: 100%

.shaderfade-enter-active
  animation: fade-in 0.2s

.shaderfade-leave-active
  animation: fade-in 0.2s reverse

.scale-enter-active
  animation: bounce-in 0.2s

.scale-leave-active
  animation: bounce-in 0.2s reverse;

@keyframes bounce-in 
  from 
    
  to 
    
  0%
    transform: scale(0)
  70% 
    transform: scale(1.1)
  100% 
    transform: scale(1)

@keyframes fade-in
  from 
    opacity: 0
  to 
    opacity: 1
  


</style>