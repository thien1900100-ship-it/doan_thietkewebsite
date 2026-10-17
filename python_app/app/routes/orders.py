import random
import string
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models import Product, Order, OrderItem, Coupon, CouponUsage

orders_bp = Blueprint('orders', __name__)

def generate_order_code():
    timestamp = datetime.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"TZ-{timestamp}-{random_str}"

@orders_bp.route('/coupons/validate', methods=['POST'])
def validate_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    order_subtotal = float(data.get('subtotal', 0))

    if not code:
        return jsonify({'error': 'Vui lòng nhập mã giảm giá'}), 400

    coupon = Coupon.query.filter_by(code=code, is_active=True).first()
    now = datetime.utcnow()

    if not coupon:
        return jsonify({'error': 'Mã giảm giá không tồn tại hoặc đã hết hiệu lực'}), 404

    if now < coupon.start_date or now > coupon.end_date:
        return jsonify({'error': 'Mã giảm giá đã hết hạn sử dụng'}), 400

    if coupon.used_count >= coupon.usage_limit:
        return jsonify({'error': 'Mã giảm giá đã đạt giới hạn lượt sử dụng'}), 400

    if order_subtotal < float(coupon.min_order_value):
        return jsonify({
            'error': f"Đơn hàng cần đạt tối thiểu {float(coupon.min_order_value):,.0f}đ để áp dụng mã này"
        }), 400

    # Tính toán mức giảm giá an toàn
    discount = 0.0
    if coupon.discount_type == 'percent':
        discount = order_subtotal * (float(coupon.discount_value) / 100.0)
        if coupon.max_discount and discount > float(coupon.max_discount):
            discount = float(coupon.max_discount)
    else:
        discount = float(coupon.discount_value)

    if discount > order_subtotal:
        discount = order_subtotal

    return jsonify({
        'valid': True,
        'code': coupon.code,
        'description': coupon.description,
        'discount_amount': discount,
        'message': f"Áp dụng thành công mã {coupon.code}"
    })

