const commonController = require('../app/http/controller/commonController')
const {verifyAccessToken}  = require('../app/http/middleware/jwtToken')
const initRoutes = (app)=>{ 
    app.post('/login',commonController().loginRequest)
    app.post('/register',commonController().registerRequest)
    app.get('/',verifyAccessToken,commonController().homePage)
    app.post('/refreshToken',commonController().getAccessToken)
     
}

module.exports=initRoutes