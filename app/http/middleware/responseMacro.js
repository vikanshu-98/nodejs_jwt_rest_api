const responseMacro=(app)=>{
    app.use((req,res,next)=>{
        res.success=function(message="success",code=200,success=true){
            return res.status(code).json({
                success,code,message
            })
        }
        res.data=function(data=[],code=200){
            return res.status(code).json({
                success:true,code,data 
            })
        }
        next()
    })
}

module.exports=responseMacro