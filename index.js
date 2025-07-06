const express =require('express');
const path=require('path');
const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');
const Blog=require('./models/blog');
require('dotenv').config();

const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const checkForAuthenticationCookie = require('./middlewares/auth');


const app=express();
const PORT=process.env.PORT;
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

mongoose.connect(process.env.MONGO_URL)
.then(e=>console.log("MongoDB Connected"));

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));
app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({}); //.sort('createdAt',-1);
    return res.render('home',{
        user:req.user,
        blogs:allBlogs
    });
})
app.use('/blog',blogRoute);
app.use('/user',userRoute);

// app.listen(PORT,()=>console.log(`Server Started at PORT:${PORT}`));

module.exports=app;