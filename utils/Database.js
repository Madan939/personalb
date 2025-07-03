const mongoose=require('mongoose');
const url=process.env.DATABASE;
mongoose.connect(url);
const connectionObj=mongoose.connection;
connectionObj.on('connected',()=>{
    console.log("Database connected successfully");
})
connectionObj.on('error',(error)=>{
    console.log("connection error",error);
})
connectionObj.on('disconnected',()=>{
    console.log("Database disconnected");
})
process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    process.exit(0);
})
module.exports=connectionObj;