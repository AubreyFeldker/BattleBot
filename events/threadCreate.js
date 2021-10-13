module.exports = async (client, thread) => {
	if (thread.joinable) {
		await thread.join();
		console.log(`Joined thread: ${thread.name}`);
	}
	else
		console.log(`Could not join thread: ${thread.name}`);
};