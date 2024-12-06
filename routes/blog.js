const express= require('express');
const router = express.Router();
const Blog= require('../models/blog');
const path=require('path');
const multer  = require('multer');
const Comment = require('../models/comments');


router.get('/addBlog',(req,res)=>{
    return res.render('addBlog',{
        user:req.user
    })
});

router.get('/:id', async (req,res)=>{
    const blog= await Blog.findById(req.params.id).populate("createdBy");
    const comments= await Comment.find({blogId:req.params.id}).populate("createdBy")
    return res.render('blog', {
        user:req.user,
        blog:blog,
        comments:comments
    })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

router.post('/', upload.single("coverImage"), async (req,res)=>{
    const {title,body}= req.body;
    console.log(req.body,"checking while created post")
    const blog=await Blog.create({
        body,
        title,
        createdBy:req.user._id, 
        coverImageURL:`/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.get('/delete/:id', async (req,res)=>{
    await Blog.findOneAndDelete({_id:req.params.id})
    return res.redirect('/')

})

router.get('/edit/:id', async (req,res)=>{
    const id= await Blog.findOne({_id:req.params.id});
    return res.render('editBlog', {id:id})
})
router.post('/edit/:id', async (req,res)=>{
        console.log(req.body,"request object")
        await Blog.updateOne({_id:req.params.id}, {$set:{coverImageURL:req.body.coverImage, title:req.body.title, body:req.body.body}}, {new:true});
        return res.redirect(`/blog/${req.params.id}`);
})

router.post('/comment/:blogId', async (req,res)=>{
 await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user_id,
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports= router;