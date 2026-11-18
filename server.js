const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || '127.0.0.1',
  database: process.env.PGDATABASE || 'business_table',
  password: process.env.PGPASSWORD || 'postgres',
  port: Number(process.env.PGPORT) || 5432,
});

// middleware to log requests
function logRequests(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

//routes for retrieving requests
app.post('/api/inventory', logRequests, async (req, res) => {
    const { name, sku, unitPrice } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO product (name, sku, unitPrice) VALUES ($1, $2, $3) RETURNING *',
            [name, sku, unitPrice]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/inventory', logRequests, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM product');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/inventory/:id', logRequests, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product cannot be found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/inventory/:id', logRequests, async (req, res) => {
    const { id } = req.params;
    const { name, sku, unitPrice } = req.body;
    try {
        const result = await pool.query(
            'UPDATE product SET name = $1, sku = $2, unitPrice = $3 WHERE id = $4 RETURNING *',
            [name, sku, unitPrice, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product cannot be found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('api/suppliers', logRequests, async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query('SELECT * FROM suppliers');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.get('api/products', logRequests, async (req, res) => {
    const { id } = req.params;
    const { name, sku, unitPrice } = req.body;
    try {
        const result = await pool.query('SELECT * FROM product');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.get('api/reports/low-stock', logRequests, async (req, res) => {
    const { id } = req.params;
    const { quantity, recorder_level } = req.body;
    try {
        const result = await pool.query('SELECT * FROM supplierproduct WHERE quantity < recorder_level');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/inventory/:id', logRequests, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Product cannot be found' });
        }       else {
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
