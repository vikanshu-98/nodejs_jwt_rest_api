const mongoose = require('mongoose')
const bcrpyt   =  require('bcrypt') 
const userScheema = new mongoose.Schema({
name:{
    required:true,
    type:String
},
email:{
    required:true,
    type:String,
    lowercase:true,
    unique:true, 
},
password:{
    required:true,
    type:String,
},
 refreshToken:{
    type:String,
    default:''
 }
},
{
    timestamps:true
})

userScheema.pre("save",async function(next){
    try{
        const salt    = await bcrpyt.genSalt(10); 
        this.password = await bcrpyt.hash(this.password,salt);
        next()

    }catch(err){
        next(err)
    }
      
});

userScheema.methods.isPasswordValid= function(password){
    try{
        return bcrpyt.compare(password,this.password)
    }catch(err){
        return err;
    }
}

const userModel = new mongoose.model('users',userScheema)
module.exports =userModel