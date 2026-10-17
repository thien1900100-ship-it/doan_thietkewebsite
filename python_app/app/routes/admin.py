import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app import db
from app.models import User, Product, Category, Brand, Order, OrderItem, Coupon

admin_bp = Blueprint('admin', __name__)

def check_admin_permission():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return False, jsonify({'error': 'Yêu cầu quyền Quản trị viên (Admin)'}), 403
    return True, None, 200

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    total_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        Order.status != 'cancelled'
    ).scalar()

    total_orders = Order.query.count()
    total_customers = User.query.filter_by(role='customer').count()
    total_products = Product.query.count()

    low_stock_products = Product.query.filter(
        Product.stock_quantity <= 10,
        Product.status != 'hidden'
    ).order_by(Product.stock_quantity.asc()).limit(8).all()

    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(8).all()

    # Thống kê đơn hàng theo trạng thái
    status_counts = db.session.query(
        Order.status, func.count(Order.id)
    ).group_by(Order.status).all()

    return jsonify({
        'total_revenue': float(total_revenue),
        'total_orders': total_orders,
        'total_customers': total_customers,
        'total_products': total_products,
        'low_stock_products': [p.to_dict() for p in low_stock_products],
        'recent_orders': [o.to_dict() for o in recent_orders],
        'orders_by_status': {status: count for status, count in status_counts}
    })

# --- CRUD SẢN PHẨM ---
@admin_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    data = request.get_json() or {}
    name = data.get('name', '').strip()
    sku = data.get('sku', '').strip().upper()
    slug = data.get('slug', '').strip().lower()
    price = float(data.get('price', 0))
    sale_price = float(data.get('sale_price')) if data.get('sale_price') else None
    stock = int(data.get('stock_quantity', 0))
    cat_id = int(data.get('category_id', 0))
    brand_id = int(data.get('brand_id', 0))
    thumbnail = data.get('thumbnail', '').strip()
    desc = data.get('description', '').strip()
    specs = data.get('specs', {})

    if not name or not sku or not slug or not thumbnail:
        return jsonify({'error': 'Vui lòng cung cấp đầy đủ tên, mã SKU, slug và ảnh đại diện'}), 400

    # KIỂM TRA DỮ LIỆU ĐẦU VÀO: Giá và tồn kho không được âm
    if price < 0 or (sale_price is not None and sale_price < 0):
        return jsonify({'error': 'Giá bán sản phẩm không được là số âm'}), 400
    if stock < 0:
        return jsonify({'error': 'Số lượng tồn kho không được là số âm'}), 400

    if Product.query.filter_by(sku=sku).first():
        return jsonify({'error': f'Mã SKU "{sku}" đã tồn tại'}), 400

    product = Product(
        name=name,
        sku=sku,
        slug=slug,
        price=price,
        sale_price=sale_price,
        stock_quantity=stock,
        category_id=cat_id,
        brand_id=brand_id,
        thumbnail=thumbnail,
        short_description=data.get('short_description', ''),
        description=desc,
        specs=json.dumps(specs, ensure_ascii=False) if specs else None,
        is_featured=bool(data.get('is_featured', False)),
        is_new=bool(data.get('is_new', False)),
        status=data.get('status', 'active')
    )
    db.session.add(product)
    db.session.commit()

    return jsonify({'message': 'Thêm sản phẩm thành công', 'product': product.to_dict()}), 201

