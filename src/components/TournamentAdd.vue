<template>
    <div class="submit-form">
        <div v-if="!submitted">
        <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" required v-model="tournament.title" name="title" />
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <input type="text" class="form-control" id="description" required v-model="tournament.description" name="description" />
        </div>
        <button @click="saveTournament" class="btn btn-success">Submit</button>
        </div>
        <div v-else>
            <h4>You submitted successfully!</h4>
            <button class="btn btn-success" @click="newTournament">Add</button>
        </div>
    </div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
export default {
    name: "TournamentAdd-comp",
    data() {
        return {
            tournament: {
                id: null,
                title: "",
                description: "",
                published: false
            },
            submitted: false
        }
    },
    methods: {
        saveTournament() {
            var data = {
                title: this.tournament.title,
                description: this.tournament.description
            }
            tournamentService.createTournament(data)
                .then(response => {
                    this.tournament.id = response.data.id
                    console.log(response.data)
                    this.submitted = true
                })
                .catch(e => {
                console.log(e)
            })
        },
        newTournament() {
            this.submitted = false
            this.tournament = {}
        }
    }
}
</script>

<style scoped>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>