-- 1. TẠO DATABASE (Chạy dòng này trước, sau đó bôi đen các dòng dưới chạy sau)
CREATE DATABASE HR_Management_Demo;
GO
USE HR_Management_Demo;
GO

-- =========================================================================
-- PHẦN 1: TẠO BẢNG & RÀNG BUỘC (CONSTRAINTS)
-- =========================================================================

-- Bảng 1: Phòng Ban (Departments)
CREATE TABLE Departments (
    DepartmentId VARCHAR(10) PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100),
    CONSTRAINT UQ_DepartmentName UNIQUE (DepartmentName) -- Ràng buộc: Tên phòng ban không được trùng nhau
);

-- Bảng 2: Chức Vụ (Positions)
CREATE TABLE Positions (
    PositionId VARCHAR(10) PRIMARY KEY,
    PositionName NVARCHAR(100) NOT NULL,
    BaseSalary DECIMAL(18, 2) NOT NULL,
    CONSTRAINT CHK_BaseSalary CHECK (BaseSalary >= 0) -- Ràng buộc: Lương cơ bản không được âm
);

-- Bảng 3: Nhân Viên (Employees)
CREATE TABLE Employees (
    -- Khóa chính với format tự định nghĩa: NV_So_ChuCaiDauTen
    EmployeeId VARCHAR(20) PRIMARY KEY, 
    
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15),
    
    -- Khóa ngoại kết nối với Phòng ban và Chức vụ
    DepartmentId VARCHAR(10) NOT NULL,
    PositionId VARCHAR(10) NOT NULL,
    
    HireDate DATE NOT NULL,
    Status NVARCHAR(50) DEFAULT N'Đang hoạt động', -- Trạng thái mặc định
    
    -- CÁC RÀNG BUỘC (CONSTRAINTS)
    CONSTRAINT UQ_EmployeeEmail UNIQUE (Email), -- Ràng buộc: Email mỗi người là duy nhất
    CONSTRAINT FK_Employee_Department FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT FK_Employee_Position FOREIGN KEY (PositionId) REFERENCES Positions(PositionId),
    CONSTRAINT CHK_Status CHECK (Status IN (N'Đang hoạt động', N'Nghỉ phép', N'Đã nghỉ việc')) -- Ràng buộc: Trạng thái chỉ được nằm trong 3 chữ này
);
GO

-- =========================================================================
-- PHẦN 2: THÊM DỮ LIỆU (SEED DATA)
-- =========================================================================

-- 1. Thêm dữ liệu Phòng ban
INSERT INTO Departments (DepartmentId, DepartmentName, Location) VALUES
('DEP_IT', N'Công Nghệ Thông Tin', N'Tầng 3 - Tòa nhà A'),
('DEP_HR', N'Hành Chính Nhân Sự', N'Tầng 2 - Tòa nhà A'),
('DEP_MKT', N'Marketing & Sales', N'Tầng 4 - Tòa nhà B'),
('DEP_ACC', N'Kế Toán Tài Chính', N'Tầng 2 - Tòa nhà A'),
('DEP_BOD', N'Ban Giám Đốc', N'Tầng 5 - Tòa nhà A');

-- 2. Thêm dữ liệu Chức vụ (Dựa trên ảnh UI của bạn)
INSERT INTO Positions (PositionId, PositionName, BaseSalary) VALUES
('POS_NET', N'.NET Dev', 25000000),
('POS_AI', N'AI Engineer', 35000000),
('POS_FE', N'Frontend Dev', 22000000),
('POS_DEVOPS', N'DevOps', 30000000),
('POS_INTERN', N'Thực tập sinh', 5000000),
('POS_MGR', N'Trưởng Phòng', 40000000),
('POS_STAFF', N'Chuyên viên', 15000000),
('POS_CEO', N'Giám đốc', 80000000);

-- 3. Thêm dữ liệu Nhân viên (Đúng Format: NV_MãSố_ChữCáiĐầuTên)
-- Lấy đúng 6 người trong ảnh UI của bạn lên đầu tiên!
INSERT INTO Employees (EmployeeId, FullName, Email, PhoneNumber, DepartmentId, PositionId, HireDate, Status) VALUES
('NV_01_T', N'Nguyễn Tất Thắng', 'thang.nt@erp.vn', '0901111111', 'DEP_IT', 'POS_NET', '2022-01-15', N'Đang hoạt động'),
('NV_02_H', N'Bảo Hân Nguyễn', 'han.nb@erp.vn', '0902222222', 'DEP_IT', 'POS_AI', '2023-03-01', N'Đang hoạt động'),
('NV_03_C', N'Trần Văn C', 'c.tv@erp.vn', '0903333333', 'DEP_IT', 'POS_INTERN', '2024-01-10', N'Đang hoạt động'),
('NV_04_D', N'Lê Thị D', 'd.lt@erp.vn', '0904444444', 'DEP_IT', 'POS_FE', '2022-06-20', N'Đang hoạt động'),
('NV_05_E', N'Phạm Minh E', 'e.pm@erp.vn', '0905555555', 'DEP_IT', 'POS_NET', '2021-11-11', N'Nghỉ phép'), -- Trong ảnh ghi Offline, map sang Nghỉ phép
('NV_06_F', N'Hoàng Văn F', 'f.hv@erp.vn', '0906666666', 'DEP_IT', 'POS_DEVOPS', '2023-08-05', N'Đang hoạt động'),

