const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const wikiSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Articles = mongoose.model("Articles",wikiSchema);

const articles = new Articles ({
  title : "Express",
  content: "Framwework for nodejs"
});
// articles.save();

app.listen(8080,function(){
  console.log("Listening in port 3000");
});


///////////////////////////////////Requests targeting all articles////////////////////////////////

app.get("/articles",function(req,res){
  Articles.find(function(err,results){
    if(!err){
      console.log("There is not an error");
      res.send(results);

    }
  });
});

app.post("/articles",function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Articles({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save();
});


app.delete("/articles",function(req,res){
  Articles.deleteMany(function(err){
    if(err){
      res.send(err);
    }
  });
});


///////////////////////////////////Requests targeting one article////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
  const tit = req.params.articleTitle;
  Articles.findOne({title:tit},function(err,results){
    if(err){
      res.send("Error");
    }else{
      res.send(results);
    }
  });
})

.put(function(req,res){
  const tit = req.params.articleTitle;
  Articles.update({title:tit},{content:req.body.content},{overwrite:true},function(err){
    res.send("Updated");
  })
})

.patch(function(req,res){
  const tit = req.params.articleTitle;
  Articles.update({title:tit},{$set:req.body},function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully updated");
    }
  })
})

.delete(function(req,res){
  const tit = req.params.articleTitle;
  Articles.deleteOne({title:tit},function(err){
    if(err){
      res.send(err);
    }else{
      res.send("deleted successfully");
    }
  });
});
