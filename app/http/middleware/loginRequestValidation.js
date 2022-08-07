const joi =require('joi')

const loginRequestValidation=joi.object({
    email:joi.string().email().lowercase().required(),
    password:joi.string().required()
})

module.exports=loginRequestValidation