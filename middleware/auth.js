const { verify } = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    check_token:(req, res, next )=>{
        let token = req.get("authorization");
        if (token){
            token = token.slice(7);
            verify(token, process.env.TOKEN_SECRET, (err, decoded)=>{
                if(err){
                    res.json({
                        success: 0,
                        message :"Invalid Token"
                    })
                }
                else{
                    next();
                }
            })

        }else{
            res.json({
                success:0, message: "accesses denied: no authorization"
            })
        }
    }
}