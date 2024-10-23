import { IRequest } from 'itty-router';
import { verifyToken } from '../apis/auth/userHelper/sign';
import { returnJson } from './returnJson';

export async function authCheck(request: IRequest, env:Env, next:any) {
	try {
		const token = request.headers.get('token')
		const payload = await verifyToken(token);
		return returnJson(next(request,env, {...payload, token}));
	} catch (error) {
		return returnJson({ code: 401, message:  "Unauthorized"});
	}
}
