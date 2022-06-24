<template>
<div class="welcome">
    <h2>INFO ABOUT YOUR TEAM</h2>
</div>
<div class="team-info">
    <p><strong>NAME:</strong>{{currentTeam.name}}</p>
    <p><strong>TAG:</strong>{{currentTeam.tag}}</p>
    <p><strong>OWNER:</strong>{{currentTeam.owner}}</p>
    <p><strong>MEMBERS:</strong>{{currentTeam.players}}</p>
</div>
</template>

<script>
import teamService from "@/services/team.service"
import userService from "@/services/user.service"
export default {
    name: "myTeam-comp",
    data() {
        return {
             thisUser: [],
            currentTeam: [],
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
         //Get team from rout
        getOneTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.currentTeam = response.data
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
    },
     mounted() {
         this.getOneUser(this.currentUser._id) 
        this.getOneTeam(this.$route.params.id)
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        },
    },
}
</script>

<style scoped>
.welcome{
  max-width: 400px;
  margin:auto
}
</style>