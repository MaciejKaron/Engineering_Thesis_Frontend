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
        <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/premium" class="nav-link">Premium</router-link>
        </li>
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
          Create Team
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
export default {
    name: "NavBar-comp",
    data() {
        return {
            
        }
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
    }
  },
  mounted() {
    // this.stickyNavbar()
    this.test()
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
</style>