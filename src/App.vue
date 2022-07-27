<template>
 <div id="app">
   <NavBar @toggleBar="sideBarOpen = !sideBarOpen"/>
   <RightSideBar @toggleBar="sideBarOpen = !sideBarOpen" :open="sideBarOpen" @toggleChat=RightSideChatOpen() />
   <ChatBar @toggleChat="chatOpen = !chatOpen" :openChat="chatOpen" />
    <div class="container">
      <router-view :key="$route.path"/>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import RightSideBar from './components/RightSideBar.vue'
import ChatBar from './components/ChatBar.vue'
import { ref } from 'vue'
// import { chat } from './store/chat'
export default {
  name: "App",
  data() {
    return {
      sideBarOpen: false,
      chatOpen: ref(false)
  }
  },
  components: {
    NavBar,
    RightSideBar,
    ChatBar
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
    }
}
}
</script>

<style>
.container{
  max-width: 100%;
}

</style>
