require("dotenv").config();
const express = require('express');
const path= require('path');
const mongoose= require('mongoose');
const app= express();
const userRoute= require('./routes/user');
const blogRoute= require('./routes/blog');
const cookieParser= require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const port =process.env.PORT || 8000;
const Blog=require('./models/blog');


mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log('connected to mongodb')})
.catch((err)=>console.log(err))
//view engine
app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'))
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./uploads')));


app.get('/',async (req,res)=>{
    const allBlogs= await Blog.find({});
    res.render('home', 
        {
        user:req.user,
        blogs:allBlogs,
    });
})
app.use('/user',userRoute);
app.use('/blog',blogRoute)

app.listen(port, ()=>{console.log(`server connected at port ${port}`)})