import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const Profile = () => import("./components/Profile.vue")
const BoardAdmin = () => import("./views/BoardAdmin.vue")
const BoardModerator = () => import("./components/BoardModerator.vue")
const BoardUser = () => import("./components/BoardUser.vue")
const TournamentEdit = () => import("./components/TournamentEdit.vue")
const Premium = () => import("./views/Premium.vue")
const Friends = () => import("./views/Friends.vue")
const UserProfile = () => import("./views/UserProfile")

const routes = [
    {
        path: "/",
        name: "start",
        component: Login,
    },
    {
        path: "/home",
        component: Home,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/profile",
        name: "profile",
        //lazy-loaded
        component: Profile,
    },
    {
        path: "/admin",
        name: "admin",
        // lazy-loaded
        component: BoardAdmin,
      },
      {
        path: "/mod",
        name: "moderator",
        // lazy-loaded
        component: BoardModerator,
      },
      {
        path: "/user",
        name: "user",
        // lazy-loaded
        component: BoardUser,
    },
    {
        path: "/tournament/edit/:id",
        name: "tournamentEdit",
        // lazy-loaded
        component: TournamentEdit,
    },
    {
        path: "/premium",
        name: "premium",
        // lazy-loaded
        component: Premium,
    },
    {
        path: "/friends",
        name: "friends",
        //lazy-loaded
        component: Friends,
    },
    {
        path: "/user/profile/:id",
        name: "UserProfile",
        //lazy- loaded
        component: UserProfile,
    },
      
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

//CHECK AUTHORIZED STATUS EVERYTIME A NAVIGATING ACTION IS TRIGGERED

// router.beforeEach((to, from, next) => {
//     const publicPages = ['/login', '/register', '/home'];
//     const authRequired = !publicPages.includes(to.path);
//     const loggedIn = localStorage.getItem('user');
//     // trying to access a restricted page + not logged in
//     // redirect to login page
//     if (authRequired && !loggedIn) {
//       next('/login');
//     } else {
//       next();
//     }
//   });

export default router;