<template lang="html">
  <div>

    <transition name="shaderfade" mode="in-out">
      <div v-if="show" class="shader"/>
    </transition>

    <div @click="outsideClick()" class="fullpage">
      <transition name="scale">
        <div v-if="show" class="dialogdiv">
          <div @click.stop="onClick()" class="dialogbox">
            <div class="boxheader">
                <span class="boxtitle">SYSTEM INFO</span>
              </div>
          </div>
        </div>
      </transition>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "InfoBox",
  props: ['systemInfo'],
  data() {
    return {
      show: false
    }
  },
  methods: {
    onClick(){
    },
    outsideClick(){
      this.show =! this.show;
      //wait for animation to set dialog as closed
      setTimeout(() => {
        this.$emit('close')
      }, 300);
      

    }
  },
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
    height: 250px
    width: 400px
    @media screen and (max-width: 400px)
      width: 100%

  &.dialogbox
    background: #434C5E
    margin: 20px
    display: flex
    border-radius: 10px
    height: 100%
    width: 100%

  &.boxheader
    background: #2E3440
    height: 40px
    width: 100%
    border-radius: 10px 10px 0 0
    display: flex
    justify-content: left
    align-items: center

.shaderfade-enter-active
  animation: fade-in 0.3s

.shaderfade-leave-active
  animation: fade-in 0.3s reverse

.scale-enter-active
  animation: bounce-in 0.3s

.scale-leave-active
  animation: bounce-in 0.3s reverse;

@keyframes bounce-in 
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