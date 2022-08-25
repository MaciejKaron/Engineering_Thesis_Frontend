<template>
    <h2 class="title">Global Ranking</h2>
    <div class="ranking">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th v-for="field in fields" :key="field">
                        {{field}} <font-awesome-icon icon="sort-down" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user,index) in verifiedUsers" :key="user">
                    <td >
                        {{index +1}}
                    </td>
                    <td>
                        {{user.username}}
                    </td>
                    
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import faceitService from '@/services/faceit.service'
export default {
    name: "Ranking-comp",
    data() {
        return {
            verifiedUsers: [],
            thisUserInfo: [],
            thisStats: [],
            fields: ["RANKING", "PLAYER", "SKILL_LEVEL", "ELO"]
        }
    },
    methods: {
        getVerifiedUsers(){
            faceitService.getVerifiedUsers()
                .then(response => {
                    this.verifiedUsers = response.data
                    
                // console.log(this.verifiedUsers);
            })
        },
        getMyFaceitStats(id) {
            faceitService.getMyFaceitStats(id)
                .then(response => {
                this.thisUserInfo = response.data
                    this.thisStats = response.data.games.csgo
                // console.log(this.thisUserInfo);
                // console.log(this.thisStats);
        })
    },
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user
      },
    },
    mounted() {
        this.getVerifiedUsers()
    },
}
</script>

<style scoped>
.title{
    text-align: center;
}
</style>