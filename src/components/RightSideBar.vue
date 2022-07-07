<template>
<div class="sidebar" v-if="open">
<div class="close">
    <button id="close-sideBar" @click="$emit('toggleBar')">X</button>
</div>
<div class="sidebar-title">
<h4 id="title">FRIENDS</h4>    
</div> 
<div class="container"> 
    <div class="row">
        <div class="col">
<div class="sidebar-elements">
  <ul class="list-group" id="RightSideBar-comp">
            <li class="list-group-item" id="items"
        :class="{ active: index == currentIndex}"
        v-for="(friend,index) in myFriends"
        :key="index"
        @click="setActiveUser(friend, index)"
        >
        {{friend}}
        </li>
        </ul>
        </div>
        </div>
        <div class="col">
            <div class="sidebar-options" v-if="thisFriendUser">
  <ul class="list-group" id="RightSideBar-comp">
            <li class="list-group-item" id="options"
        v-for="(friend,index) in myFriends"
        :key="index"
        >
        <button id="profile-button" v-show="thisFriendUser.username == friend" @click="goToProfile"><font-awesome-icon icon="user" /></button>
        <button id="invite-button" v-show="thisFriendUser.username == friend" @click="addToPending"><font-awesome-icon icon="envelope" /></button>
        </li>
        </ul>
        </div>

        </div>
</div>
</div>
</div> 
</template>

<script>
import userService from "@/services/user.service";
import teamService from "@/services/team.service";
export default {
    props: [
        'open'
    ],
    name: "RightSideBar-comp",
    data() {
        return {
            thisCurrentUser: [],
            myFriends: [],
            thisFriendUser: null,
            thisUser: null,
            currentIndex: -1,
        }
    },
    methods: {
         //get current user
          getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                })
                .catch(e => {
                console.log(e)
            })
        },
        getFriendsUsernames(id) {
            userService.findOneUserAndFriends(id)
                .then(response => {
                    this.myFriends = response.data
                })
                .catch(e => {
            console.log(e)
          })  
        },
        findOneUserByUsername(id) {
            userService.findOneUserByUsername(id)
                .then(response => {
                    this.thisFriendUser = response.data
                    console.log(this.thisFriendUser)
            })
        },
         setActiveUser(friend, index) {
            this.thisUser = friend
             this.currentIndex = index
             this.findOneUserByUsername(this.thisUser)
        },
        goToProfile() {
            this.$router.push({ name: 'UserProfile', params: { id: this.thisFriendUser._id } });
        },
        log(message) {
            console.log(message)
        },
        addToPending() {
            var data = {
                _id: this.thisCurrentUser.team
            }
            teamService.addToPending(this.thisFriendUser._id, data)
                .then(response => {
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
    },
    mounted() {
        this.getOneCurrentUser(this.currentUser._id)
         this.getFriendsUsernames(this.currentUser._id) 
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
    
</script>

<style>
.sidebar{
    float: right;
   display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    flex-direction: column;
    width: 250px;
    height: calc(100vh - 56px);
    padding-top: 12px;
    background-color: rgb(106, 106, 179);  
    z-index: 10;
     overflow-y: scroll;
}

#items {
 display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 50px;
      margin-bottom: 8px;
      cursor: pointer;
      color: #fefefe;
      background-color: #242424;
}

#options {
    display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      margin-bottom: 8px;
      color: #fefefe;
      background-color: rgb(106, 106, 179);  
      margin-left: 1em;
      border: none !important;
}

#invite-button{
    margin-left: 0.5em;
}

#title{
    margin-bottom: 1em;
}

.close{
    width:200px
}

#close-sideBar{
    margin-bottom: 0.5em;
    float: right;
}

</style>