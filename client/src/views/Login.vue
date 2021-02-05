<template>
  <div>
    <div class="background">
      <Header displayName="Jamulus Recordings"/>
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
              <input class="inputbox" type="email" name="username" v-model="input.username" placeholder="Username" />
            </div>
            <div class="smallspacer"/>
            <div class="inputfeild">
              <div class="textdiv">
                <span class="inputtitle">Password</span>
              </div>
              <input class="inputbox" type="password" name="password" v-model="input.password" @keydown="passKeyDown($event)" placeholder="Password" />
            </div>
            <div class="submitfeild">
              <button v-wave onselectstart="return false;" id="logoutbtn" class="submitbtn" @click="login()">Submit</button>
            </div>
            <div class="spacer"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Header from "@/components/Header.vue";
import passwordHash from 'password-hash';

@Component({
  components: {
    Header
  }
})
export default class Login extends Vue{
  input = {username: "", password: ""}

  passKeyDown(event: KeyboardEvent){
    if(event.key === 'Enter') {
      this.login();
    }
  }

  login() {
    this.$store.dispatch('authenticate', {
      user: this.input.username,
      passHash: passwordHash.generate(this.input.password)
    }).then(() => {
      this.$router.push('/');
    }, () => {
      console.log('incorrect pass');
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

button.submitbtn
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


</style>