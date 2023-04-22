const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
})); //this is use when you want to parse data posted on the html form
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');//database connection
const port = 3000;
const items = [];
const workItems = [];



app.get("/", function(request, response) {

  const day = date.getDate();

  response.render("list", {
    listTitle: day, newListItems: items
  }); //express will automatically look for the list file in the views folder
});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }



})

app.get("/work", function(request, response) {

  response.render("list", {
    listTitle: "Work List", newListItems: workItems
  }); //express will automatically look for the list file in the views folder
});


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
