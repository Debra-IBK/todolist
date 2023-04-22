const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
})); //this is use when you want to parse data posted on the html form
app.use(express.static("public"));

//mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');//database local connection

mongoose.connect('mongodb+srv://admin-debby-dev:admin123@cluster-todo.kuhfndb.mongodb.net/todolistDB');//mongodb atlas connection

const port = 3000;

const itemsSchema = mongoose.Schema ({
  name:  {
    type: String,  //validation
    required:  [true, 'Please check your data entry, no name specified!']
  }
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema ({
  name:  {
    type: String,  //validation
    required:  [true, 'Please check your data entry, no name specified!']
  },
  items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);


app.get("/", function(request, response) {

  const day = date.getDate();

  Item.find({}).then(function (results) {

      const items = results;
      if(items.length === 0){
        Item.insertMany(defaultItems).then(function () {
            console.log("Successfully saved default items to DB");
          }).catch(function (err) {
            console.log(err);
          });
          response.redirect("/");
      }else{

        response.render("list", {
          listTitle: "Today", newListItems: items
        }); //express will automatically look for the list file in the views folder
      }

    }).catch(function (err) {
      console.log(err);
    });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item ({
    name: itemName
  })

  if(req.body.list === "Today"){
    newItem.save();
    res.redirect("/");
  }else{

    List.findOne({name: listName}).then(function (foundList) {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);

      }).catch(function (err) {
        console.log(err);
      });
  }

})

app.post("/delete", function(request, response) {

    const checkedItemId = request.body.checkbox;
    const listName = request.body.listName;

    if(listName === "Today"){
      Item.findByIdAndRemove(checkedItemId).then(function () {
          console.log("Successfully Deleted checked item");
          response.redirect("/");
      }).catch(function (err) {
          console.log(err);
      });
    }else{
      //The $pull  operator removes from an existing array all instances of a value or values that match a specified condition.
      List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}).then(function () {
          response.redirect("/" + listName);
      }).catch(function (err) {
          console.log(err);
      });
    }


});

//custom list using express route parameters
app.get("/:customListName", function(request, response) {

  const customListName = _.capitalize(request.params.customListName);

  List.findOne({name: customListName}).then(function (foundList) {

      if(!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        response.redirect("/" + customListName)

      }else{
        //console.log(foundList);
        response.render("list", {
          listTitle: foundList.name, newListItems: foundList.items
        }); //express will automatically look for the list file in the views folder

      }

    }).catch(function (err) {
      console.log(err);
    });
});




app.listen(process.env.PORT || port, () => {
  console.log(`server running on port ${port}`);
});
