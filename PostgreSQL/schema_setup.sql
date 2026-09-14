-- Schema for Grab&Go, reconstructed from backend/components/*.js usage
CREATE TABLE IF NOT EXISTS user_otp (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    otp VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS main_user_table (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS items_list (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    img VARCHAR(500),
    canteen VARCHAR(255),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart (
    user_email VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'created',
    created_at TIMESTAMP DEFAULT NOW()
);
