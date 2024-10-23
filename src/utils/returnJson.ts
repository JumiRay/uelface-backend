export const returnJson = async (data: any | Promise<any>) => {
	const result = data instanceof Promise ? await data : data
	return new Response(JSON.stringify(result), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
