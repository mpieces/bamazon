var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
    buy();
});

function readProducts() {
    console.log("Selecting all products.....\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}

function buy() {
    inquirer
      .prompt([
        {
          name: "item_id",
          type: "input",
          message: "What is the id of the product you would like to buy?",
          //loop through and display product id's again?
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "units",
          type: "input",
          message: "How many units would you like to buy?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // when finished prompting, check if store has enough product to meet customer's request
        // if quantity of item with that id < store's quantity, can proceed with transaction
            // show customer total cost of purchase and update store's inventory
        // else, insufficient quantity and prevent order from going through
        connection.query(
          "INSERT INTO auctions SET ?",
          {
            item_name: answer.item,
            category: answer.category,
            starting_bid: answer.startingBid || 0,
            highest_bid: answer.startingBid || 0
          },
          function(err) {
            if (err) throw err;
            console.log("Your auction was created successfully!");
        
          }
        );
      });
  }