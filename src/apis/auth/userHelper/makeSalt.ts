// Ignore TypeScript errors for imports
// @ts-ignore
import crypto from 'node:crypto';
// @ts-ignore
import { Buffer } from 'node:buffer';

/**
 * Generates a random salt for password encryption.
 *
 * @param len - The length of the salt in bytes (default is 3 bytes)
 * @returns A base64 encoded string representing the salt
 */
export function makeSalt(len: number = 3): string {
	// Generates random bytes and converts them to a base64 string
	return crypto.randomBytes(len).toString('base64');
}

/**
 * Encrypts a password using PBKDF2 with the provided salt.
 *
 * @param password - The plain text password to encrypt
 * @param salt - The base64 encoded salt to use for encryption
 * @returns The encrypted password as a base64 encoded string
 */
export function encryptPassword(password: string, salt: string): string {
	// If either password or salt is missing, return an empty string
	if (!password || !salt) {
		return '';
	}
	// Convert the base64-encoded salt back to its original form
	const tempSalt = Buffer.from(salt, 'base64');

	// Encrypt the password using PBKDF2 (Password-Based Key Derivation Function 2)
	// 10000 is the number of iterations, 16 is the length of the derived key, and 'sha1' is the hashing algorithm
	return (
		crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
	);
}
