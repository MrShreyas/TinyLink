import axios from 'axios'
import api from '../lib/axios'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
    firstName: string
    lastName: string
    email: string
    password: string
}

const AuthServices = {
  login: async (payload: LoginPayload) => {
    const res = await api.post('/auth/login', payload)
    if(res.data.token){
      axios.post('/api/login', { token: res.data.token })
    }
    return res.data
  },

  register: async (payload: RegisterPayload) => {
    const res = await api.post('/auth/signup', payload)
    return res.data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
      return axios.post('/api/logout')

    } catch (err) {
      throw err
    }
  },
}

export default AuthServices
