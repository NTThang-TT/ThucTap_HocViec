"""
=== ERP SYSTEM — PYTHON API (FastAPI) ===

Cài đặt:
    pip install fastapi uvicorn

Chạy:
    cd d:\Thuctap\ThucTap_HocViec\Backend\PythonApi
    python api_erp.py

Sau khi chạy:
    - API:  http://localhost:5000
    - Docs: http://localhost:5000/docs  (Swagger UI tự động)

API chuẩn RESTful cho module Quản lý Nhân Sự.
Tất cả response đều theo format ApiResponse chuẩn.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn


# ==========================================
# KHỞI TẠO APP
# ==========================================
app = FastAPI(title="ERP API", version="1.0.0", description="API cho hệ thống ERP")

# Cho phép Angular (localhost:4200) gọi API — CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# MODELS (Pydantic) — Khuôn mẫu dữ liệu
# ==========================================

class NhanVienBase(BaseModel):
    """Dữ liệu gửi lên khi tạo/sửa nhân viên"""
    ten: str = Field(..., min_length=1, max_length=100, examples=["Nguyễn Văn A"])
    role: str = Field(..., examples=["Backend Developer"])
    email: str = Field(..., examples=["a@erp.vn"])
    trang_thai: str = Field(default="active", examples=["active"])


class NhanVienResponse(NhanVienBase):
    """Dữ liệu trả về (có thêm id)"""
    id: int


class ApiResponse(BaseModel):
    """
    === RESPONSE CHUẨN ===
    Tất cả API đều trả về format này.

    Thành công:
      { "success": true,  "data": [...], "message": "OK", "errors": [] }

    Lỗi:
      { "success": false, "data": null,  "message": "Lỗi", "errors": ["Chi tiết"] }
    """
    success: bool
    data: Optional[object] = None
    message: str
    errors: list[str] = []


# ==========================================
# DATABASE GIẢ LẬP (In-Memory)
# ==========================================

db: list[dict] = [
    {"id": 1, "ten": "Nguyễn Tất Thắng", "role": "Backend Developer",  "email": "thang.nt@erp.vn", "trang_thai": "active"},
    {"id": 2, "ten": "Bảo Hân Nguyễn",   "role": "AI Engineer",        "email": "han.nb@erp.vn",   "trang_thai": "active"},
    {"id": 3, "ten": "Trần Văn C",        "role": "Intern",             "email": "c.tv@erp.vn",     "trang_thai": "busy"},
    {"id": 4, "ten": "Lê Thị D",          "role": "Frontend Developer", "email": "d.lt@erp.vn",     "trang_thai": "active"},
    {"id": 5, "ten": "Phạm Minh E",       "role": "Backend Developer",  "email": "e.pm@erp.vn",     "trang_thai": "offline"},
    {"id": 6, "ten": "Hoàng Văn F",       "role": "DevOps Engineer",    "email": "f.hv@erp.vn",     "trang_thai": "active"},
]
next_id = 7  # ID tự tăng


# ==========================================
# API ENDPOINTS — CRUD
# ==========================================

# ---------- GET: Lấy tất cả nhân viên ----------
@app.get("/api/nhan-vien", response_model=ApiResponse)
def get_all():
    """Lấy danh sách tất cả nhân viên"""
    return ApiResponse(
        success=True,
        data=db,
        message=f"Lấy danh sách thành công ({len(db)} nhân viên)"
    )


# ---------- GET: Lấy 1 nhân viên theo ID ----------
@app.get("/api/nhan-vien/{id}", response_model=ApiResponse)
def get_by_id(id: int):
    """Lấy thông tin 1 nhân viên theo ID"""
    nv = next((x for x in db if x["id"] == id), None)
    if not nv:
        return ApiResponse(
            success=False,
            data=None,
            message="Không tìm thấy nhân viên",
            errors=[f"Nhân viên với ID={id} không tồn tại"]
        )
    return ApiResponse(
        success=True,
        data=nv,
        message="Lấy thông tin thành công"
    )


# ---------- POST: Thêm nhân viên mới ----------
@app.post("/api/nhan-vien", response_model=ApiResponse)
def create(body: NhanVienBase):
    """Thêm nhân viên mới vào danh sách"""
    global next_id

    # Validate dữ liệu
    errors = []
    if not body.ten.strip():
        errors.append("Tên không được để trống")
    if not body.email.strip():
        errors.append("Email không được để trống")
    if "@" not in body.email:
        errors.append("Email không hợp lệ (thiếu @)")

    # Kiểm tra email trùng
    if any(x["email"] == body.email for x in db):
        errors.append(f"Email '{body.email}' đã tồn tại")

    if errors:
        return ApiResponse(
            success=False,
            data=None,
            message="Lỗi xác thực dữ liệu",
            errors=errors
        )

    # Tạo nhân viên mới
    new_nv = {
        "id": next_id,
        "ten": body.ten.strip(),
        "role": body.role.strip(),
        "email": body.email.strip(),
        "trang_thai": body.trang_thai
    }
    db.append(new_nv)
    next_id += 1

    return ApiResponse(
        success=True,
        data=new_nv,
        message=f"Thêm nhân viên '{new_nv['ten']}' thành công"
    )


# ---------- PUT: Cập nhật nhân viên ----------
@app.put("/api/nhan-vien/{id}", response_model=ApiResponse)
def update(id: int, body: NhanVienBase):
    """Cập nhật thông tin nhân viên theo ID"""
    nv = next((x for x in db if x["id"] == id), None)
    if not nv:
        return ApiResponse(
            success=False,
            data=None,
            message="Không tìm thấy nhân viên",
            errors=[f"Nhân viên với ID={id} không tồn tại"]
        )

    # Validate
    errors = []
    if not body.ten.strip():
        errors.append("Tên không được để trống")
    if "@" not in body.email:
        errors.append("Email không hợp lệ")

    # Kiểm tra email trùng (trừ chính mình)
    if any(x["email"] == body.email and x["id"] != id for x in db):
        errors.append(f"Email '{body.email}' đã được sử dụng bởi người khác")

    if errors:
        return ApiResponse(
            success=False,
            data=None,
            message="Lỗi xác thực dữ liệu",
            errors=errors
        )

    # Cập nhật
    nv["ten"] = body.ten.strip()
    nv["role"] = body.role.strip()
    nv["email"] = body.email.strip()
    nv["trang_thai"] = body.trang_thai

    return ApiResponse(
        success=True,
        data=nv,
        message=f"Cập nhật nhân viên '{nv['ten']}' thành công"
    )


# ---------- DELETE: Xóa nhân viên ----------
@app.delete("/api/nhan-vien/{id}", response_model=ApiResponse)
def delete(id: int):
    """Xóa nhân viên theo ID"""
    nv = next((x for x in db if x["id"] == id), None)
    if not nv:
        return ApiResponse(
            success=False,
            data=None,
            message="Không tìm thấy nhân viên",
            errors=[f"Nhân viên với ID={id} không tồn tại"]
        )

    db.remove(nv)
    return ApiResponse(
        success=True,
        data=nv,
        message=f"Xóa nhân viên '{nv['ten']}' thành công"
    )


# ==========================================
# CHẠY SERVER
# ==========================================
if __name__ == "__main__":
    print("=" * 50)
    print("  🚀 ERP API Server đang chạy!")
    print("  📍 URL:  http://localhost:5000")
    print("  📖 Docs: http://localhost:5000/docs")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=5000)
