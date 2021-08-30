// api.ts

import { getCurrentInstance } from 'vue'
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor } from 'axios-jwt'
import axios from 'axios'




const apiHost = "https://app.lahti.tk:8081";
const BASE_URL = `${apiHost}`;

// 1. Create an axios instance that you wish to apply the interceptor to
export const axiosInstance = axios.create({ baseURL: BASE_URL })

// 2. Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {

	const response = await axios.post(`${BASE_URL}/token/refresh`, { token: refreshToken })

	return {
		accessToken: response.data.access_token,
		refreshToken: response.data.refresh_token
	}

}

applyAuthTokenInterceptor(axiosInstance, {
	requestRefresh,  // async function that takes a refreshToken and returns a promise the resolves in a fresh accessToken
	header: "Authorization",  // header name
	headerPrefix: "Bearer ",  // header value prefix
})