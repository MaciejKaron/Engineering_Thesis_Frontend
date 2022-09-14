<template>
    <div class="profile-main">
    <div class="faceit-info" v-if="this.thisCurrentUser.faceitVerified == true">
      <div class="user-card">
    <div class="user-avatar">
      <img class="profile-avatar" :src="thisUserInfo.avatar" />
    </div>

    <div class="user-nickname">
    <h2>{{thisUserInfo.nickname}}</h2>
    </div>

    <div class="user-skill" :class="{red: thisStats.skill_level == 10, orange: thisStats.skill_level >= 4 && thisStats.skill_level < 10, green: thisStats.skill_level > 0 && thisStats.skill_level < 4}">
    <h4>Skill level: {{thisStats.skill_level}}</h4>
    </div>

    <div class="user-elo">
    <h5>Faceit elo: {{thisStats.faceit_elo}}</h5>
    </div>
  </div>

  <div class="user-stats">
    <div class="user-matches user-stat">
      Matches
      <br>
      {{thisGameStats.Matches}}
    </div>

    <div class="user-wins user-stat">
      Wins
      <br>
      {{thisGameStats.Wins}}
    </div>

    <div class="user-kd user-stat">
      K/D Ratio
      <br>
      {{thisGameStats["Average K/D Ratio"]}}
    </div>

    <div class="user-headshots user-stat">
      Average Headshots
      <br>
      {{thisGameStats["Average Headshots %"]}}%
    </div>

    <div class="user-winStreak user-stat">
      Longest win streak
      <br>
      {{thisGameStats["Longest Win Streak"]}}
    </div>
  </div>
    </div>

    <div class="change-nickname-box" v-if="thisCurrentUser.faceitVerified == true">
    <div class="verify-status-true">
      <h4>User successfully verified!</h4>
    </div>
    <div class="change-nickname">
      <h5>I set the wrong nickname</h5>
      <button class="customButton" @click="changeNickname()">Change</button>
    </div>
  </div>

      <div class="set-nickname" v-if="this.thisCurrentUser.faceitVerified == false">
        <h2>Please bind your account with faceit!</h2>
        <div class="form-group">
          <label for="nickname">Faceit Nickname</label>
        <input type="text" class="form-control" id="nickname" name="nickname" v-model="this.faceitNickname"/>
      </div>
      <button class="faceit-update customButton" @click="updateThisUser()" :disabled="!verifyAccept">Update</button>

      <div class="form-verify">
        <div class="verify-info">Impersonating another person will be punished with a permanent ban and removal of the account</div>
        <div class="label-checkbox-bind">
        <label for="faceitVerified" id="info-checkbox">Accept?</label>
        <input type="checkbox" id="verify-checkbox" v-model="this.verifyAccept" @change="handleVerified($event)"/>
        </div>
        <div class="verify-status-false" v-if="thisCurrentUser.faceitVerified == false">User is not verified!</div>
      </div>

      </div>
  </div>
