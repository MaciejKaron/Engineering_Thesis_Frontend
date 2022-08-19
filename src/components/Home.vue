<template>
<div class="list row">
    <div class="col-md-8">
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Search by title" v-model="searchTitle" />
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="filteredTitle">Search</button>
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <div class="mb-3">
            Items per Page:
            <select v-model="pageSize" @change="handlePageSizeChange($event)">
            <option v-for="size in pageSizes" :key="size" :value="size"> {{ size }}</option>
            </select>
        </div>
        <div class="pagination-box">
          <div class="pagination-container">
      <div class="pagination-wrapper">
        <button class="pagination-button" @click="previousPage();">Previous</button>
      </div>
      <div class="pagination-wrapper">
        <button class="pagination-button" @click="nextPage();">Next</button>
      </div>
    </div>  
        </div>
        <p class="mt-3">Current Page: {{ currentPage }}</p>
        <p class="mt-3">Current title: {{ searchTitle }}</p>
        <p class="mt-3">Current Size: {{ pageSize }}</p>
        <p class="mt-3">Current Count: {{ totalItems }}</p>
    </div>
    <div class="col-md-6">
        <h4>Tournaments List</h4>
        <ul class="list-group" id="Home-comp">
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
            <label><strong>Mode:</strong></label> {{currentTournament.mode}}
        </div>
        <div>
            <label><strong>Status:</strong></label> {{currentTournament.published}}
        </div>
        <div>
            <label><strong>Premium:</strong></label> {{currentTournament.premium}}
        </div>
        <div v-if="currentTournament.mode == '1v1'">
            <label><strong>Players:</strong></label> {{currentTournament.players}}
        </div>
        <div v-if="currentTournament.mode == '5v5'">
            <label><strong>Teams:</strong></label> {{currentTournament.teams}}
        </div>
        <div>
            <label><strong>Start Time:</strong></label> {{displayDate(currentTournament.startTime)}} 
        </div>
        <div class="1v1" v-if="currentTournament.mode == '1v1'">
            <a class="badge badge-warning" :href="'tournament/edit/' + currentTournament._id">Edit</a>
            <button class="join_button" @click="joinUserToTournament()">JOIN</button>
            <button class="leave_button" @click="rejoinUserFromTournament()">LEAVE</button>
        </div>
        <div class="5v5" v-if="currentTournament.mode == '5v5'">
            <a class="badge badge-warning" :href="'tournament/edit/' + currentTournament._id">Edit</a>
            <button class="join_button" @click="joinTeamToTournament()">JOIN</button>
            <button class="leave_button" @click="rejoinTeamFromTournament()">LEAVE</button>
        </div>
        </div>
        <div>
            <br />
            <p>Please click on a Tournament...</p>
        </div>
    </div>
</div>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>
<p>elo</p>

</template>

<script>
import tournamentService from "@/services/tournament.service";
import userService from "@/services/user.service";
import moment from "moment"

export default {
    name: "Home-comp",
    data() {
        return {
            tournaments: [],
            currentTournament: null,
            currentIndex: -1,
            pageSize: 3,
            pageSizes: [3, 6, 9, 12],
            tournamentsPaginated: [],
            searchTitle: "",
            currentPage: 0,
            totalPages: null,
            totalItems: null,
            thisCurrentUser: null,     
        }
    },
    methods: {
        getAllTournaments() {
            tournamentService.findAllTournaments(this.currentPage,this.searchTitle, this.pageSize)
                .then((response) => {
                    this.tournamentsPaginated = response.data
                    console.log(response.data)
                    this.totalPages = this.tournamentsPaginated.totalPages
                    this.tournaments = this.tournamentsPaginated.tournaments
                    this.totalItems = this.tournamentsPaginated.totalItems
                })
                .catch(e => {
                console.log(e)
            })
        },
        getAllPublishedTournaments() {
            tournamentService.findAllPublishedTournaments(this.currentPage,this.searchTitle, this.pageSize)
                .then((response) => {
            this.tournamentsPaginated = response.data
                    // console.log(response.data)
                    this.totalPages = this.tournamentsPaginated.totalPages
                    this.tournaments = this.tournamentsPaginated.tournaments
                    this.totalItems = this.tournamentsPaginated.totalItems
                })
                .catch(e => {
            console.log(e)
          })  
        },
        nextPage() {
            if (!(this.currentPage === this.totalPages - 1)) {
                this.currentPage++
                this.getAllPublishedTournaments()
            }
        },
         previousPage() {
            if (!(this.currentPage === 0)) {
                this.currentPage--
                this.getAllPublishedTournaments()
            }
        },
        filteredTitle() {
            this.currentPage = 0
            this.getAllPublishedTournaments()
        },
        handlePageSizeChange(event) {
            this.pageSize = event.target.value
            this.page = 0
            this.getAllPublishedTournaments()
        },

        refreshList() {
            this.getAllPublishedTournaments()
            this.currentTournament = null
            this.currentIndex = -1
        },
        setActiveTournament(tournament, index) {
            this.currentTournament = tournament
            this.currentIndex = index
        },
        removeAllTournaments() {
            tournamentService.deleteAllTournaments()
                .then((response) => {
                    console.log(response.data)
                this.refreshList()
                })
                .catch(e => {
                console.log(e)
            })
        },
        searchByTitle() {
            tournamentService.findTournamentByTitle(this.searchTitle)
                .then(response => {
                    this.tournaments = response.data
                    console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        joinUserToTournament() {
            tournamentService.addUserToTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                    console.log(response.data)
                this.reloadPage()
                })
                .catch(e => {
                console.log(e)
            })
        },

        rejoinUserFromTournament() {
            tournamentService.leaveUserFromTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                    console.log(response.data)
            this.reloadPage()
                })  
                .catch(e => {
            console.log(e)
          })
        },

        joinTeamToTournament() {
            var data = {
                _id: this.thisCurrentUser.team.toString()
            }
            tournamentService.addTeamToTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data);
            this.reloadPage()
                })  
          .catch(e => {
            console.log(e)
          })
        },

        rejoinTeamFromTournament() {
            var data = {
                _id: this.thisCurrentUser.team.toString()
            }
            tournamentService.leaveTeamFromTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data);
            this.reloadPage()
                })  
          .catch(e => {
            console.log(e)
          })
        },

        getOneUser(id) {
            userService.findOneUser(id)
                .then(response => {
                    this.thisCurrentUser = response.data
                // console.log(response.data)
                })
                .catch(e => {
                console.log(e)
            })
        },
        displayDate(value) {
            if (value) {
                 return moment(String(value)).format('MM/DD/YYYY hh:mm a')
            }
        },
        log(message) {
            console.log(message)
        },
        reloadPage() {
      window.location.reload();
        },
    },
    mounted() {
        this.getAllPublishedTournaments()
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
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>