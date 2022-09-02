<template>
    <h2>Thank you so much for support !</h2>
    <button @click="back()">Back</button>
</template>

<script>
import userService from '@/services/user.service'
export default {
    name: "PremiumSuccess-comp",
    data() {
        return {
            thisCurrentUser: [],
        }
    },
    methods: {
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        updateToPremium() {
            var data = {
                vip: true
            }
            userService.updateUser(this.currentUser._id, data)
                .then(response => {
                console.log(response);
                })
                .catch(e => {
                console.log(e);
            })
        },
        back() {
            this.$router.push({name: 'premium'})
        }
    },
    mounted() {
        this.getOneUser(this.currentUser._id) 
       this.updateToPremium()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        },
    }
}
</script>

<style scoped>

</style>