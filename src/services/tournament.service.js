import axios from 'axios'
// import authHeader from './auth-header'
const API_URL = 'http://localhost:8080/api/'

class TournamentService {
    createTournament(data) {
        return axios.post(API_URL + 'tournaments', data)
    }

    findAllTournaments(currentPage, searchTitle, pageSize) {
        return axios.get(API_URL + `tournaments/all?page=${currentPage}&title=${searchTitle}&size=${pageSize}`)
    }

    findAllPublishedTournaments(currentPage,searchTitle,pageSize) {
        return axios.get(API_URL + `tournaments/published?page=${currentPage}&title=${searchTitle}&size=${pageSize}`)
    }

    findOneTournament(id) {
        return axios.get(API_URL + `tournaments/${id}`)
    }

    updateTournament(id,data) {
        return axios.put(API_URL + `tournaments/${id}`, data)
    }

    deleteTournament(id) {
        return axios.delete(API_URL + `tournaments/${id}`)
    }

    deleteAllTournaments() {
        return axios.delete(API_URL + 'tournaments/delete/all')
    }

    findTournamentByTitle(title) {
        return axios.get(API_URL + `tournaments/published?title=${title}`)
    }

    addUserToTournament(id,data) {
        return axios.post(API_URL + `tournaments/join/${id}`, data)
    }

    leaveUserFromTournament(id, data) {
        return axios.post(API_URL + `tournaments/rejoin/${id}`, data)
    }
}

export default new TournamentService()