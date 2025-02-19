import apiClientUser from './apiClientUser';
import {getAuthInitOverrides} from './authContext'

import { UsersServiceCreateUserRequest, TemplatebackendCreateUserReply, ResponseError } from '../internal/client/index';

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
    const user: UsersServiceCreateUserRequest = {
        body: {
            firstName: firstName,
            lastName: lastName,
            username: email,
            email: email,
            password: password,
        }
    };

    try {
        const response = await apiClientUser.usersServiceCreateUser(user);
        return response; // TODO return response.result.id ....
    } catch (error) {
        console.log("Error creating user:" + error);        
        throw error
    }
};

export const getMyUser = async (token?: string) => {
    try {
        const response = await apiClientUser.usersServiceGetUserMe(getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error retrieving user:" + error);
        throw error
    }
};

export const searchUsers = async (emailLike: string) => {
    try {
        const response = await apiClientUser.usersServiceSearchUsers({
            body: {
                emailLike: emailLike
            }
        }, getAuthInitOverrides());
        return response?.result;
    } catch (error) {
        console.log("Error listing users:" + error);
        throw error;
    }
};