</template>
<script>
import userService from '@/services/user.service'
import faceitService from '@/services/faceit.service'
export default {
  name: "Profile-comp",
  data() {
    return {
      thisCurrentUser: [],
      thisStats: [],
      thisUserInfo: [],
      thisGameStats: [],
      thisHistory: [],
      verifyAccept: false,
      faceitNickname: "",
      message: "",
      }
  },
  methods: {
    getCurrentUser(id) {
      userService.findOneUser(id)
        .then(response => {
          this.thisCurrentUser = response.data
          // console.log(this.thisCurrentUser);

          //get FACEIT STATS
          if (this.thisCurrentUser.faceitVerified == true) {
            this.getMyFaceitStats(this.thisCurrentUser._id)
            this.getGameStats(this.thisCurrentUser._id)
            // this.getPlayerHistory(this.thisCurrentUser._id)
          }
        })
    },
    //update faceit nickname by v-model
    updateThisUser() {
      var data = {
        faceitNickname: this.faceitNickname,
        faceitVerified: true
      }
      userService.updateUser(this.thisCurrentUser._id, data)
        .then(response => {
          console.log(response.data);
          this.getCurrentUser(this.thisCurrentUser._id)
        })
        .catch(e => {
          console.log(e)
        })
    },
    getMyFaceitStats(id) {
      faceitService.getMyFaceitStats(id)
        .then(response => {
          this.thisUserInfo = response.data
          this.thisStats = response.data.games.csgo
          // console.log(this.thisStats);
        })
        .then(() => {
          var data = {
            faceitAvatar: this.thisUserInfo.avatar
          }
          userService.updateUser(this.thisCurrentUser._id, data)
        })
    },
    getGameStats(id) {
      faceitService.getGameStats(id)
        .then(response => {
          this.thisGameStats = response.data.lifetime
        // console.log(this.thisGameStats);
      })
    },
    getPlayerHistory(id) {
      faceitService.getPlayerHistory(id)
        .then(response => {
          this.thisHistory = response.data
        console.log(this.thisHistory);
      })
    },

    handleVerified(event) {
      if (event.target.checked) {
        this.verifyAccept = event.target.checked
      } else {
        this.verifyAccept = event.target.checked
      }
    },
    changeNickname() {
      var data = {
        faceitVerified: false,
        faceitNickname: "",
        faceitAvatar: ""
      }
      userService.updateUser(this.thisCurrentUser._id, data)
        .then(response => {
          console.log(response.data);
          this.getCurrentUser(this.thisCurrentUser._id)
        })
        .catch(e => {
          console.log(e)
        })
    }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
      },
    },
    mounted() {
        if (!this.currentUser) {
            this.$router.push('/login')
      }
      this.getCurrentUser(this.currentUser._id)
    }
}
</script>
<style scoped>

.profile-avatar{
  max-width: 7em;
  max-height: 7em;
  border-radius: 66px;
}

.faceit-info{
  max-width: 60em;
    margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    text-align: center;
    font-family: roboto;
    color: white;
}

.profile-main{
  margin-top: 5em;
}

.user-card{
  background-color: #1a1a1d;
  margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    max-width: 16em;
    height: 16em;
    border-radius: 5%;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:0px 0px 12px 2px #c3073f;
}

.profile-avatar{
  margin-top: 0.5em;
}

.user-nickname{
  margin-top: 0.5em;
}

.red{
  color: red;
}

.orange{
  color: orange;
}

.green{
  color: green;
}

.user-stats{
  margin-top: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-stat{
  margin-left: 1em;
  margin-right: 1em;
  background-color: #1a1a1d;
  display: flex;
  align-items: center;
  justify-content: center;
    width: 10em;
    height: 6em;
    border-radius: 5%;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:0px 0px 2px 1px #c3073f;
}

.change-nickname-box{
  margin-top: 8em;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    max-width: 20em;
    height: 16em;
    text-align: center;
    font-family: roboto;
    color: white;
}

.customButton {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.customButton:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.nickname-form{
  display: inline;
}
.faceit-update{
  margin-left: 1em;
}

.verify-status-false{
  margin-top: 0.5em;
  color: red;
}

.verify-status-true{
   margin-top: 0.5em;
  color: green;
}

.set-nickname{
  margin-top: 8em;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
    max-width: 30em;
    height: 16em;
    text-align: center;
    font-family: roboto;
    color: white;
}

.form-group{
  margin-top: 2em;
    margin-right: auto;
    margin-bottom: 2em;
    margin-left: 4.5em;
    display: inline-block;
}

.form-control{
  background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    text-align: center;
}

.form-verify{
  max-width: 14em;
  margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
    margin-left: auto;
}

#info-checkbox{
  margin-top: 1em;
}

#verify-checkbox{
  accent-color: #6f2232;
  margin-left: 0.5em;
}
</style>