<template lang="html">
  <div>

    <transition name="shaderfade">
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
      }, 200);
      

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
    background: #00000060

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

.shaderfade-enter-active, .shaderfade-leave-active
  opacity: 100%
  transition: opacity 0.2s ease-in-out

.shaderfade-enter, .shaderfade-leave-to
  opacity: 0

.scale-enter-active, .scale-leave-active
  opacity: 100%
  transform: scale(1)
  transition: all 0.1s ease-in-out

.scale-enter, .scale-leave-to
  opacity: 50%
  transform: scale(0.5)
  width: 0
  height: 0



</style>