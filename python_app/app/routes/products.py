from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Product, Category, Brand, Review, Order, OrderItem

products_bp = Blueprint('products', __name__)

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.filter_by(is_active=True).order_by(Category.display_order.asc()).all()
    return jsonify({'categories': [c.to_dict() for c in categories]})

@products_bp.route('/brands', methods=['GET'])
def get_brands():
    brands = Brand.query.order_by(Brand.name.asc()).all()
    return jsonify({'brands': [b.to_dict() for b in brands]})

@products_bp.route('/products', methods=['GET'])
def get_products():
    query = Product.query.filter(Product.status != 'hidden')

    # Lọc theo danh mục
    category_slug = request.args.get('category')
    category_id = request.args.get('category_id')
    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
    elif category_id:
        query = query.filter(Product.category_id == int(category_id))

    # Lọc theo thương hiệu
    brand_id = request.args.get('brand_id')
    brand_slug = request.args.get('brand')
    if brand_slug:
        b = Brand.query.filter_by(slug=brand_slug).first()
        if b:
            query = query.filter(Product.brand_id == b.id)
    elif brand_id:
        query = query.filter(Product.brand_id == int(brand_id))

    # Lọc theo khoảng giá
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Lọc theo tình trạng còn hàng
    in_stock = request.args.get('in_stock')
    if in_stock in ['true', '1']:
        query = query.filter(Product.stock_quantity > 0)

    # Lọc sản phẩm nổi bật / mới
    if request.args.get('featured') in ['true', '1']:
        query = query.filter(Product.is_featured == True)
    if request.args.get('new') in ['true', '1']:
        query = query.filter(Product.is_new == True)

    # Tìm kiếm theo từ khóa
    keyword = request.args.get('q', '').strip()
    if keyword:
        query = query.filter(
            (Product.name.ilike(f'%{keyword}%')) |
            (Product.short_description.ilike(f'%{keyword}%')) |
            (Product.sku.ilike(f'%{keyword}%'))
        )

    # Sắp xếp
    sort = request.args.get('sort', 'default')
    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'newest':
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.is_featured.desc(), Product.id.asc())

    # Phân trang
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'products': [p.to_dict() for p in paginated.items],
        'total': paginated.total,
        'page': paginated.page,
        'pages': paginated.pages,
        'per_page': per_page
    })

@products_bp.route('/products/<slug_or_id>', methods=['GET'])
def get_product_detail(slug_or_id):
    if slug_or_id.isdigit():
        product = Product.query.get(int(slug_or_id))
    else:
        product = Product.query.filter_by(slug=slug_or_id).first()

    if not product:
        return jsonify({'error': 'Không tìm thấy sản phẩm'}), 404

    reviews = Review.query.filter_by(product_id=product.id, is_approved=True).order_by(Review.created_at.desc()).all()
    related = Product.query.filter(
        Product.category_id == product.category_id,
        Product.id != product.id,
        Product.status == 'active'
    ).limit(4).all()

    return jsonify({
        'product': product.to_dict(),
        'reviews': [r.to_dict() for r in reviews],
        'related_products': [rp.to_dict() for rp in related]
    })

@products_bp.route('/products/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def create_product_review(product_id):
    user_id = get_jwt_identity()
    product = Product.query.get_or_404(product_id)

    data = request.get_json() or {}
    rating = data.get('rating')
    comment = data.get('comment', '').strip()

    if not rating or not (1 <= int(rating) <= 5):
        return jsonify({'error': 'Điểm đánh giá phải từ 1 đến 5 sao'}), 400
    if not comment:
        return jsonify({'error': 'Vui lòng nhập nội dung nhận xét'}), 400

    # KIỂM TRA ĐIỀU KIỆN: Người dùng chỉ được đánh giá nếu đã từng mua và nhận hàng
    has_purchased = db.session.query(OrderItem).join(Order).filter(
        Order.user_id == user_id,
        Order.status.in_(['delivered', 'shipping', 'confirmed']),
        OrderItem.product_id == product_id
    ).first()

    if not has_purchased:
        return jsonify({'error': 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng thành công.'}), 403

    existing_review = Review.query.filter_by(product_id=product_id, user_id=user_id).first()
    if existing_review:
        existing_review.rating = int(rating)
        existing_review.comment = comment
        db.session.commit()
        return jsonify({'message': 'Cập nhật đánh giá thành công', 'review': existing_review.to_dict()})

    review = Review(
        product_id=product_id,
        user_id=user_id,
        rating=int(rating),
        comment=comment,
        is_approved=True
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Gửi đánh giá thành công', 'review': review.to_dict()}), 201
