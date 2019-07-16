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
    readProducts();
});

// Shows table of all products, same as in customer view
function readProducts() {
    console.log("Selecting all products.....\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        loadManagerOptions(res);
    });
}

function loadManagerOptions(res) {
    inquirer
        .prompt([{
                name: "options",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View products for sale", "View low inventory", "Add to inventory", "Add new product"
                ]
            }

        ])
        .then(function (answer) {
            switch (answer.options) {
                case "View products for sale":
                    console.table(res);
                    readProducts();
                    break;
                case "View low inventory":
                    lowInventory();
                    break;
                case "Add to inventory":
                    addToInventory(res);
                    break;
                case "Add new product":
                    addNewProduct(res);
                    break;
                default:
                    console.log("Enter the correct option");
                    // control C to quit server
                    process.exit(0);
                    break;
            }
        });
}

// To view low inventory items (items with a quantity of 3 or less)
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 3", function (err, res) {
        if (err) throw err;
        console.table(res);
        //readProducts();
    })
}

function addToInventory(res) {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "What is id of item you would like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }])
        .then(function (answer) {
            var id = parseInt(answer.id);
            var product = checkInventory(id, res);
            if (product) {
                promptForQuantity(product);
            } else {
                console.log("the item id is invalid");
                readProducts();
            }
        });
};

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
            message: "How many units would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }])
        .then(function (answer) {
            var quantity = parseInt(answer.units);
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ? ", [product.stock_quantity + quantity, product.item_id], function (err, res) {
            console.log("Successfully added " + quantity + "  " + product.product_name);
            readProducts();
            })
        });
}