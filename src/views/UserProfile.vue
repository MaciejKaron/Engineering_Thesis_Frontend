<template>
<div v-if="thisUser" class="main">
<h3>Witaj na profilu gracza {{thisUser.username}}</h3>
<p><strong>Email</strong> {{thisUser.email}}</p>
<p><strong>Premium</strong> {{thisUser.vip}}</p>
<p><strong>Pending friends:</strong> {{thisUser.pendingFriends}}</p>
<p><strong>Invitations:</strong> {{thisUser.invitations}}</p>
<p><strong>Friends list:</strong> {{thisUser.friends}}</p>
<button class="profile-button-add" v-if="((!thisUser.invitations.includes(thisCurrentUser._id)) && (!thisUser.pendingFriends.includes(thisCurrentUser._id)) && (!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser._id !== thisCurrentUser._id))" @click="addToPending(); sendInviteFriendsSocket(); sendInviteFriendsSocketInfo(); createNotification()">Add to friends</button>
<button class="profile-button-undo" v-if="thisUser.invitations.includes(thisCurrentUser._id)" @click="removeFromPending(); sendInviteFriendsRemoveUndoSocket()">Undo sending the invitation</button>
<button class="profile-button-remove" v-if="thisUser.friends.includes(thisCurrentUser._id)" @click="removeFromFriends(); sendInviteFriendsRemoveUndoSocket()">Remove from friends</button>
<button class="profile-button-decline" v-if="((!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser.pendingFriends.includes(thisCurrentUser._id)))" @click="declineTheInvitation(); sendInviteFriendsAcceptDeclineSocket()">Decline invitation</button>
<button class="profile-button-accept" v-if="((!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser.pendingFriends.includes(thisCurrentUser._id)))" @click="confirmTheInvitation(); sendInviteFriendsAcceptDeclineSocket()">Accept Invitation</button>
</div>
</template>

<script>
import userService from '@/services/user.service'
import socketioService from '@/services/socketio.service'
import notificationService from '@/services/notification.service'
export default {
    name: "UserProfile-comp",
    data() {
        return {
            thisUser: null,
            thisCurrentUser: [],
            message: "",
            notifications: []
        }
    },
    methods: {
        //Get user from rout
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisUser = response.data
                    // console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        //get current user
          getOneCurrentUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                    // console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        addToPending() {
            userService.addToPending(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response.data)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        removeFromFriends() {
            userService.removeFromFriends(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response.data)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        removeFromPending() {
            userService.removeFromPending(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response.data)
                this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
          confirmTheInvitation() {
            userService.confirmTheInvitation(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        declineTheInvitation() {
            userService.declineTheInvitation(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response)
                    this.refreshInformations()
                })
                .catch(e => {
                console.log(e)
            })
        },
        refreshInformations() {
            this.$nextTick(function () {
                this.getOneUser(this.$route.params.id)
                this.getOneCurrentUser(this.currentUser._id)
            })
        },

        createNotification() {
            var data = {
                sender: this.thisCurrentUser._id,
                senderName: this.thisCurrentUser.username,
                receiver: this.thisUser._id
            }
            notificationService.createNotification(data)
                .then(response => {
                console.log(response)
            })
        },

        sendInviteFriendsSocket() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInvite", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                senderName: this.thisCurrentUser.username,
            })
        },

        sendInviteFriendsSocketInfo() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInfo", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                sended: true
            })
        },

        sendInviteFriendsAcceptDeclineSocket() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInfo", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                accepted: true,
                declined: true
            })
        },

        sendInviteFriendsRemoveUndoSocket() {
            const receiverId = this.thisUser._id
            socketioService.socket.emit("sendFriendsInfo", {
                receiverId,
                senderId: this.thisCurrentUser._id,
                undo: true,
                removed: true
            })
        },

        getFriendsInviteSocket() {
            socketioService.socket.on("getFriendsInfo", (data) => {
                this.notifications.push({
                    sender: data.senderId,
                    sended: data.sended,
                    accepted: data.accepted,
                    declined: data.declined,
                    removed: data.removed,
                    undo: data.undo
                });
                for (var i = 0; i < this.notifications.length; i++) {
                    if (this.notifications[i].sended == true) {
                        this.refreshInformations()
                        this.refreshInformations()
                        this.refreshInformations()
                    }
                    if (this.notifications[i].accepted == true) {
                        this.refreshInformations()
                    }
                    if (this.notifications[i].declined == true) {
                        this.refreshInformations()
                    }
                    if (this.notifications[i].removed == true) {
                        this.refreshInformations()
                    }
                    if (this.notifications[i].undo == true) {
                        this.refreshInformations()
                    }
                }
            })    
        },
        log(message) {
            console.log(message);
        },
        
    },
    mounted() {
        this.message = ""
        this.getOneUser(this.$route.params.id)
        this.getOneCurrentUser(this.currentUser._id)
        this.getFriendsInviteSocket()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>

<style scoped>

</style>