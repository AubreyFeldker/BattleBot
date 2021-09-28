module.exports = async (thread) => {
    console.log('Joined thread: ${thread.name}');
    if (thread.joinable) await thread.join();
};