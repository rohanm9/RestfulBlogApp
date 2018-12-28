var express      =require('express'),
    app          =express(),
    mongoose     =require('mongoose'),
    bodyParser   =require('body-parser'),
    methodOveride=require('method-override'),
    expressSanitizer=require('express-sanitizer');
    
// mongoose/model config
mongoose.connect('mongodb://localhost:27017/blog_app',{useNewUrlParser:true});
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    date: {type: Date,default: Date.now}
});
var Blog=mongoose.model('Blog',blogSchema);

/*Blog.create({
    title: 'New blogs coming soon',
    image: 'https://thumbs.gfycat.com/FilthyGranularCoral-small.gif',
    description: 'I recently created this blogging website new interesting devblogs are coming soon...'
});*/

// app config
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOveride('_method'));
//routes
app.get('/',function(req,res){
    res.redirect('/blogs');
});
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err) console.log(err);
        else res.render('index',{blogs: blogs});
    });
});
app.get('/blogs/new',function(req,res){
    res.render('new');
});
app.post('/blogs',function(req,res){
    req.body.blog.description=req.sanitize(req.body.blog.description);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/blogs');
        }
    });
});
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render('show',{blog:foundBlog});    
        }
    });
});

app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,editBlog){
         if(err){
             console.log(err);
         }
         else{
             res.render('edit',{blog:editBlog});
         }
    });
});

app.put('/blogs/:id',function(req,res){
    req.body.blog.description=req.sanitize(req.body.blog.description);
    Blog.findOneAndUpdate({_id:req.params.id},req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
});
// can also be done by delete route
app.get('/blogs/:id/delete',function(req,res){
    Blog.findOneAndDelete({_id:req.params.id},function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/blogs');
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log('server has started');
})