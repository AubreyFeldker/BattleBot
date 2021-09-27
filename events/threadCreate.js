module.exports = async (thread) => {
    if (thread.joinable) await thread.join();
};