@orders_bp.route('/orders/checkout', methods=['POST'])
def checkout():
    data = request.get_json() or {}
    recipient_name = data.get('recipient_name', '').strip()
    phone = data.get('phone', '').strip()
    email = data.get('email', '').strip()
    shipping_address = data.get('shipping_address', '').strip()
    notes = data.get('notes', '').strip()
    payment_method = data.get('payment_method', 'cod')
    coupon_code = data.get('coupon_code', '').strip().upper()
    items_data = data.get('items', [])

    if not recipient_name or not phone or not email or not shipping_address:
        return jsonify({'error': 'Vui lòng điền đầy đủ họ tên, số điện thoại, email và địa chỉ nhận hàng'}), 400

    if not items_data or len(items_data) == 0:
        return jsonify({'error': 'Giỏ hàng của bạn đang trống'}), 400

    # Lấy user_id nếu có đăng nhập
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    # BẮT ĐẦU TRANSACTION AN TOÀN
    try:
        subtotal = 0.0
        order_items_to_create = []

        # 1. Duyệt qua từng sản phẩm, kiểm tra tồn kho và lấy giá từ Database (Không tin giá Frontend gửi)
        for item in items_data:
            p_id = item.get('product_id')
            qty = int(item.get('quantity', 1))

            if qty <= 0:
                return jsonify({'error': 'Số lượng mua phải lớn hơn 0'}), 400

            product = Product.query.with_for_update().get(p_id)
            if not product:
                db.session.rollback()
                return jsonify({'error': f'Sản phẩm ID {p_id} không tồn tại'}), 404

            if product.status != 'active':
                db.session.rollback()
                return jsonify({'error': f'Sản phẩm "{product.name}" hiện không mở bán'}), 400

            if product.stock_quantity < qty:
                db.session.rollback()
                return jsonify({
                    'error': f'Sản phẩm "{product.name}" chỉ còn {product.stock_quantity} sản phẩm trong kho. Không thể mua {qty}.'
                }), 400

            # Giá thực tế tại thời điểm mua (ưu tiên sale_price nếu có)
            unit_price = float(product.sale_price) if product.sale_price else float(product.price)
            line_subtotal = unit_price * qty
            subtotal += line_subtotal

            # Trừ tồn kho sản phẩm trong transaction
            product.stock_quantity -= qty

            order_items_to_create.append({
                'product_id': product.id,
                'product_name': product.name,
                'product_sku': product.sku,
                'unit_price': unit_price,
                'quantity': qty,
                'subtotal': line_subtotal
            })

        # 2. Xử lý mã giảm giá nếu có
        discount_amount = 0.0
        applied_coupon = None
        if coupon_code:
            applied_coupon = Coupon.query.filter_by(code=coupon_code, is_active=True).first()
            if applied_coupon and subtotal >= float(applied_coupon.min_order_value):
                if applied_coupon.discount_type == 'percent':
                    discount_amount = subtotal * (float(applied_coupon.discount_value) / 100.0)
                    if applied_coupon.max_discount and discount_amount > float(applied_coupon.max_discount):
                        discount_amount = float(applied_coupon.max_discount)
                else:
                    discount_amount = float(applied_coupon.discount_value)
                applied_coupon.used_count += 1

        # 3. Tính phí vận chuyển (Miễn phí cho đơn từ 1.000.000đ, đơn dưới 1 triệu phí 30.000đ)
        shipping_fee = 0.0 if subtotal >= 1000000 else 30000.0
        total_amount = max(0.0, subtotal - discount_amount + shipping_fee)

        order_code = generate_order_code()
        order = Order(
            order_code=order_code,
            user_id=int(user_id) if user_id else None,
            recipient_name=recipient_name,
            phone=phone,
            email=email,
            shipping_address=shipping_address,
            notes=notes,
            payment_method=payment_method,
            payment_status='unpaid',
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_fee=shipping_fee,
            total_amount=total_amount,
            coupon_code=coupon_code if applied_coupon else None,
            status='pending',
            stock_restocked=False
        )
        db.session.add(order)
        db.session.flush()

        for oi in order_items_to_create:
            item_record = OrderItem(
                order_id=order.id,
                product_id=oi['product_id'],
                product_name=oi['product_name'],
                product_sku=oi['product_sku'],
                unit_price=oi['unit_price'],
                quantity=oi['quantity'],
                subtotal=oi['subtotal']
            )
            db.session.add(item_record)

        if applied_coupon:
            usage = CouponUsage(
                coupon_id=applied_coupon.id,
                order_id=order.id,
                user_id=int(user_id) if user_id else None,
                discount_amount=discount_amount
            )
            db.session.add(usage)

        db.session.commit()

        return jsonify({
            'message': 'Đặt hàng thành công!',
            'order': order.to_dict(),
            'bank_info': {
                'bank_name': 'MB Bank (Ngân hàng Quân Đội)',
                'account_number': '090123456789',
                'account_holder': 'CONG TY TNHH TECHZONE VIET NAM',
                'transfer_note': f"THANHTOAN {order.order_code}",
                'amount': total_amount
            } if payment_method == 'bank_transfer' else None
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Lỗi xử lý đơn hàng: {str(e)}'}), 500

@orders_bp.route('/orders/my-orders', methods=['GET'])
@jwt_required()
def get_my_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]})

@orders_bp.route('/orders/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    user_id = int(get_jwt_identity())
    order = Order.query.get_or_404(order_id)

    if order.user_id != user_id:
        return jsonify({'error': 'Bạn không có quyền hủy đơn hàng này'}), 403

    if order.status not in ['pending', 'confirmed']:
        return jsonify({'error': f'Đơn hàng đang ở trạng thái "{order.status}", không thể tự hủy'}), 400

    try:
        # HOÀN TRẢ TỒN KHO AN TOÀN VÀ IDEMPOTENT (Chỉ hoàn nếu chưa hoàn lần nào)
        if not order.stock_restocked:
            for item in order.items:
                prod = Product.query.with_for_update().get(item.product_id)
                if prod:
                    prod.stock_quantity += item.quantity
            order.stock_restocked = True

        order.status = 'cancelled'
        db.session.commit()
        return jsonify({'message': 'Đã hủy đơn hàng và hoàn lại tồn kho thành công', 'order': order.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Lỗi khi hủy đơn hàng: {str(e)}'}), 500
