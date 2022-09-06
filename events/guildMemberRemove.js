module.exports = async (client, user) => {
	if (client.userDB.has(user.id)) {
		client.userDBArchive.set(user.id, client.userDB.get(user.id));
		client.userDB.delete(user.id);
	}
};