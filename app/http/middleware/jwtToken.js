
const JWT = require('jsonwebtoken')

const createError=require('http-errors')
const userModel = require('../../model/users')
 
module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={ 
            }
            const secretkey = process.env.TOKEN_KEY
            const options={
                expiresIn:process.env.JWT_EXPIRES_IN,
                issuer:"abcd@yopmail.com",
                audience:userId
            }

            JWT.sign(payload,secretkey,options,(err,token)=>{
                if(err) reject(createError.InternalServerError())
                resolve({access_token:token,expiresIn:process.env.JWT_EXPIRES_IN})
            })
        })
         
    },
    signRefreshToken:(userid)=>{
        return new Promise((resolve,reject)=>{
            const secretkey = process.env.REFRESH_TOKEN_KEY
            const options={
                expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
                issuer:"äbcd@yopmaiul.com",
                audience:userid
            } 
            const payload={

            }
            JWT.sign(payload,secretkey,options,(err,token)=>{
                if(err) reject(createError.InternalServerError())
                resolve({refresh_token:token})
            })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers['authorization']) throw createError.Unauthorized()
        const authHeader = req.headers['authorization']
        const accessToken      = authHeader.split(' ')
        if(accessToken[0]!='Bearer') throw createError.Unauthorized()
        const token  = accessToken[1]
        JWT.verify(token,process.env.TOKEN_KEY,(err,payload)=>{
            if(err){
                if(err.name==="JsonWebTokenError"){
                    throw createError.Unauthorized()
                }
                if(err.name=="TokenExpiredError"){
                    res.status(401).success('Token has been expired',401,false)
                }else{
                    throw createError.Unauthorized(err.message);
                }
            } 
            console.log(payload)
            req.payload=payload
            next()
        })

    },
    refreshTokenValidator:(token)=>{
        return new Promise((resolve,reject)=>{
            JWT.verify(token,process.env.REFRESH_TOKEN_KEY,(err,payload)=>{
                if(err){
                    if(err.name==="JsonWebTokenError"){
                        throw createError.Unauthorized()
                    }
                    if(err.name=="TokenExpiredError"){
                        throw createError.Unauthorized('Token has been expired')
                       // Response.status(401).success('Token has been expired',401,false)
                    }else{
                        throw createError.Unauthorized(err.message);
                    }
                }
                const email = payload.aud; 
                userModel.findOne({$and:[{email:email},{refreshToken:token}]},function(err,data){
                    if(err) reject(err)
                    if(!data)  reject(createError.Unauthorized())
                    resolve(payload.aud)
                })
               
            });
        })
        
    }
}