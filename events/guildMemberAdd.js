module.exports = async (client, user) => {
	if (client.userDBArchive.has(user.id)) {
		client.userDB.set(user.id, client.userDB.get(user.id));
		client.userDBArchive.delete(user.id);
	}
};