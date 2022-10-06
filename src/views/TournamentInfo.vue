<template>
    <h3 class="tournament-title" style="text-align: center; color: white">
    {{currentTournament.title}}
    </h3>

    <div class="tournament1v1" v-if="currentTournament.mode == '1v1'">
        <div class="first-bracket">
            <h4 class="title">Round 1</h4>
            <div class="first-players-list" 
                :class="{ active: index == currentIndex}"
                 v-for="(player,index) in currentTournamentPlayers.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveUser(player, index)">
                <div class="players">
                    <div class="player-country">
                        <country-flag :country=player.faceitCountry size='small'/>
                    </div>
                    <div class="player-image">
                        <img class="player-avatar" :src="player.faceitAvatar" />
                    </div>
                    <div class="player-username">
                        {{player.username}}
                    </div>
                    <div class="player-level">
                        {{player.faceitLevel}}
                    </div>
                    <div class="player-setting" v-if="(thisPlayer._id == player._id) && (showAdminBoard || showModeratorBoard)">
                        <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage2.includes(thisPlayer._id)"><font-awesome-icon icon="wrench" /></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="second-bracket">
            <h4 class="title">Round 2</h4>
            <div class="second-players-list" 
                :class="{ active: index == currentIndex}"
                 v-for="(player,index) in stage2Players.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveUser(player, index)">
                <div class="players-second-bracket">
                    <div class="player-country">
                        <country-flag :country=player.faceitCountry size='small'/>
                    </div>
                    <div class="player-image">
                        <img class="player-avatar" :src="player.faceitAvatar" />
                    </div>
                    <div class="player-username">
                        {{player.username}}
                    </div>
                    <div class="player-level">
                        {{player.faceitLevel}}
                    </div>
                    <div class="player-setting" v-if="(thisPlayer._id == player._id) && (showAdminBoard || showModeratorBoard)">
                        <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage3.includes(thisPlayer._id)"><font-awesome-icon icon="wrench" /></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="third-bracket">
            <h4 class="title">Round 3</h4>
            <div class="second-players-list" 
                :class="{ active: index == currentIndex}"
                 v-for="(player,index) in stage3Players.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveUser(player, index)">
                <div class="players-third-bracket">
                    <div class="player-country">
                        <country-flag :country=player.faceitCountry size='small'/>
                    </div>
                    <div class="player-image">
                        <img class="player-avatar" :src="player.faceitAvatar" />
                    </div>
                    <div class="player-username">
                        {{player.username}}
                    </div>
                    <div class="player-level">
                        {{player.faceitLevel}}
                    </div>
                    <div class="player-setting" v-if="(thisPlayer._id == player._id) && (showAdminBoard || showModeratorBoard)">
                        <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage4.includes(thisPlayer._id)"><font-awesome-icon icon="wrench" /></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="fourth-bracket">
            <h4 class="title">Round 4</h4>
            <div class="second-players-list" 
                :class="{ active: index == currentIndex}"
                 v-for="(player,index) in stage4Players.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveUser(player, index)">
                <div class="players-fourth-bracket">
                    <div class="player-country">
                        <country-flag :country=player.faceitCountry size='small'/>
                    </div>
                    <div class="player-image">
                        <img class="player-avatar" :src="player.faceitAvatar" />
                    </div>
                    <div class="player-username">
                        {{player.username}}
                    </div>
                    <div class="player-level">
                        {{player.faceitLevel}}
                    </div>
                    <div class="player-setting" v-if="(thisPlayer._id == player._id) && (showAdminBoard || showModeratorBoard)">
                        <button @click="showPopup()" class="match-options-button" v-if="!currentTournament.stage.stage5.includes(thisPlayer._id)"><font-awesome-icon icon="wrench" /></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="fiveth-bracket">
            <h4 class="title">Round 5</h4>
            <div class="second-players-list" 
                :class="{ active: index == currentIndex}"
                 v-for="(player,index) in stage5Players.sort((a, b) => (a._id > b._id) ? 1 : -1)" 
                :key="index"
                @click="setActiveUser(player, index)">
                <div class="players-fiveth-bracket">
                    <div class="player-country">
                        <country-flag :country=player.faceitCountry size='small'/>
                    </div>
                    <div class="player-image">
                        <img class="player-avatar" :src="player.faceitAvatar" />
                    </div>
                    <div class="player-username">
                        {{player.username}}
                    </div>
                    <div class="player-level">
                        {{player.faceitLevel}}
                    </div>
                    <div class="player-setting" v-if="(thisPlayer._id == player._id) && (showAdminBoard || showModeratorBoard)">
                        <button @click="showPopup()" class="match-options-button"><font-awesome-icon icon="wrench" /></button>
                    </div>
                </div>
            </div>
        </div>
        <Popup
                    v-if="isPopupVisible"
                    @close="closePopup()"
                    >
                    <template v-slot:header>
                       
                    </template>

                    <template v-slot:body>
                        <p id="popup-player"><strong>{{thisPlayer.username}}</strong></p>
                        <div class="form-group">
                            <label for="isWin">Win:</label>
                            <input id="match-checkbox" type="checkbox" v-model="match.isWin" @change="handleWin($event)"/>
                        </div>
                        <div class="form-group">
                            <label for="opponent">Opponent:</label>
                            <select id="match-opponent" v-model="match.opponent" @change="handleOpponent($event)">
                            <option v-for="o in currentTournamentPlayers" :key="o" :value="o">{{o.username}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="kills">Kills:</label>
                            <input type="text" class="form-control" id="match-kills" required v-model="match.playerStats.kills" name="kills" />
                        </div>
                        <div class="form-group">
                            <label for="death">Deaths:</label>
                            <input type="text" class="form-control" id="match-deaths" required v-model="match.playerStats.deaths" name="deaths" />
                        </div>
                        <div class="form-group">
                            <label for="map">Map:</label>
                            <select id="match-map" v-model="match.map" @change="handleMap($event)">
                            <option v-for="m in mapPool" :key="m" :value="m">{{m}}</option>
                            </select>
                        </div>
                        <button @click="kickUserFromTournament(); closePopup()" class="match-options-button kick">Kick</button>
                        <button @click="goToStage2(); closePopup()" class="match-options-button" v-if="!currentTournament.stage.stage2.includes(thisPlayer._id) && !currentTournament.stage.stage3.includes(thisPlayer._id) && !currentTournament.stage.stage4.includes(thisPlayer._id) && !currentTournament.stage.stage5.includes(thisPlayer._id)">Submit</button>
                        <button @click="goToStage3(); closePopup()" class="match-options-button" v-if="currentTournament.stage.stage2.includes(thisPlayer._id) && !currentTournament.stage.stage3.includes(thisPlayer._id) && !currentTournament.stage.stage4.includes(thisPlayer._id) && !currentTournament.stage.stage5.includes(thisPlayer._id)">Submit</button>
                        <button @click="goToStage4(); closePopup()" class="match-options-button" v-if="currentTournament.stage.stage3.includes(thisPlayer._id) && !currentTournament.stage.stage4.includes(thisPlayer._id) && !currentTournament.stage.stage5.includes(thisPlayer._id)">Submit</button>
                        <button @click="goToStage5(); closePopup()" class="match-options-button" v-if="currentTournament.stage.stage4.includes(thisPlayer._id) && !currentTournament.stage.stage5.includes(thisPlayer._id)">Submit</button>
                    </template>

                    <template v-slot:footer>
                    <!-- This is a new modal footer. -->
                    </template>
                </Popup>
    </div>
    <div class="matchHistory" v-for="(match,index) in matchHistory" :key="index">
        <div class="match-info">
                    {{index + 1}}. {{match.player}} {{match.isWin ? "Win" : "Lose"}} with {{match.opponent}} | Stats: Kills:{{match.playerStats.kills}} Deaths:{{match.playerStats.deaths}} | Map: {{match.map}}
        </div>
    </div>
</template>

<script>
import tournamentService from "@/services/tournament.service";
import userService from '@/services/user.service';
import Popup from "@/components/Popup.vue";
import matchService from '@/services/match.service';
export default {
    name: "TournamentInfo-comp",
    components: {
    Popup,
},
    data() {
        return {
            currentTournament: [],
            currentTournamentPlayers: [],
            stage2Players: [],
            stage3Players: [],
            stage4Players: [],
            stage5Players: [],
            thisUser: null,
            currentIndex: -1,
            thisPlayer: [],
            isPopupVisible: false,
            match: {
                tournamentId: null,
                player: null,
                opponent: null,
                playerStats: {
                    kills: "",
                    deaths: "",
                },
                map: "",
                isWin: false,
            },
            mapPool: ["de_dust2", "de_nuke", "de_mirage", "de_ancient", "de_inferno", "de_overpass", "de_train", "de_vertigo"],
            matchHistory: []
        }
    },
    methods: {
        getOneTournament(id) {
            tournamentService.findOneTournament(id)
                .then(response => {
                    this.currentTournament = response.data
                    // console.log(response.data)
                    this.getPlayersInfos()
                })
                .catch(e => {
                console.log(e)
            })
        },

        getPlayersInfos() {
            for (let i = 0; i < this.currentTournament.players.length; i++){
                userService.findOneUser(this.currentTournament.players[i])
                    .then(response => {
                        const { _id = response.data._id, username = response.data.username, faceitAvatar = response.data.faceitAvatar, faceitCountry = response.data.faceitCountry, faceitLevel = response.data.faceitLevel } = response.data
                        this.currentTournamentPlayers.push({ _id, username, faceitAvatar, faceitCountry, faceitLevel });
                    })
            }
            // console.log(this.currentTournamentPlayers);

            for (let i = 0; i < this.currentTournament.stage.stage2.length; i++){
                userService.findOneUser(this.currentTournament.stage.stage2[i])
                    .then(response => {
                        const { _id = response.data._id, username = response.data.username, faceitAvatar = response.data.faceitAvatar, faceitCountry = response.data.faceitCountry, faceitLevel = response.data.faceitLevel } = response.data
                        this.stage2Players.push({ _id, username, faceitAvatar, faceitCountry, faceitLevel });
                })
            }
            // console.log(this.stage2Players);

            for (let i = 0; i < this.currentTournament.stage.stage3.length; i++){
                userService.findOneUser(this.currentTournament.stage.stage2[i])
                    .then(response => {
                        const { _id = response.data._id, username = response.data.username, faceitAvatar = response.data.faceitAvatar, faceitCountry = response.data.faceitCountry, faceitLevel = response.data.faceitLevel } = response.data
                        this.stage3Players.push({ _id, username, faceitAvatar, faceitCountry, faceitLevel });
                })
            }
            // console.log(this.stage3Players);

            for (let i = 0; i < this.currentTournament.stage.stage4.length; i++){
                userService.findOneUser(this.currentTournament.stage.stage2[i])
                    .then(response => {
                        const { _id = response.data._id, username = response.data.username, faceitAvatar = response.data.faceitAvatar, faceitCountry = response.data.faceitCountry, faceitLevel = response.data.faceitLevel } = response.data
                        this.stage4Players.push({ _id, username, faceitAvatar, faceitCountry, faceitLevel });
                })
            }
            // console.log(this.stage4Players);

            for (let i = 0; i < this.currentTournament.stage.stage5.length; i++){
                userService.findOneUser(this.currentTournament.stage.stage2[i])
                    .then(response => {
                        const { _id = response.data._id, username = response.data.username, faceitAvatar = response.data.faceitAvatar, faceitCountry = response.data.faceitCountry, faceitLevel = response.data.faceitLevel } = response.data
                        this.stage5Players.push({ _id, username, faceitAvatar, faceitCountry, faceitLevel });
                })
            }
            // console.log(this.stage5Players);
        },

        findOneUserByUsername(username) {
            userService.findOneUserByUsername(username)
                .then(response => {
                this.thisPlayer = response.data;
                // console.log(this.thisPlayer);
            });
        },

        setActiveUser(player, index) {
            this.thisUser = player;
            this.currentIndex = index;
            this.findOneUserByUsername(this.thisUser.username)
            // console.log(this.thisUser);
        },
        showPopup() {
          this.isPopupVisible = true
      },
      closePopup() {
          this.isPopupVisible = false
          this.thisPlayer = []
        },

        kickUserFromTournament() {
            var data = {
                _id: this.thisPlayer._id
            }
            tournamentService.leaveUserFromTournament(this.$route.params.id, data)
                .then(response => {
                    console.log(response.data);
                    this.currentTournamentPlayers = []
                    this.stage2Players = []
                    this.stage3Players = []
                    this.stage4Players = []
                    this.stage5Players = []
                })
                .then(() => {
                            this.getOneTournament(this.$route.params.id) 
                    })
                .catch(e => {
                console.log(e);
            })
        },
        goToStage2() {
            var data = {
                _id: this.thisPlayer._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                tournamentService.goToStage2(this.$route.params.id, data)
                    .then(response => {
                        console.log(response.data);
                        this.currentTournamentPlayers = []
                        this.stage2Players = []
                    })
                    .then(() => {
                        this.getOneTournament(this.$route.params.id)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            } else {
                this.createMatch()
            }
        },

        goToStage3() {
            var data = {
                _id: this.thisPlayer._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                tournamentService.goToStage3(this.$route.params.id, data)
                    .then(response => {
                        console.log(response.data);
                        this.currentTournamentPlayers = []
                        this.stage2Players = []
                        this.stage3Players = []
                    })
                    .then(() => {
                        this.getOneTournament(this.$route.params.id)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }else {
                this.createMatch()
            }
        },

        goToStage4() {
            var data = {
                _id: this.thisPlayer._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                tournamentService.goToStage4(this.$route.params.id, data)
                    .then(response => {
                        console.log(response.data);
                        this.currentTournamentPlayers = []
                        this.stage2Players = []
                        this.stage3Players = []
                        this.stage4Players = []
                    })
                    .then(() => {
                        this.getOneTournament(this.$route.params.id)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }else {
                this.createMatch()
            }
        },

        goToStage5() {
            var data = {
                _id: this.thisPlayer._id
            }
            if (this.match.isWin == true) {
                this.createMatch()
                tournamentService.goToStage5(this.$route.params.id, data)
                    .then(response => {
                        console.log(response.data);
                        this.currentTournamentPlayers = []
                        this.stage2Players = []
                        this.stage3Players = []
                        this.stage4Players = []
                        this.stage5Players = []
                    })
                    .then(() => {
                        this.getOneTournament(this.$route.params.id)
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }else {
                this.createMatch()
            }
        },

        createMatch() {
            var data = {
                tournamentId: this.$route.params.id,
                player: this.thisPlayer._id,
                opponent: this.match.opponent,
                playerStats: this.match.playerStats,
                map: this.match.map,
                isWin: this.match.isWin,
            }
            matchService.createMatch(data)
                .then(response => {
                console.log(response.data);
                })
                .then(() => {
                this.match.tournamentId = null,
                this.match.player = null,
                this.match.opponent = null,
                this.match.playerStats = {},
                this.match.map = "",
                this.match.isWin = false
                })
                .catch(e => {
                console.log(e)
            })
        },
        handleOpponent(event) {
          this.opponent = event.target.value
        },
        handleMap(event) {
          this.map = event.target.value
        },
        handleWin(event) {
             if (event.target.checked) {
            this.isWin = event.target.checked
             } else {
            this.isWin = event.target.checked
    }
        },
        findThisTournamentMatches() {
            matchService.findThisTournamentMatches(this.$route.params.id)
                .then(response => {
                    console.log(response.data);
                    this.matchHistory = response.data
            })
        }
    },
    mounted() {
        this.getOneTournament(this.$route.params.id) 
        this.findThisTournamentMatches()
    },
    computed: {
        currentUser() {
      return this.$store.state.auth.user;
    },
        showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }
      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }
      return false;
    },
    },
    created() {
        
    }
}
</script>

<style scoped>
.tournament1v1{
    height: 38em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: roboto;
}

.first-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    box-shadow: 0px 0px 4px 1px #c3073f;
    overflow: auto;
}

.second-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.third-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.fourth-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d;
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.fiveth-bracket{
    height: 36em;
    width: 16em;
    text-align: center;
    background-color: #1a1a1d; 
    margin-left: 2em;
    box-shadow: 0px 0px 4px 1px #c3073f;
}

.title{
    border-bottom: 1px solid #c3073f;
}

.players{
    margin-top: 0.5em;
    width: 100%;
    display: inline-block;
}

.players-second-bracket{
    margin-top: 1.5em;
    width: 100%;
    display: inline-block;
}

.players-third-bracket{
    margin-top: 4.5em;
    width: 100%;
    display: inline-block;
}

.players-fourth-bracket{
    margin-top: 8.5em;
    width: 100%;
    display: inline-block;
}

.players-fiveth-bracket{
    margin-top: 14em;
    width: 100%;
    display: inline-block;
}

.player-avatar{
    max-width: 2em;
  max-height: 2em;
  border-radius: 66px;
}

.player-country{
    /* display: inline-block; */
    float: left;
}

.player-username{
    /* display: inline-block; */
    float: left;
}

.player-image{
    /* display: inline-block; */
    float: left;
    margin-left: 0.5em;
    margin-right: 0.5em;
}

.player-level{
    /* display: inline-block; */
    float: left;
    margin-left: 1em;
}

.player-setting{
    margin-left: 1.5em;
    /* display: inline-block; */
    float: left;
}

#popup-player{
    color: white;
}

#match-checkbox {
    accent-color: #6f2232;
    margin-left: 2em;
}

#match-opponent{
    margin-left: 0.5em;
    background-color: #222225;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#match-map{
    margin-left: 2em;
    background-color: #222225;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
}

#match-kills{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    max-width: 4em;
    text-align: center;
    display: inline-block;
    margin-left: 2em;
}

#match-deaths{
    background-color: #1a1a1d;
    color: white;
    border: 1px solid;
    border-color: #6f2232;
    max-width: 4em;
    text-align: center;
    display: inline-block;
    margin-left: 1em;
}
label{
    float: left;
}

.match-options-button {
  background-color: #6f2232;
  color: white;
  border: 2px solid #950740;
  border-radius:5px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px #c3073f) drop-shadow(0 0 8px #c3073f) ;
  transition: .5s;
}

.match-options-button:hover {
  color: white;
  background-color: #c3073f;
  filter: drop-shadow(0 0 6px #950740);
}

.kick{
    margin-right: 1em;
}

.match-info{
    color: white;
}
</style>