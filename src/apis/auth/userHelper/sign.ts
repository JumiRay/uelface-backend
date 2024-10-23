// Ignore TypeScript errors for imports
// @ts-ignore
import crypto from 'node:crypto';
// @ts-ignore
import { Buffer } from 'node:buffer';

// Interface for the payload of the token
export interface IPayload {
	user_id: any, // User identifier
	sub: any, // Subject (can be user identifier or other info)
	exp: any, // Expiration time of the token
}

/**
 * Encodes a string to base64url format.
 * Base64url is a URL-safe version of base64.
 *
 * @param source - The string to encode
 * @returns The base64url-encoded string
 */
export function base64url(source: string) {
	// Encode the source in standard base64
	let encodedSource = Buffer.from(source).toString('base64');
	// Remove padding ('=') characters
	encodedSource = encodedSource.replace(/=+$/, '');
	// Replace '+' with '-' and '/' with '_' to make it URL-safe
	encodedSource = encodedSource.replace(/\+/g, '-');
	encodedSource = encodedSource.replace(/\//g, '_');
	return encodedSource;
}

/**
 * Decodes a base64url-encoded string to ASCII.
 *
 * @param base64urlString - The base64url-encoded string to decode
 * @returns The decoded string in ASCII
 */
export function decodeBase64Url(base64urlString: string) {
	// Convert base64url format back to base64 format
	let base64 = base64urlString.replace(/-/g, '+').replace(/_/g, '/');
	// Pad the string with '=' to ensure proper base64 length
	base64 += new Array(4 - (base64.length % 4) % 4).join('=');
	// Convert base64 back to a string
	return Buffer.from(base64, 'base64').toString();
}

/**
 * Creates and signs a JSON Web Token (JWT).
 * The token consists of a header, payload, and signature, separated by periods.
 *
 * @param data - The payload data to include in the token
 * @param secret - The secret key used to sign the token (default is 'jimurui')
 * @returns The signed JWT as a string
 */
export function sign(data: any, secret: any = 'jimurui') {
	// Define the header, specifying the algorithm and token type
	const header = {
		alg: 'HS256', // HMAC using SHA-256
		typ: 'JWT' // Token type is JWT
	};

	// Define the payload, including an expiration time (1 week by default)
	const payload: IPayload = {
		...data,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days expiration
	};

	// Encode the header and payload in base64url format
	const encodedHeader = base64url(JSON.stringify(header));
	const encodedPayload = base64url(JSON.stringify(payload));

	// Generate the signature using the header, payload, and secret
	const signature = crypto
		.createHmac('sha256', secret)
		.update(`${encodedHeader}.${encodedPayload}`)
		.digest('base64');

	// Return the JWT as a string: header.payload.signature
	return `${encodedHeader}.${encodedPayload}.${base64url(signature)}`;
}

/**
 * Verifies the validity of a JWT.
 * It checks the signature and the expiration time of the token.
 *
 * @param token - The JWT to verify
 * @param secret - The secret key used to verify the token (default is 'jimurui')
 * @throws If the token format is invalid, the signature is invalid, or the token has expired
 * @returns The decoded payload of the token if valid
 */
export async function verifyToken(token: string, secret = 'jimurui') {
	// Split the token into its three parts: header, payload, and signature
	const parts = token.split('.');
	if (parts.length !== 3) {
		throw new Error('Invalid token format');
	}

	// Decode the header and payload from base64url format
	const header = JSON.parse(decodeBase64Url(parts[0]));
	const payload: IPayload = JSON.parse(decodeBase64Url(parts[1]));
	const signature = parts[2];

	// Recompute the signature using the same header, payload, and secret
	const data = `${parts[0]}.${parts[1]}`;
	const expectedSignature = crypto
		.createHmac('sha256', secret)
		.update(data)
		.digest('base64');

	// Check if the provided signature matches the computed signature
	if (base64url(expectedSignature) !== signature) {
		throw new Error('Invalid signature');
	}

	// Check if the token has expired
	const now = Math.floor(Date.now() / 1000);
	if (payload.exp && payload.exp < now) {
		throw new Error('Token has expired');
	}

	// Return the decoded payload if the token is valid
	return payload;
}
