import uuid from '../../../utils/uuid';


export interface UserData {
	user_id?: string;
	email: string;
	passwd_salt: string;
	user_name: string;
	ju_key: string;
	mobile?: string;
	avatar?: string;
	password?: string;
	is_delete?: string;
	appid?: string;
	gender?: string;
	apple_id?: string;
	integral?: string;
	device_id?: string;
	apple_openid?: string;
	google_id?: string;
}

export async function createUser(userData: UserData, env: Env) {
	const query = `
        INSERT INTO user (
            user_id, email, passwd_salt, user_name, ju_key,
            mobile, avatar, password, is_delete, appid,
            gender, apple_id, integral, device_id,
            apple_openid, google_id, create_time, update_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;

	userData.user_id = userData.user_id || uuid();
	const currentTime = `${Date.now()}`;

	const params = [
		userData.user_id, userData.email, userData.passwd_salt, userData.user_name, userData.ju_key,
		userData.mobile || '', userData.avatar || '', userData.password || '', userData.is_delete || '0', userData.appid || '',
		userData.gender || '', userData.apple_id || '', userData.integral || '0', userData.device_id || '',
		userData.apple_openid || '', userData.google_id || '', currentTime, currentTime
	];

	await env.DATABASE.prepare(query).bind(...params).run();
	return userData;
}
