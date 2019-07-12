var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {console.log("err: " +err)}
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
    //buy();
});

function readProducts() {
    console.log("Selecting all products.....\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptForId(res);
    });
}

function promptForId(inventory) {
    inquirer
      .prompt([
        {
          name: "item_id",
          type: "input",
          message: "What is the id of the product you would like to buy?",
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
    //     connection.query(
    //       "INSERT INTO auctions SET ?",
    //       {
    //         item_name: answer.item,
    //         category: answer.category,
    //         starting_bid: answer.startingBid || 0,
    //         highest_bid: answer.startingBid || 0
    //       },
    //       function(err) {
    //         if (err) throw err;
    //         console.log("Your auction was created successfully!");
        
    //       }
    //     );
    var id = parseInt(answer.item_id);
    var product = checkInventory(id, inventory);
    if(product){
        promptForQuantity(product);
    }
    else{
        console.log("the item id is invalid");
        readProducts();

    }

    });
  }
  function checkInventory(id, inventory){
      for(var i=0; i< inventory.length; i++){
          if(inventory[i].item_id === id){
              return inventory[i];
          }
      }
      return null;

  }

  function promptForQuantity(product){
    inquirer
    .prompt([
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
        var quantity = parseInt(answer.units);
        if(quantity > product.stock_quantity){
            console.log("insuffient quantity");
            readProducts()
        }
        else{
            makePurchase(product, quantity);
        }
    });
  }

  function makePurchase(product, quantity){
      console.log("make purchase");


  }