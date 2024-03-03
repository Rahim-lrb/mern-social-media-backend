const jwt = require("jsonwebtoken")
const { TOKEN_KEY, TOKEN_EXPIRY } = process.env

const createToken = async ( email , TokenKey = TOKEN_KEY, expiresIn = TOKEN_EXPIRY) => {
    try {
        const token = await jwt.sign( {email} , TokenKey, { expiresIn })
        console.log(token)
        return token;
    }
    catch (err) {
        throw err
    }
}

const verifyToken = async (token, TokenKey = TOKEN_KEY ) => {
    try {
        const decoded = await jwt.verify(token, TokenKey);
        console.log(decoded)
        return decoded;
    } catch (err) {
        throw err;
    }
}

module.exports = { createToken, verifyToken };