CREATE DATABASE pet_shop_dn;
USE pet_shop_dn;

-- Tạo bảng
CREATE TABLE danh_muc (
    ma_danh_muc INT AUTO_INCREMENT PRIMARY KEY,
    ten_danh_muc VARCHAR(100),
    mo_ta VARCHAR(500),
    trang_thai BOOLEAN DEFAULT TRUE
);

CREATE TABLE thuong_hieu (
    ma_thuong_hieu INT AUTO_INCREMENT PRIMARY KEY,
    ten_thuong_hieu VARCHAR(50)
);

CREATE TABLE kich_co (
    ma_kich_co INT AUTO_INCREMENT PRIMARY KEY,
    ten_kich_co VARCHAR(50)
);

CREATE TABLE loai_san_pham (
    ma_loai INT AUTO_INCREMENT PRIMARY KEY,
    ten_loai_san_pham VARCHAR(50),
    loai INT,
    ma_danh_muc INT,
    FOREIGN KEY (ma_danh_muc) REFERENCES danh_muc(ma_danh_muc)
);

CREATE TABLE san_pham (
    ma_san_pham INT AUTO_INCREMENT PRIMARY KEY,
    ten_san_pham VARCHAR(500),
    mo_ta TEXT,
    hinh_anh VARCHAR(200),
    ngay_tao DATETIME,
    gia_san_pham DECIMAL(10,2),
    ma_loai INT,
    ma_kich_co INT,
    ma_thuong_hieu INT,
    ton_kho INT,
    FOREIGN KEY (ma_loai) REFERENCES loai_san_pham(ma_loai),
    FOREIGN KEY (ma_kich_co) REFERENCES kich_co(ma_kich_co),
    FOREIGN KEY (ma_thuong_hieu) REFERENCES thuong_hieu(ma_thuong_hieu)
);

CREATE TABLE vai_tro (
    ma_vai_tro INT AUTO_INCREMENT PRIMARY KEY,
    ten_vai_tro VARCHAR(50)
);

CREATE TABLE tinh (ma_tinh INT AUTO_INCREMENT PRIMARY KEY, ten_tinh VARCHAR(50));
CREATE TABLE huyen (ma_huyen INT AUTO_INCREMENT PRIMARY KEY, ten_huyen VARCHAR(50), ma_tinh INT, FOREIGN KEY (ma_tinh) REFERENCES tinh(ma_tinh));
CREATE TABLE xa (ma_xa INT AUTO_INCREMENT PRIMARY KEY, ten_xa VARCHAR(50), ma_huyen INT, FOREIGN KEY (ma_huyen) REFERENCES huyen(ma_huyen));

CREATE TABLE nguoi_dung (
    ma_tai_khoan INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(50),
    gmail VARCHAR(255),
    ten_tai_khoan VARCHAR(50),
    mat_khau VARCHAR(255),
    ngay_tao DATE,
    vai_tro INT,
    ngay_sinh DATE,
    gioi_tinh BOOLEAN,
    cccd VARCHAR(12),
    sdt VARCHAR(10),
    trang_thai BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (vai_tro) REFERENCES vai_tro(ma_vai_tro)
);

CREATE TABLE dia_chi (
    ma_dia_chi INT AUTO_INCREMENT PRIMARY KEY,
    ghi_chu VARCHAR(500),
    ma_tai_khoan INT,
    ma_tinh INT,
    ma_huyen INT,
    ma_xa INT,
    FOREIGN KEY (ma_tai_khoan) REFERENCES nguoi_dung(ma_tai_khoan),
    FOREIGN KEY (ma_tinh) REFERENCES tinh(ma_tinh),
    FOREIGN KEY (ma_huyen) REFERENCES huyen(ma_huyen),
    FOREIGN KEY (ma_xa) REFERENCES xa(ma_xa)
);

CREATE TABLE khuyen_mai (
    ma_khuyen_mai INT AUTO_INCREMENT PRIMARY KEY,
    ten_khuyen_mai VARCHAR(50),
    giam_gia DECIMAL(5,2),
    ngay_tao DATETIME,
    ngay_het_han DATETIME
);

CREATE TABLE hoa_don (
    ma_hoa_don INT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_khoan INT,
    ma_khuyen_mai INT,
    ma_dia_chi INT,
    ngay_tao DATETIME,
    tong_tien DECIMAL(10,2),
    loai BOOLEAN,
    trang_thai VARCHAR(50) DEFAULT 'Chờ xử lý',
    FOREIGN KEY (ma_tai_khoan) REFERENCES nguoi_dung(ma_tai_khoan),
    FOREIGN KEY (ma_khuyen_mai) REFERENCES khuyen_mai(ma_khuyen_mai),
    FOREIGN KEY (ma_dia_chi) REFERENCES dia_chi(ma_dia_chi)
);

