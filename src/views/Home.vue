<template>
<div class="main">
    <div class="tournament-searcher">
        <div class="input-tournament inline">
        <input type="text" class="form-control input-tournament-name" placeholder="Search by title" v-model="searchTitle" />
        </div>
        <div class="input-button inline">
        <button class="btn btn-outline-dark" type="button" @click="filteredTitle">Search</button>
    </div>
        <div class="tournament-pagination inline">
            Items per Page:
            <select class="select-item" v-model="pageSize" @change="handlePageSizeChange($event)">
            <option class="selected-item" v-for="size in pageSizes" :key="size" :value="size"> {{ size }}</option>
            </select>
        <div class="pagination-box inline">
          <div class="pagination-container inline">
            <div class="pagination-wrapper inline">
                <button class="pagination-button" @click="previousPage();"><font-awesome-icon icon="arrow-left" /></button>
            </div>
            <div class="pagination-wrapper inline">
                <button class="pagination-button" @click="nextPage();"><font-awesome-icon icon="arrow-right" /></button>
            </div>
          </div>  
        </div>
    </div>
    </div>
    <div class="row main-row">
            <div class="col-sm-3 startTime">
                Start Time 
            </div>
            <div class="col-sm-3 title">
                Title
            </div>
            <div class="col-sm-3 mode">
                Mode
            </div>
            <div class="col-sm-3 premium">
                Premium
            </div>
        </div>
    <div class="tournament-list" 
        :class="{ active: index == currentIndex && isActive}"
        v-for="(tournament,index) in tournaments"
        :key="index"
        @click="setActiveTournament(tournament,index)">
        <div class="row main-row h-100 justify-content-center align-items-center">
            <div class="col-sm-3 startTime">
                {{displayDate(tournament.startTime)}} 
            </div>
            <div class="col-sm-3 title">
                {{tournament.title}}
            </div>
            <div class="col-sm-3 mode">
                {{tournament.mode}}
            </div>
            <div class="col-sm-3 premium">
                {{tournament.premium ? "Premium" : "Free"}}
            </div>
            <transition name="selected-transition">
            <div class="tournament-extend" v-if="currentIndex == index && isActive">
                <div class="tournament-description">
                    Description: {{tournament.description}}
                </div>
                <div class="tournament-players" v-if="currentTournament.mode == '1v1'">
                    <font-awesome-icon icon="people-group" />   Players: {{tournament.players.length}} / 32
                </div>
                <div class="tournament-teams" v-if="currentTournament.mode == '5v5'">
                    <font-awesome-icon icon="people-group" />   Teams: {{tournament.teams.length}} / 8
                </div>
            <div class="row selected-row justify-content-center align-items-center" v-if="currentIndex == index && isActive">
                <div class="1v1" v-if="currentTournament.mode == '1v1'">
                    <button class="join-button" v-if="!currentTournament.players.includes(thisCurrentUser._id)" @click="joinUserToTournament()"><span>JOIN SOLO</span></button>
                    <button class="leave-button" v-if="currentTournament.players.includes(thisCurrentUser._id)" @click="rejoinUserFromTournament()">LEAVE</button>
                </div>
                <div class="5v5" v-if="currentTournament.mode == '5v5'">
                    <button class="join-button" v-if="!currentTournament.teams.includes(thisCurrentUser.team.toString())" @click="joinTeamToTournament()">JOIN WITH TEAM</button>
                    <button class="leave-button" v-if="currentTournament.teams.includes(thisCurrentUser.team.toString())" @click="rejoinTeamFromTournament()">LEAVE</button>
                </div>
            </div>
            </div>
            </transition>
        </div>

    </div>
</div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
import userService from "@/services/user.service";
import moment from "moment"
// import image from "../assets/background.jpg"

export default {
    name: "Home-comp",
    data() {
        return {
            tournaments: [],
            currentTournament: null,
            currentIndex: -1,
            pageSize: 5,
            pageSizes: [5, 10, 15, 20],
            tournamentsPaginated: [],
            searchTitle: "",
            currentPage: 0,
            totalPages: null,
            totalItems: null,
            thisCurrentUser: null,  
            isActive: false,   
        }
    },
    methods: {
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
            this.isActive = !this.isActive
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
        joinUserToTournament() {
            tournamentService.addUserToTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                    console.log(response.data)
                this.refreshList()
                })
                .catch(e => {
                console.log(e)
            })
        },

        rejoinUserFromTournament() {
            tournamentService.leaveUserFromTournament(this.currentTournament._id, this.currentUser)
                .then(response => {
                    console.log(response.data)
            this.refreshList()
                })  
                .catch(e => {
            console.log(e)
          })
        },

        joinTeamToTournament() {
            var data = {
                _id: this.thisCurrentUser._id.toString()
            }
            tournamentService.addTeamToTournament(this.currentTournament._id, data)
                .then(response => {
                    console.log(response.data);
            this.refreshList()
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
            this.refreshList()
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
        showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }
      return false;
    },
    },
    created() {
        // var test = document.body;
        // test.style.backgroundImage = `url(${image})`
        // test.style.backgroundPosition = "center"

        document.body.style.backgroundColor = "#303033"
  },
}
</script>

<style scoped>
/* .list {
  text-align: left;
  max-width: 750px;
  margin: auto;
} */


.main{
    width: 60em;
    /* margin top,right,bottom,left */
    margin-top: 6em;
    margin-right: auto;
    margin-bottom: 0;
    margin-left: auto;
    color: white;
    font-family: roboto;
}

.tournament-list{
    height: 6em;
    cursor: pointer;
    transition: all 300ms ease-in-out;
    border-bottom: 2px solid #c3073f;
    background-color: #1a1a1d;
    margin-bottom: 0.2em;
}

.main-row{
    text-align: center;
}

/* .selected{
    background-color: rgb(56, 56, 56);
} */
/* #c3073f #950740 #6f2232 */
.active{
    background-color: #1a1a1d;
    border: 1px solid #6f2232;
    -webkit-box-shadow:0px 1px 1px #950740;
    -moz-box-shadow:0px 1px 1px #950740;
    box-shadow:6px 6px 6px #c3073f;
    height: 8em;
}

.selected-transition-enter-from
.selected-transition-leave-to{
    transform: translateY(20px);
    opacity: 0;
}

selected-transition-enter-active
.selected-transition-leave-active{
    transition: all 0.5s ease-out;
}

.join-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.join-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.leave-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.leave-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.tournament-searcher{
    margin-bottom: 1em;  
    width: 100%;
}
.input-tournament-name{
    background-color: #1a1a1d;
    color: white;
    border-color: #6f2232;
}
::placeholder{
    color: white;
}
.btn-outline-dark{
    color: white;
    border-color:#6f2232;
    background-color: #1a1a1d;
    margin-left: 1em;
}
 .inline{
    display: inline-block;
 }

 .tournament-pagination{
    float: right;
 }

 .pagination-button{
    border-radius: 100%;
    color: white;
    background-color: #1a1a1d;
    border-color: #6f2232;
    margin-left: 1em;
 }

 .select-item{
    border-radius: 25%;
    color: white;
    background-color: #1a1a1d;
    border-color: #6f2232;
 }

.tournament-extend{
    width: 90%;
}

 .tournament-description{
    max-width: 60%;
    float: left;
 }

 .tournament-players{
    text-align: center;
    display: inline-block;
 }

 .tournament-teams{
    text-align: center;
    display: inline-block;
 }

 .selected-row{
    float: right;
 }

</style>