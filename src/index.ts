/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import apiRouter from './router';
import { handleOptions } from './cors';

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/api/')) {
			if (request.method === 'OPTIONS') {
				return handleOptions(request);
			} else {
				// You can also use more robust routing
				let response = await apiRouter.handle(request, env, ctx);
				response.headers.set("Access-Control-Allow-Origin", "*")
				response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
				return response
			}
		}

		return new Response(
			`<h1>NOTHING IN HERE</h1>`,
			{ headers: { 'Content-Type': 'text/html' } }
		);
	},
	async scheduled(event: any, env: Env, ctx: ExecutionContext) {
		// ctx.waitUntil(doSomeTaskOnASchedule());
		// console.log('ddd','event', JSON.stringify(event));
	}
};
