<template>
 <div id="app">
   <NavBar @toggleBar="sideBarOpen = !sideBarOpen"/>
   <RightSideBar @toggleBar="sideBarOpen = !sideBarOpen" :open="sideBarOpen"/>
   <ChatBar @toggleChat="chatOpen = !chatOpen" :open="chatOpen" />
    <div class="container">
      <router-view :key="$route.path"/>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import RightSideBar from './components/RightSideBar.vue'
import ChatBar from './components/ChatBar.vue'
export default {
  name: "App",
  data() {
    return {
      sideBarOpen: false,
      chatOpen: false
  }
  },
  components: {
    NavBar,
    RightSideBar,
    ChatBar
}
}
</script>

<style>
.container{
  max-width: 100%;
}

</style>
