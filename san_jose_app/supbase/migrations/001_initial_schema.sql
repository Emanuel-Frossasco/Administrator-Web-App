-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit_type TEXT NOT NULL DEFAULT 'gramos', -- gramos, kilos, unidades
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    delivery_method TEXT NOT NULL, -- retiro, envio
    status TEXT NOT NULL DEFAULT 'pendiente', -- pendiente, preparacion, listo, entregado
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- Admins table (linked to Supabase Auth)
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_active ON products(is_active);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can update products"
    ON products FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can delete products"
    ON products FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Policies for clients (anyone can insert, admins can read all)
CREATE POLICY "Anyone can insert clients"
    ON clients FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all clients"
    ON clients FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Policies for orders (anyone can insert, admins can read/update all)
CREATE POLICY "Anyone can insert orders"
    ON orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admins can update orders"
    ON orders FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Policies for order_items (linked to orders)
CREATE POLICY "Anyone can insert order items"
    ON order_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all order items"
    ON order_items FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Policies for admins (only admins can view)
CREATE POLICY "Admins can view admins"
    ON admins FOR SELECT
    TO authenticated
    USING (id = auth.uid());