<template>
    <div class="wrapper">
        <div class="add_form">
            <div class="add_txt">
                <h2 v-if="thisCurrentUser.isInTeam == false">Create your team!</h2>
            </div>
            <div class="submit-form">
                <div v-if="thisCurrentUser.isInTeam == false">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" required v-model="team.name" name="name" />
                </div>
                <div class="form-group">
                    <label for="tag">Tag</label>
                    <input type="text" class="form-control" id="tag" required v-model="team.tag" name="tag" />
                </div>
                <button @click="saveTeam()" class="btn btn-success">Submit</button>
                </div>
                <div class="after_txt" v-if="thisCurrentUser.isInTeam == true">
                <h3>Your team profile</h3>
                <p><strong>NAME:</strong>{{currentTeam.name}}</p>
                <p><strong>TAG:</strong>{{currentTeam.tag}}</p>
                <p><strong>OWNER:</strong>{{owner.username}}</p>
                <p><strong>MEMBERS:</strong></p>
                <ul>
                    <li  v-for="(friend,index,) in players" :key="index">
                        {{friend.username}}
                    </li>
                </ul>
                <button class="leave-team" v-if="thisCurrentUser._id !== currentTeam.owner" @click="leaveTeam(); sendInfoSocketLeave()">Leave Team</button>
                </div>
                <div class="team-settings" v-if="thisCurrentUser.isInTeam == true && thisCurrentUser._id == currentTeam.owner">
                <h4>Team Settings</h4>
                <button class="btn btn-success" @click="goToYourTeam()">Team settings</button>
                <button class="btn btn-warning" @click="deleteTeam()">Delete your team</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import teamService from "@/services/team.service"
import userService from "@/services/user.service"
import socketioService from '@/services/socketio.service'
export default {
    name: "Team-comp",
    data() {
        return {
            team: {
                id: null,
                name: "",
                tag: "",
                owner: null,
                players: [],
            },
            submitted: false,
            thisCurrentUser: [],
            currentTeam: [],
            owner: [],
            players: [],
            newPlayer: null,
            leaver: null,
        }
    },
    methods: {
        saveTeam() {
            var data = {
                name: this.team.name,
                tag: this.team.tag,
                owner: this.team.owner,
                players: this.team.players
            }
            teamService.createTeam(data)
                .then(response => {
                    this.team.id = response.data._id
                    console.log(response.data._id)
                    this.$router.push({ name: 'myTeam', params: { id: response.data._id } })
                    this.submitted = true
                
                })
                .catch(e => {
                console.log(e)
                })
        },
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                    this.team.owner = this.thisCurrentUser._id
                // console.log(response.data)

                //GET CURRENT USER TEAM
                    if (this.thisCurrentUser.isInTeam == true) {
                        this.getOneTeam(this.thisCurrentUser.team)
                    }
                })
                .catch(e => {
                console.log(e)
            })
        },
        getOneTeam(id) {
            teamService.findOneTeam(id)
                .then(response => {
                    this.currentTeam = response.data
                // console.log(response.data)

                //GET OWNER INFORMATIONS
                    this.findOwnerUsername()

                //GET INFORMATIONS ABOUT PLAYERS
                this.findPlayersUsernames()
                })
                .catch(e => {
                console.log(e)
            })
        },
        findOwnerUsername() {
            userService.findOneUser(this.currentTeam.owner)
                .then(response => {
                    this.owner = response.data
                    // console.log(this.owner)
            })
        },
        findPlayersLoop() {
            for (var i = 0; i < this.currentTeam.players.length; i++){
                userService.findOneUser(this.currentTeam.players[i])
                    .then(response => {
                        this.players.push(response.data)
                })
            }  
        },

        clearPlayersLoop() {
            for (var i = 0; i < this.currentTeam.players.length; i++) {
                        userService.findOneUser(this.currentTeam.players[i])
                            .then(response => {
                                this.players.pop(response.data)
                            })
                    }
        },

        findPlayersUsernames() {
            //IF NEW PLAYEER
            this.$watch("newPlayer", () => {
                console.log('123');
                if (this.newPlayer !== undefined) {
                    this.currentTeam.players.push(this.newPlayer)

                    this.clearPlayersLoop()
                    this.findPlayersLoop()
                }
            })
            //IF PLAYER LEAVE
            this.$watch("leaver", () => {
                console.log('456');
                if (this.leaver !== undefined) {
                    this.clearPlayersLoop()
                    if (this.currentTeam.players.includes(this.leaver)) {
                        this.currentTeam.players = this.currentTeam.players.filter(f => !f.includes(this.leaver))
                    }
                    this.$nextTick(function () {
                        this.findPlayersLoop()
                    })
                }
            })
            //STANDARD EXECUTE
            this.findPlayersLoop()
        },

        deleteTeam() {
            teamService.deleteTeam(this.thisCurrentUser.team)
                .then(response => {
                    console.log(response.data)
                 this.submitted = false
                this.team = {}
                })
                .catch(e => {
                console.log(e)
                })
             this.reloadPage()
        },

        leaveTeam() {
            var data = {
                _id: this.currentTeam._id
            }
            teamService.leaveTeam(this.thisCurrentUser._id, data)
                .then(response => {
                    console.log(response);
                this.reloadPage()
            })    
        },

        sendInfoSocketLeave() {
            const receiverId = this.currentTeam.owner
            socketioService.socket.emit("sendInfo", {
                receiverId,
                teamInviteSend: false,
                isInTeam: false,
                leaver: this.thisCurrentUser._id
            })   
        },

        getInfoSocket() {
            socketioService.socket.on("getInfo", (data) => {
                if (data.newPlayer !== undefined) {
                    if (data.newPlayer == this.newPlayer) {
                        this.$nextTick(function () {
                            this.newPlayer = undefined
                    this.$nextTick(function () {
                    this.newPlayer = data.newPlayer
                })
                })
                    }
                    this.newPlayer = data.newPlayer
                    console.log(this.newPlayer);
                }
                if (data.leaver !== undefined) { 
                    if (data.leaver == this.leaver) {
                        this.$nextTick(function () {
                            this.leaver = undefined
                    this.$nextTick(function () {
                    this.leaver = data.leaver
                })
                })
                    }
                    this.leaver = data.leaver
                console.log(this.leaver);
            }
            })
        },

        goToYourTeam() {
            this.$router.push({name:'myTeam', params: {id: this.thisCurrentUser.team[0]}});
        },
        reloadPage() {
      window.location.reload();
        },
    log(message) {
            console.log(message);
        },
    },
    mounted() {
        this.getOneUser(this.currentUser._id) 
        this.getInfoSocket()
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

.wrapper{
   max-width: 400px;
  margin:auto 
}

.add_txt{
  text-align: center;
  margin-bottom: 1em;
}
.after_txt{
  text-align: center;
  margin-bottom: 1em;
}
.team-settings{
    text-align: center;
}

.btn.btn-success{
  text-align: center;
  margin-top: 1em;
}
.btn.btn-warning{
  text-align: center;
  margin-top: 1em;
}

</style>