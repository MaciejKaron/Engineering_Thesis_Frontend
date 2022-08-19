<template>
 <div id="app">
   <NavBar @toggleBar="sideBarOpen = !sideBarOpen" @toggleNotifications="notificationsOpen = !notificationsOpen" />
   <RightSideBar @toggleBar="sideBarOpen = !sideBarOpen" :open="sideBarOpen" @toggleChat=RightSideChatOpen() />
   <ChatBar @toggleChat="chatOpen = !chatOpen" :openChat="chatOpen" />
   <teamInvite @toggleInvite="inviteOpen = true" @toggleInviteClose="inviteOpen = false" :open="inviteOpen" />
   <Notifications @toggleNotifications="notificationsOpen = !notificationsOpen" :open="notificationsOpen" />

    <div class="container">
      <router-view :key="$route.path"/>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import RightSideBar from './components/RightSideBar.vue'
import ChatBar from './components/ChatBar.vue'
import teamInvite from './components/teamInvite.vue'
import socketioService from './services/socketio.service'
import { ref } from 'vue'
import Notifications from './components/Notifications.vue'
// import { chat } from './store/chat'
export default {
  name: "App",
  data() {
    return {
      sideBarOpen: false,
      chatOpen: ref(false),
      inviteOpen: false,
      notificationsOpen: false,
  }
  },
  components: {
    NavBar,
    RightSideBar,
    ChatBar,
    teamInvite,
    Notifications
},
  methods: {
    RightSideChatOpen() {
      if (this.chatOpen == false) {
        this.chatOpen = true
      } else {
        this.chatOpen = false
         this.$nextTick(function () {
                    this.chatOpen = true
                     })
      }
    },
  },
created() {
        socketioService.setupSocketConnection()
    },
}
</script>

<style>
.container{
  max-width: 100%;
}

</style>
