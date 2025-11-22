import axios, { AxiosInstance, AxiosError } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL 

const api: AxiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	// Important for cookie-based auth — include credentials on cross-site requests
	withCredentials: true,
})

// Simple response interceptor (keep for centralized error handling)
api.interceptors.response.use(
	(response: any) => response,
	(error: AxiosError) => {
		return Promise.reject(error)
	}
)

export default api
