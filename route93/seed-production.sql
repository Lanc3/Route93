-- Route93 Production Database Seed Script
-- Run this directly against your production PostgreSQL database

-- Clear existing data (optional - uncomment if you want to start fresh)
-- TRUNCATE TABLE reviews, payments, order_items, orders, cart_items, addresses, users, product_collections, products, categories, collections RESTART IDENTITY CASCADE;

-- Insert Categories
INSERT INTO categories (name, description, slug, image, "createdAt", "updatedAt") VALUES
('Electronics', 'Latest electronic devices and gadgets', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', NOW(), NOW()),
('Clothing', 'Fashion and apparel for all occasions', 'clothing', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', NOW(), NOW()),
('Home & Garden', 'Everything for your home and garden', 'home-garden', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', NOW(), NOW()),
('Sports & Outdoor', 'Gear for sports and outdoor activities', 'sports-outdoor', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Collections
INSERT INTO collections (name, description, slug, image, "isActive", "createdAt", "updatedAt") VALUES
('Featured Products', 'Our handpicked featured products', 'featured', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', true, NOW(), NOW()),
('New Arrivals', 'Latest products in our store', 'new-arrivals', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', true, NOW(), NOW()),
('Best Sellers', 'Most popular products', 'best-sellers', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO products (name, description, price, "salePrice", sku, slug, status, inventory, images, tags, "categoryId", "createdAt", "updatedAt") VALUES
('Wireless Bluetooth Headphones', 'Premium quality wireless headphones with noise cancellation', 199.99, 149.99, 'WBH-001', 'wireless-bluetooth-headphones', 'ACTIVE', 50, '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"]', '["electronics", "audio", "wireless", "bluetooth"]', 1, NOW(), NOW()),
('Premium Cotton T-Shirt', 'Comfortable 100% organic cotton t-shirt', 29.99, NULL, 'PCT-001', 'premium-cotton-t-shirt', 'ACTIVE', 100, '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"]', '["clothing", "cotton", "casual", "comfortable"]', 2, NOW(), NOW()),
('Smart Home Security Camera', 'HD security camera with night vision and mobile app', 129.99, 99.99, 'SHSC-001', 'smart-home-security-camera', 'ACTIVE', 25, '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400"]', '["electronics", "security", "smart-home", "camera"]', 3, NOW(), NOW()),
('Running Shoes', 'Lightweight running shoes with superior comfort', 89.99, NULL, 'RS-001', 'running-shoes', 'ACTIVE', 75, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400"]', '["sports", "running", "shoes", "comfortable"]', 4, NOW(), NOW()),
('Smartphone Case', 'Protective case with premium materials', 24.99, 19.99, 'SC-001', 'smartphone-case', 'ACTIVE', 200, '["https://images.unsplash.com/photo-1601593346740-925612772716?w=400"]', '["electronics", "accessories", "protection", "smartphone"]', 1, NOW(), NOW()),
('Denim Jeans', 'Classic fit denim jeans for everyday wear', 59.99, NULL, 'DJ-001', 'denim-jeans', 'ACTIVE', 80, '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400"]', '["clothing", "denim", "jeans", "casual"]', 2, NOW(), NOW())
ON CONFLICT (sku) DO NOTHING;

-- Insert Users (with hashed passwords)
-- Note: These are example hashed passwords - in production you should generate proper ones
INSERT INTO users (email, name, role, phone, "hashedPassword", salt, "createdAt", "updatedAt") VALUES
('admin@route93.com', 'Admin User', 'ADMIN', '+1-555-0123', '$2a$10$example.hash.for.admin123', 'admin123salt', NOW(), NOW()),
('customer@route93.com', 'John Customer', 'CLIENT', '+1-555-0456', '$2a$10$example.hash.for.customer123', 'customer123salt', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Addresses
INSERT INTO addresses ("firstName", "lastName", "address1", city, state, "zipCode", country, phone, "isDefault", "userId", "createdAt", "updatedAt") VALUES
('John', 'Customer', '123 Main Street', 'Anytown', 'CA', '12345', 'US', '+1-555-0456', true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Link Products to Collections
INSERT INTO product_collections ("productId", "collectionId") VALUES
(1, 1), -- Wireless Headphones -> Featured
(2, 1), -- Cotton T-Shirt -> Featured
(3, 2), -- Security Camera -> New Arrivals
(4, 3), -- Running Shoes -> Best Sellers
(5, 1), -- Smartphone Case -> Featured
(6, 3)  -- Denim Jeans -> Best Sellers
ON CONFLICT ("productId", "collectionId") DO NOTHING;

-- Insert Sample Reviews
INSERT INTO reviews (rating, title, comment, "isVerified", "userId", "productId", "createdAt", "updatedAt") VALUES
(5, 'Excellent headphones!', 'Great sound quality and very comfortable. Battery life is amazing.', true, 2, 1, NOW(), NOW()),
(4, 'Good quality t-shirt', 'Soft cotton, fits well. Would buy again.', true, 2, 2, NOW(), NOW()),
(5, 'Great security camera', 'Easy to set up and the night vision works perfectly.', true, 2, 3, NOW(), NOW())
ON CONFLICT ("userId", "productId") DO NOTHING;

-- Display summary
SELECT 
    'Database seeded successfully!' as message,
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM collections) as collections_count,
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM addresses) as addresses_count,
    (SELECT COUNT(*) FROM reviews) as reviews_count;

-- Test account credentials:
-- Admin: admin@route93.com (password: admin123)
-- Customer: customer@route93.com (password: customer123)

