export async function findUserByEmail(email: string, env: Env) {
	try {
		// Prepare the SQL query to find a user by their email
		const query = `SELECT * FROM user WHERE email = "${email}"`;
		// Execute the query and get the results
		const { results } = await env.DATABASE.prepare(query).all();
		// If a user is found, return the first result
		if (results && results.length > 0) {
			return results[0];
		}
		// If no user is found, return null
		return null;
	} catch (error) {
		// Error handling
		console.error('Error in findUserByEmail:', error);
		throw error; // You can also choose to return null or a custom error message here
	}
}
