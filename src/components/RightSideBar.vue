<template>
<div class="sidebar" v-if="open">
<div class="close">
    <button id="close-sideBar" @click="$emit('toggleBar')">X</button>
</div>

<div class="sidebar-title">
<h4 id="title">ONLINE FRIENDS</h4>    
</div> 
<div class="friends-container"> 
    <div class="row">
        <div class="col">
<div class="sidebar-elements">
  <ul class="list-group" id="RightSideBar-comp">
            <li class="list-group-item" id="itemsv1"
        :class="{ active: index == currentIndex}"
        v-for="(friend,index) in onlineFriends"
        :key="index"
        @click="setActiveUser(friend, index)"
        >
        {{friend.username}}
        </li>
        </ul>
        </div>
        </div>
        <div class="col" id="buttons">
            <div class="sidebar-options" v-if="thisFriendUser">
  <ul class="list-group" id="RightSideBar-comp">
            <li class="list-group-item" id="options"
        v-for="(friend,index) in onlineFriends"
        :key="index"
        >
        <button id="profile-button" v-show="thisFriendUser.username == friend.username" @click="goToProfile"><font-awesome-icon icon="user" /></button>
        <div class="invite-button-class">
        <button id="invite-button-add" v-show="thisFriendUser.username == friend.username && thisFriendUser.teamInviteSend == false && thisFriendUser.isInTeam == false && thisCurrentUser.isInTeam == true" @click="addToPending() ; sendInviteSocket()"><font-awesome-icon icon="envelope" /></button>
        <button id="invite-button-remove" v-show="thisFriendUser.username == friend.username && thisFriendUser.teamInviteSend == true" @click="removeFromPending(); deleteInviteSocket()"><font-awesome-icon icon="rectangle-xmark" /></button>
        </div>
        <button id="chat-button" v-show="thisFriendUser.username == friend.username" @click="createConversation()"><font-awesome-icon icon="comment" /></button>
        </li>
        </ul>
        </div>

        </div>
</div>
</div>

<div class="sidebar-title">
<h4 id="title">ALL FRIENDS</h4>    
</div> 
<div class="friends-container"> 
    <div class="row">
        <div class="col">
