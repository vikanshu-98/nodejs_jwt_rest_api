 module.exports= class AppException extends Error{
    message;
    name;
    iscustomError;
    constructor(message,success,iscustomError=false){ 
            super(message) 
            this.name = success;  
            this.message=message;
            //this.success=success;
            this.iscustomError=iscustomError
    }
}
 