CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) GENERATED ALWAYS AS (SPLIT_PART(sku, '-', 1)) STORED,
    name VARCHAR(255) not null,
    unitPrice DECIMAL(10,2)
);

CREATE TABLE supplierproduct (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    product_id INT REFERENCES product(id),
    quantity INT (100),
    recorder_level 
);

