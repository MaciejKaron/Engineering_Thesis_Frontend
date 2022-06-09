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
            pageSize: 3,
            pageSizes: [3, 6, 9, 12],
            tournamentsPaginated: [],
            searchTitle: "",
            currentPage: 0,
            totalPages: null,
            totalItems: null     
        }
    },
    methods: {
        // getRequestParams(title, page, pageSize) {
        //     let params = {}
        //     if (title) {
        //         params["title"] = title
        //     }
        //     if (page) {
        //         params["page"] = page -1
        //     }
        //     if (pageSize) {
        //         params["size"] = pageSize
        //     }
        //     return params
        // },
        getAllTournaments() {
            // const params = this.getRequestParams(
            //     this.title,
            //     this.page,
            //     this.pageSize
            // )
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
        // handlePageChange(value) {
        //     this.page = value
        //     this.getAllTournaments()
        // },
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