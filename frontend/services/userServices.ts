import api from '../lib/axios'

type ProfileUpdate = {
  name?: string
  // add other fields as needed
}

const UserServices = {
  getProfile: async () => {
    const res = await api.get('/user/profile')
    return res.data
  },

  updateProfile: async (payload: ProfileUpdate) => {
    const res = await api.put('/user/profile', payload)
    return res.data
  },
}

export default UserServices