CREATE TABLE chi_tiet_hoa_don (
    ma_san_pham INT,
    ma_hoa_don INT,
    so_luong INT,
    don_gia DECIMAL(10,2),
    PRIMARY KEY(ma_san_pham, ma_hoa_don),
    FOREIGN KEY(ma_san_pham) REFERENCES san_pham(ma_san_pham),
    FOREIGN KEY(ma_hoa_don) REFERENCES hoa_don(ma_hoa_don)
);

CREATE TABLE thanh_toan (
    ma_thanh_toan INT AUTO_INCREMENT PRIMARY KEY,
    ma_hoa_don INT,
    ma_giao_dich INT,
    so_tien DECIMAL(10,2),
    phuong_thuc_thanh_toan VARCHAR(50),
    trang_thai VARCHAR(50),
    ngay_tao DATETIME,
    FOREIGN KEY (ma_hoa_don) REFERENCES hoa_don(ma_hoa_don)
);

CREATE TABLE tin_nhan (
    ma_tai_khoan_gui INT,
    ma_tai_khoan_nhan INT,
    ngay_nhan DATETIME,
    noi_dung VARCHAR(500),
    PRIMARY KEY(ma_tai_khoan_gui, ma_tai_khoan_nhan, ngay_nhan),
    FOREIGN KEY(ma_tai_khoan_gui) REFERENCES nguoi_dung(ma_tai_khoan),
    FOREIGN KEY(ma_tai_khoan_nhan) REFERENCES nguoi_dung(ma_tai_khoan)
);

-- Thêm dữ liệu mẫu
INSERT INTO danh_muc (ten_danh_muc, mo_ta, trang_thai) VALUES 
('Thức ăn cho thú cưng', 'Tất cả các loại thức ăn dành cho chó mèo', TRUE),
('Phụ kiện thú cưng', 'Các đồ dùng, phụ kiện cho thú cưng', TRUE);

INSERT INTO thuong_hieu (ten_thuong_hieu) VALUES 
('Royal Canin'), 
('Pedigree'), 
('Whiskas');

INSERT INTO kich_co(ten_kich_co) VALUES 
('100g'), 
('500g'), 
('1KG');

INSERT INTO loai_san_pham (ten_loai_san_pham, loai, ma_danh_muc) VALUES  
('Thức ăn khô', 11, 1), 
('Thức ăn ướt', 12, 1), 
('Phụ kiện', 6, 2);

INSERT INTO san_pham (ten_san_pham, mo_ta, hinh_anh, ngay_tao, gia_san_pham, ma_loai, ma_kich_co, ma_thuong_hieu, ton_kho) VALUES	
('Thức ăn khô cho chó Royal Canin', 'Thức ăn khô cao cấp dành cho chó trưởng thành', '/assets/dog-food-1.png', '2025-01-01', 250000.00, 1, 3, 1, 50),
('Pate cho mèo Whiskas vị cá ngừ', 'Pate mềm thơm ngon cho mèo mọi lứa tuổi', '/assets/cat-food-1.png', '2025-01-01', 35000.00, 2, 1, 3, 100);

INSERT INTO vai_tro (ten_vai_tro) VALUES 
('Khách hàng'), 
('Admin'),
('Nhân viên');

INSERT INTO tinh (ten_tinh) VALUES 
('Hà Nội'), 
('Hồ Chí Minh');

INSERT INTO huyen (ten_huyen, ma_tinh) VALUES 
('Quận Ba Đình', 1), 
('Quận 1', 2);

INSERT INTO xa (ten_xa, ma_huyen) VALUES 
('Phường Phúc Xá', 1), 
('Phường Bến Nghé', 2);

INSERT INTO nguoi_dung (ten, gmail, ten_tai_khoan, mat_khau, ngay_tao, vai_tro, ngay_sinh, gioi_tinh, cccd, sdt, trang_thai) VALUES 
('Admin System', 'admin@petshop.com', 'admin', '123456', '2025-01-01', 2, '1990-01-01', TRUE, '123456789012', '0123456789', TRUE),
('Nguyễn Văn An', 'customer1@gmail.com', 'customer1', '123456', '2025-01-01', 1, '1995-05-15', TRUE, '098765432109', '0987654321', TRUE),
('Trần Thị Hoa', 'employee1@petshop.com', 'employee1', '123456', '2025-01-15', 3, '1992-03-20', FALSE, '111222333444', '0912345678', TRUE),
('Lê Văn Nam', 'employee2@petshop.com', 'employee2', '123456', '2025-01-20', 3, '1988-07-10', TRUE, '555666777888', '0934567890', TRUE);

INSERT INTO dia_chi (ghi_chu, ma_tai_khoan, ma_tinh, ma_huyen, ma_xa) VALUES 
('Số 123 Đường ABC', 1, 1, 1, 1), 
('Số 456 Đường XYZ', 2, 2, 2, 2),
('Số 789 Đường DEF', 3, 1, 1, 1), 
('Số 321 Đường GHI', 4, 2, 2, 2);

INSERT INTO khuyen_mai (ten_khuyen_mai, giam_gia, ngay_tao, ngay_het_han) VALUES 
('Giảm giá 10%', 10.00, '2025-01-01 00:00:00', '2025-12-31 23:59:59');