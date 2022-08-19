<template>
<div class="team-name">{{currentTeam.name}}</div>
<div class="team-tag">{{currentTeam.tag}}</div>
<div class="team-owner">Owner: {{teamOwner.username}}</div>
<div class="team-players">Players:
    <ul>
        <li class="players-list"
             v-for="player in teamPlayers" :key="player._id">
                {{player.username}}
        </li>
    </ul>
</div>
</template>

<script>
import teamService from '@/services/team.service';
import userService from '@/services/user.service';
export default {
    name: "TeamProfile-comp",
    data() {
        return {
            currentTeam: [],
            teamOwner: [],
            teamPlayers: [],
        }
    },
    methods: {
        getCurrentTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.currentTeam = response.data
                // console.log(response);
                    this.getTeamOwner(this.currentTeam.owner)
                    this.getTeamPlayers()
            })
        },
        getTeamOwner(id) {
            userService.findOneUser(id)
                .then(response => {
            this.teamOwner = response.data
         })   
        },
        getTeamPlayers() {
            for (var i = 0; i < this.currentTeam.players.length; i++){
                userService.findOneUser(this.currentTeam.players[i])
                    .then(response => {
                    this.teamPlayers.push(response.data)
                })
            }
        }
    },
    mounted() {
      this.getCurrentTeam(this.$route.params.id)  
    },
    computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    },
}
</script>

<style scoped>
.team-name{
    font-size: 32px;
    text-align: center;
}

.team-tag{
    margin-top: 1em;
    font-size: 28px;
    text-align: center;
}

.team-owner{
    margin-top: 1em;
    font-size: 24px;
    text-align: center;
}

.team-players{
    margin-top: 1em;
    font-size: 24px;
    text-align: center;
}
</style>