
const users                    = require('../../model/users')
const createError              = require('http-errors')
const registerRequestValidator = require('../request/registerRequestValidation')
const loginRequestValidation   = require('../request/loginRequestValidation')
const {signAccessToken, signRefreshToken,refreshTokenValidator}   = require('../middleware/jwtToken')
const commonController         = ()=>{
    return {
        homePage(req,res,next){
            res.success();
        },
        async loginRequest(req,res,next){
            try{ 
                const {email,password} = req.body;
                await loginRequestValidation.validateAsync(res.body); 
                const isUserValid = await  users.findOne({email:email})
                if(!isUserValid) throw createError.NotFound("user not registered.")
                const ispasswordCorrect = await isUserValid.isPasswordValid(password);
                if(!ispasswordCorrect) throw createError.Unauthorized("username/password not valid.")
                const {access_token,expiresIn} =await signAccessToken(email);
                const {refresh_token}=await signRefreshToken(email);
                await users.updateOne({email:email},{refreshToken:refresh_token})
                res.data({access_token,refresh_token,expiresIn,'type':'bearer'});
            }catch(err){
                if(err.isJoi) err.status=422
                next(err);
            }
        },
        async registerRequest(req,res,next){ 
            try{
                const {name,email,password} = req.body;
                await registerRequestValidator.validateAsync(req.body);

                const isExist  = await users.findOne({email:email}); 
                if(isExist) throw createError.Conflict(`this ${email} has been already registered.`)
                 const user = new users({
                    name,email,password
                });
                
                const userRegister= await user.save();
                if(userRegister){
                    const token =await signAccessToken(email);
                   res.data({token})
                }else{
                    throw new createError('something went wrong');
                } 
            }   catch(err){
                    if(err.isJoi) err.status=422
                    next(err)
            } 
             
        },
        async getAccessToken(req,res,next){
            try{
                const {refreshToken} = req.body;
                if(!refreshToken) throw createError.BadRequest()
                const userId  = await refreshTokenValidator(refreshToken)
                const {access_token,expiresIn} =await signAccessToken(userId);
                const {refresh_token}=await signRefreshToken(userId); 
                await users.updateOne({email:userId},{refreshToken:refresh_token})
                res.data({access_token,refresh_token,expiresIn,'type':'bearer'});
            }catch(err){ next(err)}
        }
    }
}

module.exports = commonController