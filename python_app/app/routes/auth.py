from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip()
    password = data.get('password', '')
    phone = data.get('phone', '').strip()
    address = data.get('address', '').strip()

    if not email or not password or not name:
        return jsonify({'error': 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email này đã được đăng ký tài khoản'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    # BẢO MẬT: Role luôn là 'customer' khi đăng ký qua form công khai, không cho phép gửi role='admin'
    user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        phone=phone,
        address=address,
        role='customer'
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Đăng ký tài khoản thành công',
        'token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Email hoặc mật khẩu không chính xác'}), 401

    if not user.is_active:
        return jsonify({'error': 'Tài khoản của bạn đã bị vô hiệu hóa'}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Đăng nhập thành công',
        'token': token,
        'user': user.to_dict()
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Người dùng không tồn tại'}), 404
    return jsonify({'user': user.to_dict()})

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Người dùng không tồn tại'}), 404

    data = request.get_json() or {}
    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'address' in data:
        user.address = data['address'].strip()

    db.session.commit()
    return jsonify({'message': 'Cập nhật thông tin thành công', 'user': user.to_dict()})
