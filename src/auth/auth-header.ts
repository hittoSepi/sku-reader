import { getAccessToken } from "axios-jwt"

export default function authHeader() {
	/*let user = JSON.parse(localStorage.getItem('user'));*/
	const accessToken = getAccessToken();
	if (accessToken) {
		// for Node.js Express back-end
		const header = "Bearer " + accessToken
		return header;
	} else {
		return {};
	}
}
