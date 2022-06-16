<template>
    <div class="main">
        <div class="child">
        <h2>If u want get access to premium - click button</h2>
        <button class="btn btn-danger" v-if="thisUser.vip" @click="updateToPremium(false)">Resign</button>
        <button class="btn btn-warning" v-else @click="updateToPremium(true)">Get Premium</button>
        <div class="premium-status">
            <label><strong>Status:</strong></label>
            {{ thisUser.vip ? "You have premium" : "You don't have premium"}}
        </div>
        </div>
    </div>
</template>

<script>
import userService from '@/services/user.service'
export default {
    name: "Premium-comp",
    data() {
        return {
            thisUser: [],
            message: ""
        }
    },
    methods: {
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

        updateToPremium(status) {
            var data = {
                id: this.thisUser._id,
                username: this.thisUser.username,
                password: this.thisUser.password,
                email: this.thisUser.email,
                vip: status,
            }
            userService.updateUser(this.thisUser._id, data)
                .then(response => {
                    this.thisUser.vip = status
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
    mounted() {
        this.message = "",
        this.getOneUser(this.currentUser._id)
    }
}
</script>

<style scoped>
.main {
  margin: auto;
  width: 50%;
  border: 3px solid green;
  padding: 10px;
  align-items: center;
  text-align: center;
}


</style>