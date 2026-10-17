from datetime import datetime
import json
from app import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(20), default='customer', nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship('Order', backref='customer', lazy='dynamic')
    reviews = db.relationship('Review', backref='author', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    icon = db.Column(db.String(50), default='Cpu')
    description = db.Column(db.Text, nullable=True)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)

    products = db.relationship('Product', backref='category', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'icon': self.icon,
            'description': self.description,
            'display_order': self.display_order
        }

class Brand(db.Model):
    __tablename__ = 'brands'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    country = db.Column(db.String(80), nullable=True)
    logo = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)

    products = db.relationship('Product', backref='brand', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'country': self.country,
            'logo': self.logo,
            'description': self.description
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.id'), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False, index=True)
    price = db.Column(db.Numeric(12, 2), nullable=False)
    sale_price = db.Column(db.Numeric(12, 2), nullable=True)
    stock_quantity = db.Column(db.Integer, default=0, nullable=False)
    thumbnail = db.Column(db.String(255), nullable=False)
    short_description = db.Column(db.String(300), nullable=True)
    description = db.Column(db.Text, nullable=False)
    specs = db.Column(db.Text, nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_new = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reviews = db.relationship('Review', backref='product', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        parsed_specs = {}
        if self.specs:
            try:
                parsed_specs = json.loads(self.specs)
            except Exception:
                parsed_specs = {}
        return {
            'id': self.id,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else '',
            'brand_id': self.brand_id,
            'brand_name': self.brand.name if self.brand else '',
            'sku': self.sku,
            'name': self.name,
            'slug': self.slug,
            'price': float(self.price),
            'sale_price': float(self.sale_price) if self.sale_price else None,
            'current_price': float(self.sale_price) if self.sale_price else float(self.price),
            'stock_quantity': self.stock_quantity,
            'thumbnail': self.thumbnail,
            'short_description': self.short_description,
            'description': self.description,
            'specs': parsed_specs,
            'is_featured': self.is_featured,
            'is_new': self.is_new,
            'status': self.status
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_code = db.Column(db.String(30), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    recipient_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    shipping_address = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    payment_method = db.Column(db.String(20), default='cod', nullable=False)
    payment_status = db.Column(db.String(20), default='unpaid', nullable=False)
    subtotal = db.Column(db.Numeric(12, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(12, 2), default=0.0, nullable=False)
    shipping_fee = db.Column(db.Numeric(12, 2), default=0.0, nullable=False)
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)
    coupon_code = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='pending', nullable=False)
    stock_restocked = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', lazy='joined', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'order_code': self.order_code,
            'user_id': self.user_id,
            'recipient_name': self.recipient_name,
            'phone': self.phone,
            'email': self.email,
            'shipping_address': self.shipping_address,
            'notes': self.notes,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'subtotal': float(self.subtotal),
            'discount_amount': float(self.discount_amount),
            'shipping_fee': float(self.shipping_fee),
            'total_amount': float(self.total_amount),
            'coupon_code': self.coupon_code,
            'status': self.status,
            'stock_restocked': self.stock_restocked,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    product_sku = db.Column(db.String(50), nullable=False)
    unit_price = db.Column(db.Numeric(12, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Numeric(12, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_sku': self.product_sku,
            'unit_price': float(self.unit_price),
            'quantity': self.quantity,
            'subtotal': float(self.subtotal)
        }

class Coupon(db.Model):
    __tablename__ = 'coupons'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=True)
    discount_type = db.Column(db.String(20), default='percent')
    discount_value = db.Column(db.Numeric(12, 2), nullable=False)
    min_order_value = db.Column(db.Numeric(12, 2), default=0.0)
    max_discount = db.Column(db.Numeric(12, 2), nullable=True)
    usage_limit = db.Column(db.Integer, default=100)
    used_count = db.Column(db.Integer, default=0)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'description': self.description,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_order_value': float(self.min_order_value),
            'max_discount': float(self.max_discount) if self.max_discount else None,
            'usage_limit': self.usage_limit,
            'used_count': self.used_count,
            'is_active': self.is_active
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    is_approved = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'author_name': self.author.name if self.author else 'Khách hàng TechZone',
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
