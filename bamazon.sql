DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("trampoline", "sporting goods", 50.00, 1), ("pajamas", "clothing", 19.99, 5), ("candle", "decor", 5.00, 3), ("table lamp", "decor", 50.00, 2), ("red dress", "clothing", 100, 2), ("pool float", "sporting goods", 30, 2), ("art work", "decor", 159, 4), ("sofa", "furniture", 300, 2), ("bed", "furniture", 500, 1);

select * from products;