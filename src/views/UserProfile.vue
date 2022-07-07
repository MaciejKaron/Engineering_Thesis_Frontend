<template>
<div v-if="thisUser" class="main">
<h3>Witaj na profilu gracza {{thisUser.username}}</h3>
<p><strong>Email</strong> {{thisUser.email}}</p>
<p><strong>Premium</strong> {{thisUser.vip}}</p>
<p><strong>Pending friends:</strong> {{thisUser.pendingFriends}}</p>
<p><strong>Invitations:</strong> {{thisUser.invitations}}</p>
<p><strong>Friends list:</strong> {{thisUser.friends}}</p>
<button class="profile-button-add" v-if="((!thisUser.invitations.includes(thisCurrentUser._id)) && (!thisUser.pendingFriends.includes(thisCurrentUser._id)) && (!thisUser.friends.includes(thisCurrentUser._id)))" @click="addToPending">Add to friends</button>
<button class="profile-button-undo" v-if="thisUser.invitations.includes(thisCurrentUser._id)" @click="removeFromPending">Undo sending the invitation</button>
<button class="profile-button-remove" v-if="thisUser.friends.includes(thisCurrentUser._id)" @click="removeFromFriends">Remove from friends</button>
<button class="profile-button-decline" v-if="((!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser.pendingFriends.includes(thisCurrentUser._id)))" @click="declineTheInvitation">Decline invitation</button>
<button class="profile-button-accept" v-if="((!thisUser.friends.includes(thisCurrentUser._id)) && (thisUser.pendingFriends.includes(thisCurrentUser._id)))" @click="confirmTheInvitation">Accept Invitation</button>
</div>
</template>

<script>
import userService from '@/services/user.service'
export default {
    name: "UserProfile-comp",
    data() {
        return {
            thisUser: null,
            thisCurrentUser: [],
            message: ""
        }
    },
    methods: {
        //Get user from rout
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisUser = response.data
                    console.log(response.data)
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
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        addToPending() {
            userService.addToPending(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        removeFromFriends() {
            userService.removeFromFriends(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        removeFromPending() {
            userService.removeFromPending(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
          confirmTheInvitation() {
            userService.confirmTheInvitation(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                    console.log(response)
                })
                .catch(e => {
                console.log(e)
            })
        },
        declineTheInvitation() {
            userService.declineTheInvitation(this.$route.params.id, this.thisCurrentUser)
                .then(response => {
                console.log(response)
                })
                .catch(e => {
                console.log(e)
            })
        },
    },
    mounted() {
        this.message = ""
        this.getOneUser(this.$route.params.id)
        this.getOneCurrentUser(this.currentUser._id)
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