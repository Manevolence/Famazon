var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");

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
    inquirer.prompt ([
        {
            type: "list",
            name: "managerMenu",
            message: "What would you like to do Mr. Manager?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Famazon Manager Portal"]
        }
    ])
    .then(function(userAnswers){
        if (userAnswers.managerMenu === "View Products for Sale") {
            connection.query("SELECT * FROM products", function(err, res){
                if (err) throw (err);
                else {
                    console.table(res);
                    start();
                // Without console.table

                //   var choiceArray = [];

                //     for (var i = 0; i < res.length; i++) {
                //     choiceArray.push(res[i].product_name) 
                //     }

                //     for (var i = 0; i < choiceArray.length; i++) {
                //         console.log(choiceArray[i]+ `\n` + "--------------------------------")
                //     }
                }
            })
        }
        
        if (userAnswers.managerMenu === "View Low Inventory") {
            connection.query("SELECT * FROM products WHERE stock_quantity < 5000", function(err,res){
                if (err) throw (err);
                console.table(res);
                start();
            })
        }
        if (userAnswers.managerMenu === "Add to Inventory") {
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
                        inquirer.prompt([
                            {
                                type: "input",
                                name: "inventoryInput",
                                message:"How many would you like to add?"
                            }
                        ])
                        .then(function(userAnswers2){   
                            var newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(userAnswers2.inventoryInput)

                            console.log(chosenItem.product_name);
                            console.log(chosenItem.stock_quantity);
                            console.log(newQuantity);

                            connection.query("UPDATE products SET ? WHERE ?", [chosenItem], [newQuantity], function(err, res){
                                if (err) throw (err);
                                console.log(chosenItem.product_name + "was successfully updated! The total inventory is now " + newQuantity);
                            })
                        })
                    });
            });
        }
        if (userAnswers.managerMenu === "Add New Product") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "addInventory_name",
                    message: "What is the name of this product?"
                },
                {
                    type: "input",
                    name: "addInventory_price",
                    message: "How much is this product?"
                },
                {
                    type: "input",
                    name: "addInventory_department",
                    message: "What category should I put this product in?"
                },
                {
                    type: "input",
                    name: "addInventory_stock",
                    message: "How many do you have in stock?"
                },
            ])
            .then(function(userAnswer){
                var userAdd = [
                    userAnswer.addInventory_name,

                    parseInt(userAnswer.addInventory_price),
                    
                    userAnswer.addInventory_department,

                    parseInt(userAnswer.addInventory_stock)
                ];
                connection.query("INSERT INTO products (product_name, price, department_name, stock_quantity) VALUES (?)", [userAdd], function(err, res) {
                    if (err) throw (err);
                    console.log("Successfully added " + userAnswer.addInventory_name)
                    start();
                });
            }) 
        }
        else if (userAnswers.managerMenu === "Exit Famazon Manager Portal") {
            userEnd();
        }
    });
}

function userEnd() {
    connection.end()
    console.log("Thank you for using the Famazon Manager Portal")
}