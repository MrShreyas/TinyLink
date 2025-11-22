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
    return res.data
  },

  register: async (payload: RegisterPayload) => {
    const res = await api.post('/auth/signup', payload)
    return res.data
  },

  logout: async () => {
    try {
      return await api.post('/auth/logout')
    } catch (err) {
      throw err
    }
  },
}

export default AuthServices