-- Thêm 14 người khác cho các phòng ban khác để Data phong phú
('NV_07_L', N'Ngô Quý Lâm', 'lam.nq@erp.vn', '0917777777', 'DEP_BOD', 'POS_CEO', '2020-01-01', N'Đang hoạt động'),
('NV_08_M', N'Đinh Tuấn Mạnh', 'manh.dt@erp.vn', '0918888888', 'DEP_HR', 'POS_MGR', '2020-05-15', N'Đang hoạt động'),
('NV_09_A', N'Nguyễn Mai Anh', 'anh.nm@erp.vn', '0919999999', 'DEP_HR', 'POS_STAFF', '2023-02-14', N'Đang hoạt động'),
('NV_10_B', N'Trần Thanh Bình', 'binh.tt@erp.vn', '0920000000', 'DEP_HR', 'POS_INTERN', '2024-02-01', N'Đã nghỉ việc'),
('NV_11_K', N'Vũ Trung Kiên', 'kien.vt@erp.vn', '0931111111', 'DEP_MKT', 'POS_MGR', '2021-07-20', N'Đang hoạt động'),
('NV_12_H', N'Lê Thị Hoa', 'hoa.lt@erp.vn', '0932222222', 'DEP_MKT', 'POS_STAFF', '2022-09-09', N'Đang hoạt động'),
('NV_13_D', N'Phạm Văn Đạt', 'dat.pv@erp.vn', '0933333333', 'DEP_MKT', 'POS_STAFF', '2023-11-11', N'Đang hoạt động'),
('NV_14_T', N'Hoàng Thanh Trúc', 'truc.ht@erp.vn', '0944444444', 'DEP_ACC', 'POS_MGR', '2020-10-10', N'Đang hoạt động'),
('NV_15_Q', N'Bùi Hồng Quân', 'quan.bh@erp.vn', '0945555555', 'DEP_ACC', 'POS_STAFF', '2021-12-01', N'Nghỉ phép'),
('NV_16_P', N'Đỗ Minh Phương', 'phuong.dm@erp.vn', '0946666666', 'DEP_ACC', 'POS_STAFF', '2023-04-30', N'Đang hoạt động'),
('NV_17_S', N'Trịnh Thái Sơn', 'son.tt@erp.vn', '0957777777', 'DEP_IT', 'POS_FE', '2023-05-05', N'Đang hoạt động'),
('NV_18_V', N'Lý Quý Vy', 'vy.lq@erp.vn', '0958888888', 'DEP_HR', 'POS_STAFF', '2024-01-20', N'Đang hoạt động'),
('NV_19_N', N'Châu Tinh Ngân', 'ngan.ct@erp.vn', '0959999999', 'DEP_MKT', 'POS_INTERN', '2024-03-01', N'Đang hoạt động'),
('NV_20_G', N'Lâm Trường Giang', 'giang.lt@erp.vn', '0960000000', 'DEP_IT', 'POS_AI', '2022-08-15', N'Đã nghỉ việc');
GO

-- =========================================================================
-- KIỂM TRA DỮ LIỆU (Chạy câu lệnh JOIN này để xem thành quả)
-- =========================================================================
SELECT 
    e.EmployeeId AS [Mã NV],
    e.FullName AS [Họ và Tên],
    p.PositionName AS [Chức vụ],
    d.DepartmentName AS [Phòng ban],
    e.Status AS [Trạng thái]
FROM Employees e
JOIN Departments d ON e.DepartmentId = d.DepartmentId
JOIN Positions p ON e.PositionId = p.PositionId
ORDER BY e.EmployeeId;

delete from Employees where EmployeeId ='ádasd';

USE HR_Management_Demo;
GO
-- 2. Thêm 3 cột phục vụ Đăng nhập & Phân quyền vào bảng Employees
ALTER TABLE Employees 
ADD 
    Username VARCHAR(50),
    PasswordHash NVARCHAR(255),
    Role VARCHAR(20) DEFAULT 'Employee';
GO
UPDATE Employees 
SET Username = Email 
WHERE Username IS NULL;
GO
-- Bước 2: Bây giờ tạo lại ràng buộc UNIQUE sẽ thành công 100%
ALTER TABLE Employees
ADD CONSTRAINT UQ_EmployeeUsername UNIQUE (Username);
GO
-- 3. Tạo ràng buộc (Constraint) để Username không được phép trùng nhau
ALTER TABLE Employees
ADD CONSTRAINT UQ_EmployeeUsername UNIQUE (Username);
GO