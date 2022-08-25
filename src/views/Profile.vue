<template>
    <div class="container">
    <h3>Faceit Info</h3>
    <div class="faceit-info" v-if="this.thisCurrentUser.faceitVerified == true">
    <div class="avatar-container">
      Avatar: <img class="avatar" :src="thisUserInfo.avatar" />
    </div>

    <div>
    Nickname: {{thisUserInfo.nickname}}
    </div>

    <div>
    Skill level:{{thisStats.skill_level}}
    </div>

    <div>
    Faceit elo:{{thisStats.faceit_elo}}
    </div>

    <div>
      Matches: {{thisGameStats.Matches}}
    </div>

    <div>
      Wins: {{thisGameStats.Wins}}
    </div>

    <div>
      K/D Ratio: {{thisGameStats["Average K/D Ratio"]}}
    </div>

    <div>
      Average Headshots: {{thisGameStats["Average Headshots %"]}}%
    </div>

    <div>
      Longest win streak: {{thisGameStats["Longest Win Streak"]}}
    </div>

    <div class="verify-status-true" v-if="thisCurrentUser.faceitVerified == true">User successfully verified!</div>
    <div class="change-nickname">
      <h5>I set the wrong nickname</h5>
      <button @click="changeNickname()">Change</button>
    </div>
    </div>

      <div class="set-nickname" v-if="this.thisCurrentUser.faceitVerified == false">
        <h4>Please bind your account with faceit</h4>
        <h6>Faceit Nickname:</h6>
        <div class="nickname-form">
        <input type="text" class="nickname-bind" id="nickname"
          v-model="this.faceitNickname"
        />
      </div>

      <button class="faceit-update" @click="updateThisUser()" :disabled="!verifyAccept">Update</button>

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
    },
    getGameStats(id) {
      faceitService.getGameStats(id)
        .then(response => {
          this.thisGameStats = response.data.lifetime
        // console.log(this.thisGameStats);
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
        faceitVerified: false
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
.nickname-bind{
  max-width: 14em;
}
.nickname-form{
  display: inline;
}
.faceit-update{
  margin-left: 1em;
}

.form-verify{
  max-width: 17em;
}
.verify-info{
  margin-top: 1em;
  max-width: 17em;
}

#info-checkbox{
  margin-top: 1em;
}

.label-checkbox-bind{
  float: right;
}

.verify-status-false{
  margin-top: 0.5em;
  color: red;
}

.verify-status-true{
   margin-top: 0.5em;
  color: green;
}

.change-nickname{
  margin-top: 5em;
}

.avatar{
  
        max-width: 5em;
        max-height: 5em;
        
        border-radius: 66px;
}

</style>