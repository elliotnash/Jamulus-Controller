<template>
  <div class="panel">
    <div class="components">
      <div class="titlediv">
        <span id="title" class="title">{{ displayName }}</span>
      </div>
      <div v-if="showLogOut" class="buttondiv">
        <Button id="logoutbtn" @click="clickLogOut()" title="Log Out" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Button from '@/components/parts/Button.vue';

@Component({components:{
  Button
}})
export default class Header extends Vue {
  @Prop(String) readonly displayName!: string
  @Prop(Boolean) readonly showLogOut!: boolean

  @Emit() clickLogOut(){}

}
</script>

<style scoped lang="sass">

div
  &.panel
    margin-left: 5px
    margin-right: 5px
    border-radius: 0 0 10px 10px
    background: #2E3440
    height: 60px
    box-shadow: 0 0 8px 8px #00000020

  &.components
    position: center
    height: 100%
    @media screen and (min-width: 1201px)
      width: 1200px
    @media screen and (max-width: 1200px)
      width: 100%
    margin: auto

  &.titlediv
    display: flex
    justify-content: left
    margin-left: 30px
    align-items: center
    height: 100%
    width: auto
    float: left

  &.buttondiv
    display: flex
    justify-content: right
    margin-right: 30px
    align-items: center
    height: 100%
    width: auto
    float: right

span.title
  font-family: ABeeZee, sans-serif
  @media screen and (min-width: 601px)
    font-size: 30px
  @media screen and (max-width: 600px)
    font-size: 20px
  color: #ECEFF4

</style>