@admin_bp.route('/products/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    product = Product.query.get_or_404(id)
    data = request.get_json() or {}

    if 'name' in data and data['name'].strip():
        product.name = data['name'].strip()
    if 'price' in data:
        p = float(data['price'])
        if p < 0:
            return jsonify({'error': 'Giá bán không được âm'}), 400
        product.price = p
    if 'sale_price' in data:
        sp = float(data['sale_price']) if data['sale_price'] is not None else None
        if sp is not None and sp < 0:
            return jsonify({'error': 'Giá khuyến mãi không được âm'}), 400
        product.sale_price = sp
    if 'stock_quantity' in data:
        s = int(data['stock_quantity'])
        if s < 0:
            return jsonify({'error': 'Tồn kho không được âm'}), 400
        product.stock_quantity = s
    if 'category_id' in data:
        product.category_id = int(data['category_id'])
    if 'brand_id' in data:
        product.brand_id = int(data['brand_id'])
    if 'thumbnail' in data and data['thumbnail'].strip():
        product.thumbnail = data['thumbnail'].strip()
    if 'description' in data:
        product.description = data['description']
    if 'status' in data:
        product.status = data['status']
    if 'is_featured' in data:
        product.is_featured = bool(data['is_featured'])
    if 'is_new' in data:
        product.is_new = bool(data['is_new'])
    if 'specs' in data:
        product.specs = json.dumps(data['specs'], ensure_ascii=False)

    db.session.commit()
    return jsonify({'message': 'Cập nhật sản phẩm thành công', 'product': product.to_dict()})

@admin_bp.route('/products/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    product = Product.query.get_or_404(id)
    # Kiểm tra xem sản phẩm đã có trong đơn hàng nào chưa
    has_orders = OrderItem.query.filter_by(product_id=id).first()
    if has_orders:
        # Nếu đã có đơn hàng thì chuyển trạng thái ẩn để bảo toàn dữ liệu lịch sử
        product.status = 'hidden'
        db.session.commit()
        return jsonify({'message': 'Sản phẩm đã có đơn hàng tham chiếu nên đã được ẩn khỏi cửa hàng thay vì xóa cứng.'})

    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Xóa sản phẩm thành công'})

# --- QUẢN LÝ ĐƠN HÀNG ---
@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_all_orders():
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    status = request.args.get('status')
    keyword = request.args.get('q', '').strip()

    query = Order.query
    if status:
        query = query.filter_by(status=status)
    if keyword:
        query = query.filter(
            (Order.order_code.ilike(f'%{keyword}%')) |
            (Order.recipient_name.ilike(f'%{keyword}%')) |
            (Order.phone.ilike(f'%{keyword}%'))
        )

    orders = query.order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]})

@admin_bp.route('/orders/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(id):
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    order = Order.query.get_or_404(id)
    data = request.get_json() or {}
    new_status = data.get('status')

    if new_status not in ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']:
        return jsonify({'error': 'Trạng thái đơn hàng không hợp lệ'}), 400

    # Nếu đổi sang cancelled và chưa hoàn kho -> Hoàn lại kho
    if new_status == 'cancelled' and not order.stock_restocked:
        for item in order.items:
            prod = Product.query.get(item.product_id)
            if prod:
                prod.stock_quantity += item.quantity
        order.stock_restocked = True

    # Nếu đơn hàng trước đó bị cancelled đã hoàn kho, nay kích hoạt lại -> Trừ lại kho
    elif order.status == 'cancelled' and new_status != 'cancelled' and order.stock_restocked:
        for item in order.items:
            prod = Product.query.get(item.product_id)
            if prod and prod.stock_quantity >= item.quantity:
                prod.stock_quantity -= item.quantity
        order.stock_restocked = False

    order.status = new_status
    if new_status == 'delivered':
        order.payment_status = 'paid'

    db.session.commit()
    return jsonify({'message': f'Cập nhật trạng thái đơn hàng thành "{new_status}"', 'order': order.to_dict()})

# --- QUẢN LÝ KHÁCH HÀNG ---
@admin_bp.route('/customers', methods=['GET'])
@jwt_required()
def get_customers():
    is_admin, err_resp, code = check_admin_permission()
    if not is_admin:
        return err_resp, code

    customers = User.query.filter_by(role='customer').order_by(User.created_at.desc()).all()
    return jsonify({'customers': [c.to_dict() for c in customers]})
