import { createUser } from './userHelper/createUser';
import { findUserByEmail } from './userHelper/findUserByEmail';
import uuid from '../../utils/uuid';
import { encryptPassword, makeSalt } from './userHelper/makeSalt';
import { sign } from './userHelper/sign';
import { IRequest } from 'itty-router';

export async function emailLogin(request: IRequest, env: Env) {
	// Parse the request body to get the login information
	const body = await request.json();

	// Interact with the D1 database to find a user by email
	const user = await findUserByEmail(body.email, env);

	// If the user doesn't exist, create a new user
	if (!user) {
		// Generate a salt for password encryption
		const salt = makeSalt();

		// Create a new user object with the provided information
		let userData = {
			email: body.email,
			password: body.password, // Store the plain password, encryption should be added here
			passwd_salt: salt, // Store the generated salt
			user_name: uuid(), // Generate a unique user name using uuid
			ju_key: body.juKey // Store additional information if provided
		};

		// Interact with the D1 database to create a new user
		const userInfo = await createUser(userData, env); // Assuming createUser is a function that interacts with the database

		// Generate a token for the newly created user
		const token = sign({ user_id: userInfo.user_id, sub: salt });

		// Return a response with the user id, token, and indicate the user is new
		return { code: 200, data: { user_id: userInfo.user_id, token, is_new: true } };
	} else {
		// If the user exists, check if the provided password matches the stored password
		if (user.password !== body.password) {
			// Return an error if the password is incorrect
			return { code: 400, error: 'Incorrect password' };
		}

		// Generate a token for the existing user
		const token = sign({ user_id: user.user_id, sub: user.passwd_salt });

		// Return a response with the user id, token, and indicate the user is not new
		return { code: 200, data: { is_new: false, user_id: user.user_id, token } };
	}
}
