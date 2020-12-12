const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

//generate auth token 
exports.generateToken = (content) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60*60),
        data: content
    }, 'secret');
    return token;
}

exports.verifyToken = async (authToken) => {
    try {
        const decoded = await jwt.verify(authToken, 'secret');
        return decoded;
    }catch (e){
        console.log('CATCH ++++ ', e.message);
        return null;
    }
}

exports.encryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash
}

exports.matchPassword = async (password, hashword) => {
    const matched = await bcrypt.compare(password, hashword);
    return matched;
}
