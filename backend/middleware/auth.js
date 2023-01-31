const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No authorization credentials sent' })
        }
        const breakAuth = req.headers.authorization.split(' ')
        const varifiedToken = await jwt.verify(breakAuth[0], process.env.TOKEN_KEY)
        req.verified = varifiedToken.User.UserID
    } catch ({ message }) {
        if (message === 'jwt expired') {
            return res.status(401).json({ message: 'No authorization credentials sent' })
        }
        return res.status(401).json({ message: 'Invalid credentials sent' })
    }
}
module.exports = auth;