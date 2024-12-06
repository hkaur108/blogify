const mongoose= require('mongoose');

const blogSchmema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImageURL:{
        type:String,
        required:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps:true});


const Blog= mongoose.model('blog',blogSchmema);

module.exports=Blog;