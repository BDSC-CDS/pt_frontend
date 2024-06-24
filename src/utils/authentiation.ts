import apiClientAuth from './apiClientAuthentication';

import { AuthenticationServiceAuthenticateRequest } from '../internal/client/index';

/**
 * Function to authenticate a user with given credentials.
 *
 * @param email The email of the user.
 * @param password The password of the user.
 * @returns The response from the API or undefined in case of an error.
 */
export const authenticateUser = async (email: string, password: string) => {
    const user: AuthenticationServiceAuthenticateRequest = {
        body: {
            username: email, 
            password: password, 
        }
    };

    try {
        const response = await apiClientAuth.authenticationServiceAuthenticate(user);
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error authenticating user:" + error);
    }
};
