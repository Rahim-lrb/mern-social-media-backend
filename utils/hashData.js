const bcrypt = require("bcrypt");

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData; 
    } catch (err) {
        throw err;
    }
}

const verifyHashedData = async (notHashed, hashed) => {
    try {
        const match = await bcrypt.compare(notHashed, hashed);
        return match;
    } catch (err) {
        throw err;
    }
}

module.exports = { hashData, verifyHashedData };
