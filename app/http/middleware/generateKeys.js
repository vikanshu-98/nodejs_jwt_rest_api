const crypto     = require('crypto')
const key1       = crypto.randomBytes(30).toString('hex');
const key2       = crypto.randomBytes(30).toString('hex');
console.table({key1,key2})