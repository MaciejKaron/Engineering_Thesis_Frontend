<template>
    <div class="navBar" id="navBar">
        <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a class="navbar-brand">QuickClash</a>
      <div class="navbar-nav mr-auto">
        <li v-if="currentUser" class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" /> Home
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin" class="nav-link">Admin Board</router-link>
        </li>
        <li v-if="showModeratorBoard" class="nav-item">
          <router-link to="/mod" class="nav-link">Moderator Board</router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li> -->
        <li class="nav-item">
          <router-link v-if="currentUser" to="/premium" class="nav-link">Premium</router-link>
        </li>
        <!-- SEARCHBAR -->
        <div class="searchBar">
        <input class="searcher" type="text" id="search" placeholder="Search ..." v-model="searchName" />
        <div class="search-list" v-if="searchName !== ''">
        <div v-if="searchName !== '' && searchUsers.length == 0 ">Nothink found</div>
        <div v-if="searchName !== '' && searchUsers.length > 0">Users:</div>
        <ul>
          <li class="users-list"
              :class="{ active: index == currentIndex}"
              v-for="(user, index) in searchUsers" :key="index"
              @click="setActiveUser(user,index)">
                {{user.username}}
          </li>
        </ul>
        <div v-if="searchName !== '' && searchTeams.length > 0">Teams:</div>
        <ul>
          <li class="teams-list"
              :class="{ active: index == currentIndex}"
              v-for="(team, index) in searchTeams" :key="index"
              @click="setActiveTeam(team,index)">
                {{team.name}}
          </li>
        </ul>
        </div>
        </div>
      </div>
      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>
      <div v-if="currentUser" class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link to="/team" class="nav-link">
          <font-awesome-icon icon="people-group" />
          Team
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/friends" class="nav-link">
         <font-awesome-icon icon="magnifying-glass" />
          Search Friends
        </router-link>
      </li>
      <li class="nav-item" @click="$emit('toggleBar')">
      <div class="nav-link" id="friends">
        <font-awesome-icon icon="handshake" />
        Friends
        </div>
      </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item" @click="$emit('toggleNotifications')">
          <div class="nav-link" id="friends" >
            <font-awesome-icon icon="bell"  :class="{'noNotification': !marker, 'notification': marker}"  />
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>
    </div>
</template>

<script>
import userService from '@/services/user.service';
import teamService from '@/services/team.service';
import socketioService from '@/services/socketio.service';
export default {
    name: "NavBar-comp",
    data() {
        return {
          searchName: "",
          allUsers: [],
          allTeams: [],
          thisUser: null,
          thisTeam: null,
          currentIndex: -1,
          notifications: [],
          marker: false,
        }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    stickyNavbar() {
      window.onscroll = function () { myFunction() }
      var navBar = document.getElementById("navBar")
      var sticky = navBar.offsetTop

      function myFunction() {
        if (window.pageYOffset >= sticky) {
          navBar.classList.add("sticky")
        } else {
          navBar.classList.remove("sticky")
        }
      }
    },
    test() {
      window.addEventListener("scroll", function () {
        var navBar = document.querySelector(".navBar")
        navBar.classList.toggle("sticky", window.scrollY)
      })
    },

    getAllUsers() {
      userService.getAllUsers()
        .then(response => {
          this.allUsers = response.data
        })
      .catch(e => {
            console.log(e)
        })
    },

    getAllTeams() {
      teamService.getAllTeams()
        .then(response => {
        this.allTeams = response.data
        })
      .catch(e => {
            console.log(e)
        })
    },
    setActiveUser(user, index) {
            this.thisUser = user
            this.currentIndex = index
      // console.log(this.thisUser)
      this.goToProfile()
            this.searchName = ""
    },

    goToProfile() {
          this.$router.push({name:'UserProfile', params: {id: this.thisUser._id}});
    },

    setActiveTeam(team, index) {
      this.thisTeam = team
      this.currentIndex = index
      // console.log(this.thisTeam);
      this.goToTeamProfile()
      this.searchName = ""
    },
    goToTeamProfile() {
        this.$router.push({name:'TeamProfile', params: {id: this.thisTeam._id}})
    },

    getNotificationSocket() {
      socketioService.socket.on("getNotification", (data) => {
        this.notifications = []
        this.notifications.push({
          marker: data.marker
        })
        this.marker = data.marker
      })
    },
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
    searchUsers() {
      if (this.searchName === '') {
        return []
      }
      return this.allUsers.filter(user => {
        return user.username.toLowerCase().indexOf(this.searchName.toLowerCase()) != -1
      })
    },
    searchTeams() {
      if (this.searchName === '') {
        return []
      }

      return this.allTeams.filter(team => {
         return team.name.toLowerCase().indexOf(this.searchName.toLowerCase()) != -1 
        })
    },
  },
  mounted() {
    // this.stickyNavbar()
    this.test()
    this.getAllUsers()
    this.getAllTeams()
    this.getNotificationSocket()
  },
};
</script>

<style scoped>

/* .navbar{
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.6s;
  z-index: 100;
} */
.navbar-brand{
  color: white !important;
}

#friends {
  cursor: pointer;
}

.searcher{
  margin-left: 1em;
 max-width: 16em;
 max-height: 4em;
 height: 2em;
 width: 14em;
 border-radius: 15px;
 border-color: black;
 text-align: center;
}

.search-list{
  position: absolute;
  margin-top: 1em;
  margin-left: 1em;
  border-radius: 5px;
  background-color: rgb(208, 208, 208);
  height: 10em;
  width: 14em;
  z-index: 50;
  overflow: auto;
}

.users-list{
  cursor: pointer;
}

.teams-list{
  cursor: pointer;
}

.notification{
  color: rgb(251, 65, 65);
}

</style>