<div class="sidebar-elements">
  <ul class="list-group" id="RightSideBar-comp">
            <li class="list-group-item" id="itemsv1" 
        :class="{ active: index == currentIndex}"
        v-for="(friend,index,) in myAllFriendsWithoutOnline"
        :key="index"
        @click="setActiveUser(friend, index)"
        >
        {{friend.username}}
        </li>
        </ul>
        </div>
        </div>
        <div class="col" id="buttons">
            <div class="sidebar-options" v-if="thisFriendUser">
  <ul class="list-group" id="RightSideBar-comp">
            <li class="list-group-item" id="options" 
        v-for="(friend,index) in myAllFriendsWithoutOnline"
        :key="index"
        >
        <button id="profile-button" v-show="thisFriendUser.username == friend.username" @click="goToProfile"><font-awesome-icon icon="user" /></button>
        <!-- <button id="invite-button" v-show="thisFriendUser.username == friend.username" @click="addToPending() ; sendInviteSocket()"><font-awesome-icon icon="envelope" /></button> -->
        <button id="chat-button" v-show="thisFriendUser.username == friend.username" @click="createConversation()"><font-awesome-icon icon="comment" /></button>
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
import socketioService from "@/services/socketio.service";
import conversationService from "@/services/conversation.service"
import {chat} from "../store/chat"
export default {
    props: [
        "open",
    ],
    emits: [
        "toggleBar",
        "toggleChat",
    ],
    name: "RightSideBar-comp",
    data() {
        return {
            thisCurrentUser: [],
            myFriends: [],
            thisFriendUser: [],
            thisUser: null,
            currentIndex: -1,
            onlineUsers: [],
            onlineFriends: [],
            myAllFriendsWithoutOnline: [],
            teamInviteSend: false,
            isInTeam: false
        };
    },
    methods: {
        //get current user
        getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                this.thisCurrentUser = response.data;
            })
                .catch(e => {
                console.log(e);
            });
        },
        getFriendsUsernames(id) {
            userService.findOneUserAndFriends(id)
                .then(response => {
                    this.myFriends = response.data;
                    // console.log(this.myFriends)
            })
                .then(() => {
                this.$watch("onlineUsers", () => {
                    this.findOnlineFriends();
                });
            })
                .catch(e => {
                console.log(e);
            });
        },
        findOneUserByUsername(username) {
            userService.findOneUserByUsername(username)
                .then(response => {
                this.thisFriendUser = response.data;
                // console.log(this.thisFriendUser._id);
            });
        },
        addUserSocket() {
            // socketioService.socket.emit("addUser", this.currentUser._id);  //duplicate in chatBar
            socketioService.socket.on("getUsers", (users) => {
                this.onlineUsers = this.thisCurrentUser.friends.filter(f => users.some(u => u.userId === f));
                // console.log(this.onlineUsers)
            });
        },
        findOnlineFriends() {
            //get ONLINE FRIENDS
            this.onlineFriends = this.myFriends.filter(f => this.onlineUsers.includes(f._id));
            //get ALL FRIENDS WITHOUT ONLINE
            this.myAllFriendsWithoutOnline = this.myFriends.filter(f => !this.onlineUsers.includes(f._id))
        },
        setActiveUser(friend, index) {
            this.thisUser = friend;
            this.currentIndex = index;
            this.findOneUserByUsername(this.thisUser.username);
        },
        goToProfile() {
            this.$router.push({ name: "UserProfile", params: { id: this.thisFriendUser._id } });
        },
        log(message) {
            console.log(message);
        },
        addToPending() {
            var data = {
                _id: this.thisCurrentUser.team
            }
            teamService.addToPending(this.thisFriendUser._id, data)
                .then(response => {
                    console.log(response.data);
                    // this.teamInviteSend = true
                this.$nextTick(function () {
                    this.findOneUserByUsername(this.thisUser.username);
                })
                     
            })
                .catch(e => {
                console.log(e);
            });
        },
        removeFromPending() {
             var data = {
                _id: this.thisCurrentUser.team
            }
            teamService.removeFromPending(this.thisFriendUser._id, data)
                .then(response => {
                    console.log(response.data)
                    // this.teamInviteSend = false
                this.$nextTick(function () {
                    this.findOneUserByUsername(this.thisUser.username);
                     })
                })
                .catch(e => {
                console.log(e)
            })
        },

        sendInviteSocket() {
            if (this.thisFriendUser.isInTeam == false) {
                const receiverId = this.thisFriendUser._id
                socketioService.socket.emit("sendInvite", {
                    receiverId,
                    senderId: this.thisCurrentUser._id,
                    teamId: this.thisCurrentUser.team
                })
            } else {
                console.log("This user is in your team");
            }
        },

        deleteInviteSocket() {
                const receiverId = this.thisFriendUser._id
                socketioService.socket.emit("sendInvite", {
                    receiverId,
                    deleteInvite: true
                })
        },

        createConversation() {
            chat.receiverId = this.thisFriendUser._id
            var data = {
                senderId: this.currentUser._id,
                receiverId: chat.receiverId
            };
            conversationService.createConversation(data)
                .then(response => {
                    console.log(response);
                     this.$nextTick(function () {
                    conversationService.getConversation(this.thisCurrentUser._id)
                        .then(responsev2 => {
                    chat.myAllConversations = responsev2.data
                    // console.log(chat.myAllConversations)
                    this.$emit('toggleChat')
                })
                     })
                });
    
        },
        getInfoSocket() {
            socketioService.socket.on("getInfo", (data) => {
                
                this.thisFriendUser.teamInviteSend = data.teamInviteSend
                this.thisFriendUser.isInTeam = data.isInTeam
                
            })
        }
    },
    mounted() {
        this.getOneCurrentUser(this.currentUser._id);
        this.getFriendsUsernames(this.currentUser._id);
        this.addUserSocket();
        this.getInfoSocket()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
}
    
</script>

<style>
.sidebar{
    float: right;
   display: flex;
    justify-content: flex-start;
    /* align-items: center; */
    position: relative;
    flex-direction: column;
    width: 250px;
    height: calc(100vh - 56px);
    padding-top: 12px;
    background-color: rgb(106, 106, 179);  
    z-index: 10;
     overflow-y: scroll;
     overflow-x: hidden;
}

#itemsv1 {
 display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 50px;
      margin-bottom: 8px;
      margin-left: 0.2em;
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
    margin-left: 0.2em;
}

#chat-button{
    margin-left: 0.2em;
}

#title{
    margin-bottom: 1em;
    text-align: center;
}

.close{
    width:100%;
}

#close-sideBar{
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    float: right;
}

#buttons{
    padding-left: 0px !important;
}

</style>