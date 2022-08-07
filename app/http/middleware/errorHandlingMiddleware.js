
const errorHandlingMiddleware=(app)=>{

    app.use( (err,req,res,next)=>{
        return res.status(err.status||500).send({error:{"status":err.status||500,"message":err.message}})
    }) 
} 

module.exports= errorHandlingMiddleware