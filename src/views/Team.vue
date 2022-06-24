<template>
    <div class="wrapper">
        <div class="add_form">
            <div class="add_txt">
                <h2 v-if="thisUser.isInTeam == false">Create your team!</h2>
                {{thisUser.team}}
                {{thisUser.isInTeam}}
            </div>
            <div class="submit-form">
                <div v-if="thisUser.isInTeam == false">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" required v-model="team.name" name="name" />
                </div>
                <div class="form-group">
                    <label for="tag">Tag</label>
                    <input type="text" class="form-control" id="tag" required v-model="team.tag" name="tag" />
                </div>
                <button @click="saveTeam" class="btn btn-success">Submit</button>
                </div>
                <div class="after_txt" v-else>
                <h4>Team already created!</h4>
                <button class="btn btn-success" @click="goToYourTeam">Team settings</button>
                <button class="btn btn-warning" @click="deleteTeam">Delete your team</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import teamService from "@/services/team.service"
import userService from "@/services/user.service"
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
            thisUser: [],
            currentTeam: [],
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

            teamService.findOneTeam(response.data._id)
                .then(response => {
                    this.currentTeam = response.data
                    console.log(response.data)
                    })
                    .catch(e => {
                    console.log(e)
                })
                
                })
                .catch(e => {
                console.log(e)
                })
            // this.reloadPage()
        },
        newTeam() {
            this.submitted = false
            this.team = {}
        },
        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisUser = response.data
                    this.team.owner = this.thisUser._id
                console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
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
        deleteTeam() {
            teamService.deleteTeam(this.thisUser.team)
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
        goToYourTeam() {
            this.$router.push({name:'myTeam', params: {id: this.thisUser.team[0]}});
        },
        reloadPage() {
      window.location.reload();
    }
    },
    mounted() {
        this.getOneUser(this.currentUser._id) 
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

.btn.btn-success{
  text-align: center;
  margin-top: 1em;
}
.btn.btn-warning{
  text-align: center;
  margin-top: 1em;
}

</style>