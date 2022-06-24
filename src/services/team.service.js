import axios from 'axios'
const API_URL = 'http://localhost:8080/api/'

class TeamService {
    createTeam(data) {
        return axios.post(API_URL + 'team', data)
    }

    findOneTeam(id) {
        return axios.get(API_URL + `team/${id}`)
    }

    findAllTeams(searchName) {
        return axios.get(API_URL + `team/find/all?name=${searchName}`)
    }

    deleteTeam(id) {
        return axios.delete(API_URL + `team/${id}`)
    }

    deleteAllTeams() {
        return axios.delete(API_URL + 'team/delete/all')
    }
}

export default new TeamService()