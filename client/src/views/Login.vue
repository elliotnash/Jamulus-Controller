<template>
  <div>
    <div class="background">
      <Header displayName="Jamulus Recordings" :showLogOut="false"/>
      <div class="mainbox">
        <div class="itemdiv">
          <div class="box">
            <div class="boxheader">
              <span class="boxtitle">LOGIN</span>
            </div>
            <div class="spacer"/>
            <div class="inputfeild">
              <div class="textdiv">
                <span class="inputtitle">Username</span>
              </div>
              <!-- <input class="inputbox" type="email" name="username" v-model="input.username" placeholder="Username" /> -->
              <TextBox type="email" placeholder="Username"  v-model="input.username" />
            </div>
            <div class="smallspacer"/>
            <div class="inputfeild">
              <div class="textdiv">
                <span class="inputtitle">Password</span>
              </div>
              <TextBox type="password" placeholder="Password" v-model="input.password" @enter="login()" @created="registerShake" />
            </div>
            <div class="submitfeild">
              <Button id="logoutbtn" :fontSize="14" @click="login()" :title="'Submit'"/>
            </div>
            <div class="spacer"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//TODO Animate failed login (+message)
import { Component, Vue } from 'vue-property-decorator';

import Header from "@/components/Header.vue";
import Button from '@/components/parts/Button.vue';
import TextBox from '@/components/parts/TextBox.vue';
import passwordHash from 'password-hash';

import VWave from 'v-wave';
Vue.use(VWave, {
  color: '#2E3440',
  startingOpacity: 0.5,
  easing: 'ease-out',
});

@Component({
  components: {
    Header,
    Button,
    TextBox
  }
})
export default class Login extends Vue{
  input = {username: "", password: ""}

  shakePassword = () => {};
  registerShake(callback: {(): void}) {
    this.shakePassword = callback;
  }

  login() {
    this.$store.dispatch('authenticate', {
      user: this.input.username,
      passHash: passwordHash.generate(this.input.password)
    }).then((allowed: boolean) => {
      if (allowed){
        this.$router.push('/');
      } else {
        this.shakePassword();
      }
    });
  }

}
</script>

<style scoped lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto')
@import url('https://fonts.googleapis.com/css?family=ABeeZee')
div

  &.background
    flex-flow: column
    flex-basis: auto
    background: #3B4252
    position: fixed
    bottom: 0
    right: 0
    left: 0
    top: 0

  &.mainbox
    display: flex
    margin: auto
    height: 85%
    width: 100%
    border-radius: 20px
    justify-content: center
    align-content: center

  &.itemdiv
    margin: auto
    align-content: center
    display: flex
    width: 600px
    @media (max-width: 600px)
      width: 100%
    height: 400px

  &.box
    box-shadow: 0 0 8px 8px #00000010
    display: flex
    flex-flow: column
    background: #434C5E
    width: 100%
    height: auto
    margin: 20px
    border-radius: 10px

  &.boxheader
    background: #2E3440
    height: 40px
    width: 100%
    border-radius: 10px 10px 0 0
    display: flex
    justify-content: left
    align-items: center

  &.spacer
    height: 40px
  &.smallspacer
    height: 8px

  &.inputfeild
    display: flex
    flex-flow: column
    flex-grow: 0
    justify-content: center
    border-radius: 10px

  &.submitfeild
    border-radius: 10px
    display: flex
    flex-flow: column
    flex-grow: 1
    justify-content: center

  &.textdiv
    width: 100%
    height: auto


span
  &.boxtitle
    margin-left: 14px
    margin-top: 1px
    font-family: ABeeZee, sans-serif
    @media screen and (min-width: 601px)
      font-size: 18px
    @media screen and (max-width: 600px)
      font-size: 16px
    color: #ECEFF4

  &.inputtitle

    font-family: ABeeZee, sans-serif
    font-size: 18px
    color: #ECEFF4

</style>