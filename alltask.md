# 📘 AllTask.md – Tổng Quan Flow USER (Renter)

## 🎯 Mục Tiêu

File này dành cho **Copilot** đọc tổng thể luồng **booking và thanh toán (PayOS)** dành cho người dùng (renter) để:

* Kiểm tra logic booking và thanh toán có đúng thứ tự không.
* Xác nhận webhook PayOS hoạt động chuẩn.
* Đảm bảo BE cập nhật đúng trạng thái `WAITING_PAYMENT`, `PAID`, `SUCCESS`.

---

## 🚗 FLOW CHUẨN CHO USER (RENTER)

### 1️⃣ USER TẠO BOOKING

* Trang: `CreateBookingPage`
* API: `POST /api/bookings`
* Backend tạo booking mới với trạng thái: `PENDING_APPROVAL`
* Hiển thị: “Gửi yêu cầu thành công!”

---

### 2️⃣ STAFF DUYỆT (TỰ ĐỘNG LIÊN QUAN USER)

* Khi staff duyệt booking → set `APPROVED` ✅
* **BGJ** tự động chuyển `APPROVED` → `WAITING_PAYMENT` trong 100ms.
* User thấy trạng thái cập nhật thành `WAITING_PAYMENT`.

---

### 3️⃣ USER THANH TOÁN PAYOS

* User thấy trạng thái: `WAITING_PAYMENT`
* Nhấn “Thanh toán ngay” → gọi `POST /api/payos/checkout`
* PayOS hiển thị QR → User quét và thanh toán thành công.

---

### 4️⃣ PAYOS WEBHOOK (TỰ ĐỘNG UPDATE)

* Endpoint: **`/payos/webhook`**
* Khi PayOS xác nhận giao dịch, gửi payload tới endpoint.

**Payload Example:**

```json
{
  "data": {
    "orderCode": "string",
    "amount": 0,
    "description": "string",
    "accountNumber": "string",
    "reference": "string",
    "transactionDateTime": "string",
    "currency": "string",
    "paymentLinkId": "string",
    "code": "string",
    "desc": "string",
    "counterAccountBankId": "string",
    "counterAccountBankName": "string",
    "counterAccountName": "string",
    "counterAccountNumber": "string",
    "virtualAccountName": "string",
    "virtualAccountNumber": "string"
  },
  "signature": "string"
}
```

* Kiểm tra chữ ký với key:

```
PAYOS_CHECKSUM_KEY = "9a218f53fe5250e9f9719cc46ee6b5a33f4a4cad8e5ea07c058854cd7c6b5c63"
```

* Nếu xác thực hợp lệ:

  * Cập nhật trạng thái thanh toán: `SUCCESS`
  * Cập nhật booking: `PAID`
  * Gửi thông báo “Thanh toán thành công!” cho user.

---

### 5️⃣ BOOKING HOÀN TẤT

* Sau khi webhook xử lý, **BGJ** (hoặc cron job) tự động phát hiện booking = `PAID` → cập nhật sang `SUCCESS`.
* User có thể xem lại chi tiết booking đã thanh toán trong profile.

---

## 🔁 TRẠNG THÁI BOOKING (USER)

```
CREATED → PENDING_APPROVAL → APPROVED → WAITING_PAYMENT → PAID → SUCCESS
```

| Bước | Thao tác                    | Thực hiện bởi   |
| ---- | --------------------------- | --------------- |
| 1    | User tạo booking            | User            |
| 2    | Staff duyệt                 | Staff           |
| 3    | Chuyển sang WAITING_PAYMENT | BGJ tự động     |
| 4    | Thanh toán QR               | User            |
| 5    | Webhook cập nhật PAID       | PayOS → Backend |
| 6    | BGJ cập nhật SUCCESS        | Backend tự động |

---

## ✅ KEY POINTS CHO COPILOT

* Chỉ tập trung **module booking** và **PayOS webhook**.
* Xác nhận endpoint sau hoạt động đúng:

  * `/api/bookings`
  * `/api/payos/checkout`
  * `/payos/webhook`
* Kiểm tra:

  * `WAITING_PAYMENT` → `PAID` → `SUCCESS` có được cập nhật tự động.
  * Webhook verify signature đúng với `PAYOS_CHECKSUM_KEY`.
  * Không bị lặp webhook hoặc double update.
* Nếu phát hiện thiếu, đề xuất code fix cho controller/service tương ứng.

---

> 📌 Tất cả log, message hiển thị và response đều bằng **tiếng Việt**, không chuyển sang tiếng Anh.
