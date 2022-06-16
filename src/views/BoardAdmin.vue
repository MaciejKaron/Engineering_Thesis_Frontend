<template>
<div class="welcome">
  <h1>ADMIN PANEL</h1>
</div>
<div class="wrapper">

<div class="add_form">
<div class="add_txt">
  <h2>Add Tournament</h2>
</div>
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
         <div class="form-group">
            <label for="mode">Mode</label>
            <select v-model="tournament.mode" @change="handleMode($event)">
            <option v-for="m in modes" :key="m" :value="m">{{m}}</option>
            </select>
        </div>
        <div class="form-group">
            <label for="published">Publish?</label>
            <input type="checkbox" v-model="tournament.published" @change="handlePublished($event)"/>
        </div>
        <div class="form-group">
            <label for="premium">Premium?</label>
            <input type="checkbox" v-model="tournament.premium" @change="handlePremium($event)"/>
        </div>
         <div class="form-group">
            <label for="startTime">Start time</label>
          <Datepicker v-model="tournament.startTime" @change="handleDate($event)" />
        </div>
        <button @click="saveTournament" class="btn btn-success">Submit</button>
        </div>
        <div class="after_txt" v-else>
            <h4>You submitted successfully!</h4>
            <button class="btn btn-success" @click="newTournament">Add next</button>
        </div>
    </div>
    </div>

    <div class="list row">
    <div class="col-md-6">
      <div class="search_txt">
  <h2>Search Tournament</h2>
</div>
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
    <div class="print">
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
        <div>
            <label><strong>Players:</strong></label> {{currentTournament.players}}
        </div>
        <div>
            <label><strong>Start Time:</strong></label> {{currentTournament.startTime}}
        </div>
        
        <a class="badge badge-warning" :href="'tournament/edit/' + currentTournament._id">Edit</a>
        <button class="join_button" @click="joinUserToTournament">JOIN</button>
        </div>
        <div>
            <br />
            <p>Please click on a Tournament...</p>
        </div>
    </div>
    </div>
</div>

</div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
import userService from "@/services/user.service";
export default {
    name: "BoardAdmin-comp",
    data() {
        return {
            tournament: {
                id: null,
                title: "",
                description: "",
                published: false,
                premium: false,
                startTime: "",
                mode: "",
            players: [],    
            },
          submitted: false,
          modes: ["1v1", "2v2", "5v5"],
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
            thisUser: null, 
        }
    },
    methods: {
        saveTournament() {
            var data = {
                title: this.tournament.title,
                description: this.tournament.description,
              published: this.tournament.published,
                mode: this.tournament.mode,
                premium: this.tournament.premium,
              startTime: this.tournament.startTime,
                players: this.tournament.players
            }
            tournamentService.createTournament(data)
                .then(response => {
                    this.tournament.id = response.data.id
                    console.log(response.data)
                    this.submitted = true
                    this.refreshList()
                })
                .catch(e => {
                console.log(e)
            })
        },
        newTournament() {
            this.submitted = false
            this.tournament = {}
      },
      handleMode(event) {
          this.mode = event.target.value
      },

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
        nextPage() {
            if (!(this.currentPage === this.totalPages - 1)) {
                this.currentPage++
                this.getAllTournaments()
            }
        },
         previousPage() {
            if (!(this.currentPage === 0)) {
                this.currentPage--
                this.getAllTournaments()
            }
        },
        filteredTitle() {
            this.currentPage = 0
            this.getAllTournaments()
        },
        handlePageSizeChange(event) {
            this.pageSize = event.target.value
            this.page = 0
            this.getAllTournaments()
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
                })
                .catch(e => {
                console.log(e)
            })
        },

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
        handlePublished(event) {
            if (event.target.checked) {
            this.published = event.target.checked
            } else {
            this.published = event.target.checked
          }  
        },
         handlePremium(event) {
             if (event.target.checked) {
            this.premium = event.target.checked
             } else {
            this.premium = event.target.checked
    }
        },
        handleDate(event) {
            this.startTime = event.target.value
            console.log(event.target.value)
     console.log(this.startTime)
  },
     
    },
    mounted() {
        this.getAllTournaments()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
        }
    },
}
</script>
<style scoped>

.welcome{
  max-width: 300px;
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
.wrapper{
   max-width: fit-content;
    overflow: hidden;
}
.add_form{
  max-width: 30em;
    float:left; 
    margin-left: 2em;
    margin-right: 3em;
    
}

.list {
  max-width: 70em;
    float: left; 
}

.search_txt{
  margin-bottom: 3em;
}

.input-group.mb-3{
 max-width: 20em;
}

.list-group{
  max-width: 20em;
}

.print{
  max-width: 30em;
}
</style>