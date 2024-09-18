const mongoose = require("mongoose")



const db = ()=>{
    mongoose.connect(process.env.CONNECTION_STRING,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("database was connected");
        
    }).catch(err=>{
        console.log(err);
        
    })
}


module.exports = db