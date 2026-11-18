CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    supplier VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) GENERATED ALWAYS AS (SPLIT_PART(sku, '-', 1)) STORED,
    name VARCHAR(255) NOT NULL,
    unitPrice DECIMAL(10,2)
);

CREATE TABLE supplierproduct (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    product_id INT REFERENCES product(id),
    quantity INT,
    recorder_level INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

