// Get the UNIX timestamp day
const getDate = (timestamp) => { return Math.floor(timestamp / (86400000));};

const cleanToAlphaNumeric = (string) => { return string.replaceAll(/[^a-zA-Z0-9]/g, ''); }

module.exports = { getDate, cleanToAlphaNumeric }