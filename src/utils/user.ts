import apiClientUser from './apiClientUser';
import {getAuthInitOverrides} from './AuthContext'

import { UserServiceCreateUserRequest, TemplatebackendCreateUserReply } from '../internal/client/index';

/**
 * Function to create a new user with the provided details.
 *
 * @param firstName The first name of the user.
 * @param lastName The last name of the user.
 * @param email The email address of the user.
 * @param password The password for the user's account.
 * @returns The response from the API or undefined in case of an error.
 */
export const createUser = async (firstName: string, lastName: string, email: string, password: string,) => {
    const user: UserServiceCreateUserRequest = {
        body: {
            firstName: firstName,
            lastName: lastName,
            username: email,
            email: email,
            password: password,
        }
    };

    try {
        const response = await apiClientUser.userServiceCreateUser(user);
        return response;
    } catch (error) {
        console.log("Error creating user:" + error);
    }
};

export const getMyUser = async () => {
    try {
        const response = await apiClientUser.userServiceGetUserMe(getAuthInitOverrides());
        return response; 
    } catch (error) {
        console.log("Error creating user:" + error);
    }
};
