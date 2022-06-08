<template>
<div class="list row">
    <div class="col-md-8">
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Search by title" v-model="title" />
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="searchByTitle">Search</button>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <h4>Tournaments List</h4>
        <ul class="list-group">
            <li class="list-group-item"
        :class="{ active: index == currentIndex}"
        v-for="(tournament,index) in tournaments"
        :key="index"
        @click="setActiveTournament(tournament,index)" 
        >
        {{ tournament.title}}
        </li>
        </ul>
        <button class="m-3 btn btn-sm btn-danger" @click="removeAllTournaments">Delete all</button>
    </div>
    <div class="col-md-6">
        <div v-if="currentTournament">
        <h4>Tournament</h4>
        <div>
            <label><strong>Title:</strong></label> {{currentTournament.title}}
        </div>
        <div>
            <label><strong>Description:</strong></label> {{currentTournament.description}}
        </div>
        <div>
            <label><strong>Status:</strong></label> {{currentTournament.published}}
        </div>
        <a class="badge badge-warning" :href="'tournament/edit/' + currentTournament._id">Edit</a>
        </div>
        <div>
            <br />
            <p>Please click on a Tournament...</p>
        </div>
    </div>
</div>
</template>

<script>
import tournamentService from "@/services/tournament.service";

export default {
    name: "Home-comp",
    data() {
        return {
            tournaments: [],
            currentTournament: null,
            currentIndex: -1,
            title: ""
        }
    },
    methods: {
        getAllTournaments() {
            tournamentService.findAllTournaments()
                .then(response => {
                    this.tournaments = response.data
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        refreshList() {
            this.getAllTournaments()
            this.currentTournament = null
            this.currentIndex = -1
        },
        setActiveTournament(tournament, index) {
            this.currentTournament = tournament
            this.currentIndex = index
        },
        removeAllTournaments() {
            tournamentService.deleteAllTournaments()
                .then(response => {
                    console.log(response.data)
                this.refreshList()
                })
                .catch(e => {
                console.log(e)
            })
        },
        searchByTitle() {
            tournamentService.findTournamentByTitle(this.title)
                .then(response => {
                    this.tournaments = response.data
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
    },
    mounted() {
        this.getAllTournaments()
    }
}
</script>

<style scoped>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>