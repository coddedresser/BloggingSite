const jwt=require('jsonwebtoken');

const secret="fnsdijbvwanv2p32ri-3ro32-0";

function createTokenForUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        role:user.role
    }
    const token=jwt.sign(payload,secret)
    return token;
}

function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={createTokenForUser,validateToken};
