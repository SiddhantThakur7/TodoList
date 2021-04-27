//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
const date = require(__dirname + "/date.js");

mongoose.connect("MongoUri", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //to point to location of all static files to be served in the course of the webapp execution
app.set('view engine', 'ejs'); //to recognise the ejs templates.

const itemSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemSchema]
};

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);
// const items = ['Food', 'Drinks'];
// const workItems = ['Assignment 1'];


app.get("/", function(req, res){
  cur = date();
  let found_items = [];
  Item.find({}, function(err, found){
    if(err){
      console.log(err);
    }else {
      if (found.length == 0){
        Item.insertMany([
        new Item({
          name: "Add To Your List with the + button"
        }),
        new Item({
          name: "Get Things Done"
        })
        ],
        function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Successfully saved defaultItems");
          }
        });
      }else{
      // found.forEach(function(i){
      //   found_items.push(i.name);
      // });
      res.render("index", {the_day: cur, newItems: found});
    }
    }
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  let listName = req.body.list;
  if (listName!=date()){
    listName = _.capitalize(listName);
  }

  const newitem = new Item({
    name: itemName
  });

  if (listName == date()){
    newitem.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, found){
      if(!err){
        found.items.push(newitem);
        found.save();
      }
    });
    res.redirect("/"+listName);
  }


});

// app.get("/work", function(req, res){
//   res.render('index', {the_day:"Work", newItems: workItems});
// });
//
// app.post('/work', function(req, res){
//   workItems.push(req.body.newItem);
//   res.redirect("/");
// });

app.post("/delete", function(req, res){
  const del_id = req.body.checkbox;
  const listName = req.body.lname;

  if (listName == date()){
    Item.findByIdAndRemove(del_id, function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: del_id}}}, function(err, found){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }

});


app.get("/:customListName", function(req, res){
  let Lname = _.capitalize(req.params.customListName);

  List.findOne({name:Lname}, function(err, found){
    if(!err){
      if(!found){
        const list = new List({
          name: Lname,
          items: [
          new Item({
            name: "Add To Your " + Lname + "    List with the + button"
          }),
          new Item({
            name: "Get Things Done"
          })
          ]
        });
      res.redirect("/"+Lname);
      list.save();
    }
    else{
      res.render("index", {the_day: found.name, newItems: found.items});
    }
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server Started");
});
