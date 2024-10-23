import { Router } from 'itty-router';
import uuid from './utils/uuid';
import { emailLogin } from './apis/auth/emailLogin';
import { returnJson } from './utils/returnJson';
import { authCheck } from './utils/authCheck';

const router = Router();


// auth login
router.post('/api/auth/emailLogin', async (request, env: Env) => returnJson(emailLogin(request, env)));

// user detail

// get template list

// get result list

// upload file

// making

// .......


// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
