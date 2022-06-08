import axios from 'axios'
// import authHeader from './auth-header'
const API_URL = 'http://localhost:8080/api/'

class TournamentService {
    createTournament(data) {
        return axios.post(API_URL + 'tournaments', data)
    }

    findAllTournaments() {
        return axios.get(API_URL + 'tournaments/all')
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
        return axios.get(API_URL + `tournaments/all?title=${title}`)
    }
}

export default new TournamentService()