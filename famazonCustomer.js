var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "famazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

function start() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw (err);
  inquirer.prompt ([
    {
      type: "list", 
      name: "productList", 
      message: "These are all of our products at Famazon. What would you like to buy?", 
      choices: function () {
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
          choiceArray.push(res[i].product_name) 
        }
        return choiceArray;
        }
      }
    ])
    .then(function(userAnswers) {
      var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === userAnswers.productList) {
            chosenItem = res[i];
          }
        }
      function buyQuantity() {
        inquirer.prompt ([
          {
            type: "input",
            name: "quantity", 
            message: "How many would you like to buy?"
          }
        ])
        .then(function(userAnswer){
          console.log(chosenItem.stock_quantity);
          if (chosenItem.stock_quantity< userAnswer.quantity) {
            console.log("Sorry, not enough stock!");
          }
          else if(chosenItem.stock_quantity > userAnswer.quantity){
            var newStock = parseInt(chosenItem.stock_quantity - userAnswer.quantity);
            console.log("yeah we have enough");
            // console.log(newStock);
            // console.log(chosenItem.product_name);
            connection.query("UPDATE products SET ? WHERE ?", 
            [
            {
              stock_quantity: newStock
            },
            {
              product_name: chosenItem.product_name
            }
            ],
            function(err,res){
              if (err) throw (err);
              console.log("Stock successfully updated!");
            })
          }
          
        });
      }
      buyQuantity();
    });
  });
}


