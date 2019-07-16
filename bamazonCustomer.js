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

connection.connect(function (err) {
  if (err) {
    console.log("err: " + err)
  }
  console.log("connected as id " + connection.threadId + "\n");
  // once connected, run the readProducts fxn
  readProducts();
});

function readProducts() {
  console.log("Selecting all products.....\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    // instead of grabbing information from table again, promptforid takes the result as parameter
    promptForId(res);
  });
}

// inventory  = whole table
function promptForId(inventory) {
  inquirer
    .prompt([{
        name: "item_id",
        type: "input",
        message: "What is the id of the product you would like to buy?",
        // validates that the response is a number value
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {

      var id = parseInt(answer.item_id);
      // product = whole row resulting from checkinventory fxn
      var product = checkInventory(id, inventory);
      if (product) {
        promptForQuantity(product);
      } else {
        console.log("the item id is invalid");
        readProducts();
      }
    });
}

function checkInventory(id, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === id) {
      // return row of table
      return inventory[i];
    }
  }
  return null;
}

function promptForQuantity(product) {
  inquirer
    .prompt([{
      name: "units",
      type: "input",
      message: "How many units would you like to buy?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }])
    .then(function (answer) {
      var quantity = parseInt(answer.units);
      if (quantity > product.stock_quantity) {
        console.log("insuffient quantity");
        readProducts()
      } else {
        makePurchase(product, quantity);
      }
    });
}

function makePurchase(product, quantity) {
  console.log("make purchase");
  // update stock quantity by referencing item id
  connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id= ?", [quantity, product.item_id], function (err, res) {
    console.log("successfully purchased " + quantity + " " + product.product_name + " which costs: $" + product.price * quantity);
    //readProducts();
  })
}