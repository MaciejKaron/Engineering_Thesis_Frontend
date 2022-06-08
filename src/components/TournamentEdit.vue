<template>
    <div v-if="currentTournament" class="edit-form">
    <h4>Tournament</h4>
    <form>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title"
          v-model="currentTournament.title"
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description"
          v-model="currentTournament.description"
        />
      </div>
      <div class="form-group">
        <label><strong>Status:</strong></label>
        {{ currentTournament.published ? "Published" : "Pending" }}
      </div>
    </form>
    <button class="badge badge-primary mr-2"
      v-if="currentTournament.published"
      @click="updateToPublished(false)"
    >
      UnPublish
    </button>
    <button v-else class="badge badge-primary mr-2"
      @click="updateToPublished(true)"
    >
      Publish
    </button>
    <button class="badge badge-danger mr-2"
      @click="deleteThisTournament"
    >
      Delete
    </button>
    <button type="submit" class="badge badge-success"
      @click="updateThisTournament"
    >
      Update
    </button>
    <p>{{ message }}</p>
  </div>
  <div v-else>
    <br />
    <p>Please click on a Tutorial...</p>
  </div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
export default {
    name: "TournamentEdit-comp",
    data() {
        return {
            currentTournament: null,
            message: ""
        }
    },
    methods: {
        getOneTournament(id) {
            tournamentService.findOneTournament(id)
                .then(response => {
                    this.currentTournament = response.data
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        updateToPublished(status) {
            var data = {
                id: this.currentTournament._id,
                title: this.currentTournament.title,
                description: this.currentTournament.description,
                published: status
            }
            tournamentService.updateTournament(this.currentTournament._id, data)
                .then(response => {
                    this.currentTournament.published = status
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        updateThisTournament() {
            tournamentService.updateTournament(this.currentTournament._id, this.currentTournament)
                .then(response => {
                    console.log(response.data)
                this.message = "Tournament was updated successfully!"
                })
                .catch(e => {
                console.log(e)
            })
        },
        deleteThisTournament() {
            tournamentService.deleteTournament(this.currentTournament._id)
                .then(response => {
                    console.log(response.data)
                    this.$router.push({ name:"home"})
                })
                .catch(e => {
                console.log(e)
            })
        }
    },
    mounted() {
        this.message = ""
        this.getOneTournament(this.$route.params.id)
    }
}
</script>

<style scoped>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>