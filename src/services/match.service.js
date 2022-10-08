import axios from 'axios'

const API_URL = 'http://localhost:8080/api/'

class MatchService {
    createMatch(data) {
        return axios.post(API_URL + 'match', data)
    }

    findMyAllMatches(id, currentPage, pageSize) {
        return axios.get(API_URL + `matches/${id}?page=${currentPage}&size=${pageSize}`)
    }

    findThisTournamentMatches(id) {
        return axios.get(API_URL + `matches/tournament/${id}`)
    }

    cleareThisTournamentMatches(id) {
        return axios.delete(API_URL + `matches/delete/${id}`)
    }

    deleteThisMatch(id) {
        return axios.delete(API_URL + `match/delete/this/${id}`)
    }
}

export default new MatchService()