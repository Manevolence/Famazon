DROP DATABASE IF EXISTS famazon_db;
CREATE DATABASE famazon_db;

USE famazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price INT(3),
    stock_quantity INT(3), 
    PRIMARY KEY (item_id)
);

-----------------------------------


------------------------------------


