import os
from app import create_app, db

app = create_app()

@app.cli.command("init-db")
def init_db():
    """Lệnh CLI khởi tạo database: flask init-db"""
    db.create_all()
    print("Khởi tạo database thành công!")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
