import { IRequest } from 'itty-router';

let corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400"
};
export function handleOptions(request:any) {
	let respHeaders = {
		...corsHeaders,
		"Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers")
	};
	return new Response(null, {
		headers: respHeaders
	});
}
