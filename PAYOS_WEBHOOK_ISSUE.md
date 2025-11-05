# 🚨 PHÂN TÍCH VẤN ĐỀ: PayOS Webhook Không Cập Nhật Status

## 📊 TÌNH TRẠNG HIỆN TẠI

### Booking Data After Payment:
```json
{
  "_id": "690b8200ca5539022d0d5b84",
  "status": "WAITING_PAYMENT",
  "statusHistory": [
    {
      "status": "CREATED",
      "changedAt": "2025-11-05T16:57:36.102Z"
    },
    {
      "status": "PENDING_APPROVAL",
      "changedAt": "2025-11-05T16:57:36.102Z"
    },
    {
      "status": "APPROVED",
      "changedAt": "2025-11-05T16:57:36.596Z"
    },
    {
      "status": "WAITING_PAYMENT",
      "changedAt": "2025-11-05T16:57:36.596Z"
    }
  ]
}
```

**VẤN ĐỀ:** 
- ✅ User đã thanh toán thành công
- ❌ Status vẫn là `WAITING_PAYMENT`
- ❌ Không có status mới: `PAID` hoặc `SUCCESS`
- ❌ StatusHistory không được cập nhật

---

## 🔍 NGUYÊN NHÂN

### 1. **PayOS Webhook Không Được Gọi HOẶC**
### 2. **Backend Không Xử Lý Webhook Đúng**

---

## 📝 CÁCH PayOS WEBHOOK HOẠT ĐỘNG

### Flow Chuẩn:
```
User thanh toán → PayOS xác nhận → PayOS gọi webhook
    ↓
POST https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook
    ↓
Backend nhận payload:
{
  "code": "00",
  "desc": "success",
  "success": true,
  "data": {
    "orderCode": 123,
    "amount": 3000,
    "description": "...",
    "code": "00",
    "desc": "Thành công",
    ...
  },
  "signature": "8d8640d802576397a1ce45ebda7f835055768ac7ad2e0bfb77f9b8f12cca4c7f"
}
    ↓
Backend verify signature với PAYOS_CHECKSUM_KEY
    ↓
Nếu hợp lệ → Update booking status → PAID
    ↓
BGJ trigger → PAID → SUCCESS
```

---

## 🔐 VERIFY SIGNATURE (QUAN TRỌNG!)

### Checksum Key:
```
PAYOS_CHECKSUM_KEY = "9a218f53fe5250e9f9719cc46ee6b5a33f4a4cad8e5ea07c058854cd7c6b5c63"
```

### Thuật Toán Verify (Theo Tài Liệu PayOS):

```javascript
// Bước 1: Sort data theo alphabet
const sortedData = sortObjectKeys(webhookData.data);

// Bước 2: Convert thành query string
const dataString = Object.keys(sortedData)
  .map(key => {
    let value = sortedData[key];
    
    // Handle null/undefined
    if (value === null || value === undefined) {
      value = "";
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      value = JSON.stringify(value);
    }
    
    return `${key}=${value}`;
  })
  .join("&");

// Bước 3: HMAC SHA256
const crypto = require('crypto');
const computedSignature = crypto
  .createHmac('sha256', PAYOS_CHECKSUM_KEY)
  .update(dataString)
  .digest('hex');

// Bước 4: So sánh
const isValid = computedSignature === webhookData.signature;
```

### Code PHP Từ Tài Liệu:
```php
function isValidData($transaction, $transaction_signature, $checksum_key) {
    ksort($transaction);
    $transaction_str_arr = [];
    
    foreach ($transaction as $key => $value) {
        if (in_array($value, ["undefined", "null"]) || gettype($value) == "NULL") {
            $value = "";
        }
        
        if (is_array($value)) {
            $valueSortedElementObj = array_map(function ($ele) {
                ksort($ele);
                return $ele;
            }, $value);
            $value = json_encode($valueSortedElementObj, JSON_UNESCAPED_UNICODE);
        }
        
        $transaction_str_arr[] = $key . "=" . $value;
    }
    
    $transaction_str = implode("&", $transaction_str_arr);
    $signature = hash_hmac("sha256", $transaction_str, $checksum_key);
    
    return $signature == $transaction_signature;
}
```

---

## ⚠️ CÁC VẤN ĐỀ CÓ THỂ XẢY RA

### 1. **Webhook URL Không Đúng**
- PayOS được config webhook URL: `https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook`
- Backend endpoint phải là: `/api/payos/webhook` hoặc `/payos/webhook`
- **KIỂM TRA:** Xem backend route có match không

### 2. **Signature Verification Fail**
- Backend verify signature SAI
- Checksum key không đúng
- Algorithm sai (phải là HMAC SHA256)
- Data sorting sai (phải sort theo alphabet)

### 3. **Backend Endpoint Không Tồn Tại**
- Route `/payos/webhook` chưa được implement
- PayOS gọi webhook → 404 Not Found
- **KIỂM TRA:** Test endpoint thủ công

### 4. **Backend Không Cập Nhật Booking**
- Webhook receive OK
- Signature verify OK
- Nhưng logic cập nhật booking có bug

### 5. **PayOS Chưa Config Webhook URL**
- Trong dashboard PayOS chưa set webhook URL
- PayOS không gọi webhook sau payment
- **KIỂM TRA:** Vào my.payos.vn → Settings → Webhook

---

## 🧪 CÁCH KIỂM TRA VÀ SỬA

### Bước 1: Kiểm Tra PayOS Dashboard
1. Đăng nhập: https://my.payos.vn
2. Vào **Settings** → **Webhook**
3. Verify webhook URL đã được set: 
   ```
   https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook
   ```
4. Kiểm tra **Checksum Key** có match không:
   ```
   9a218f53fe5250e9f9719cc46ee6b5a33f4a4cad8e5ea07c058854cd7c6b5c63
   ```

### Bước 2: Test Webhook Endpoint Thủ Công

**Dùng Postman hoặc curl:**
```bash
curl -X POST https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "code": "00",
    "desc": "success",
    "success": true,
    "data": {
      "orderCode": 123,
      "amount": 3000,
      "description": "Test",
      "accountNumber": "12345678",
      "reference": "TF230204212323",
      "transactionDateTime": "2023-02-04 18:25:00",
      "currency": "VND",
      "paymentLinkId": "test123",
      "code": "00",
      "desc": "Thành công",
      "counterAccountBankId": "",
      "counterAccountBankName": "",
      "counterAccountName": "",
      "counterAccountNumber": "",
      "virtualAccountName": "",
      "virtualAccountNumber": ""
    },
    "signature": "test_signature"
  }'
```

**Kết quả mong đợi:**
- Status Code: 200 OK
- Response: `{ "success": true }`

### Bước 3: Kiểm Tra Backend Logs

**Cần backend team check:**
```bash
# Check webhook được gọi chưa
grep "payos/webhook" /var/log/backend.log

# Check signature verification
grep "signature" /var/log/backend.log

# Check booking update
grep "booking.*PAID" /var/log/backend.log
```

### Bước 4: Verify Signature Implementation

**Backend PHẢI có code tương tự:**

```javascript
// Node.js/Express example
const crypto = require('crypto');

app.post('/api/payos/webhook', (req, res) => {
  const { data, signature } = req.body;
  const CHECKSUM_KEY = "9a218f53fe5250e9f9719cc46ee6b5a33f4a4cad8e5ea07c058854cd7c6b5c63";
  
  // Sort data keys
  const sortedData = {};
  Object.keys(data).sort().forEach(key => {
    let value = data[key];
    
    // Handle null/undefined
    if (value === null || value === undefined) {
      value = "";
    }
    
    sortedData[key] = value;
  });
  
  // Create query string
  const dataString = Object.keys(sortedData)
    .map(key => `${key}=${sortedData[key]}`)
    .join("&");
  
  // Compute signature
  const computedSignature = crypto
    .createHmac('sha256', CHECKSUM_KEY)
    .update(dataString)
    .digest('hex');
  
  // Verify
  if (computedSignature !== signature) {
    console.error('❌ Invalid signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  console.log('✅ Signature verified');
  
  // Update booking status
  const { orderCode, code } = data;
  
  if (code === "00") {
    // Find booking by orderCode
    // Update status to PAID
    // Add statusHistory entry
    
    console.log(`✅ Booking updated to PAID for order ${orderCode}`);
  }
  
  res.json({ success: true });
});
```

---

## 📋 CHECKLIST SỬA LỖI

### Frontend (React Native) - ✅ ĐÃ OK
- [x] PayOSWebViewModal detect payment success
- [x] Navigate về booking list sau payment
- [x] Auto refresh booking list

### Backend - ⚠️ CẦN KIỂM TRA

- [ ] **Route `/api/payos/webhook` tồn tại**
- [ ] **Signature verification đúng algorithm**
- [ ] **Checksum key đúng**
- [ ] **Data sorting theo alphabet**
- [ ] **Update booking status → PAID**
- [ ] **Thêm entry vào statusHistory**
- [ ] **BGJ trigger PAID → SUCCESS**
- [ ] **PayOS webhook URL được config đúng**

### PayOS Dashboard - ⚠️ CẦN KIỂM TRA

- [ ] Webhook URL: `https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook`
- [ ] Checksum key match
- [ ] Test webhook trong dashboard

---

## 🎯 HÀNH ĐỘNG CẦN LÀM NGAY

### 1. **Kiểm Tra PayOS Dashboard** (QUAN TRỌNG NHẤT)
Vào https://my.payos.vn → Settings → Webhook
- Verify URL đã set chưa
- Copy checksum key để đối chiếu

### 2. **Test Webhook Endpoint**
```bash
curl https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook
```
Nếu 404 → Route chưa được tạo

### 3. **Liên Hệ Backend Team**
Cung cấp:
- Checksum key: `9a218f53fe5250e9f9719cc46ee6b5a33f4a4cad8e5ea07c058854cd7c6b5c63`
- Algorithm: HMAC SHA256
- Data format: Sort alphabet, query string `key1=value1&key2=value2`
- Code sample từ tài liệu PayOS (đã có ở trên)

### 4. **Check Backend Logs**
Xem có log nào về webhook không:
```
grep -i "payos" backend.log
grep -i "webhook" backend.log
grep -i "signature" backend.log
```

### 5. **Manual Test Payment**
- Tạo booking mới
- Thanh toán
- Đợi 5-10 giây
- Check backend logs xem webhook có được gọi không
- Check booking status có update không

---

## 🔧 CODE FIX MẪU CHO BACKEND

### Node.js/Express:

```javascript
const crypto = require('crypto');
const Booking = require('./models/Booking'); // Your booking model

const PAYOS_CHECKSUM_KEY = "9a218f53fe5250e9f9719cc46ee6b5a33f4a4cad8e5ea07c058854cd7c6b5c63";

// Webhook endpoint
app.post('/api/payos/webhook', async (req, res) => {
  try {
    const { data, signature } = req.body;
    
    console.log('📡 PayOS Webhook received:', { data, signature });
    
    // Verify signature
    const sortedData = {};
    Object.keys(data).sort().forEach(key => {
      let value = data[key];
      if (value === null || value === undefined) {
        value = "";
      }
      sortedData[key] = value;
    });
    
    const dataString = Object.keys(sortedData)
      .map(key => `${key}=${sortedData[key]}`)
      .join("&");
    
    const computedSignature = crypto
      .createHmac('sha256', PAYOS_CHECKSUM_KEY)
      .update(dataString)
      .digest('hex');
    
    if (computedSignature !== signature) {
      console.error('❌ Invalid signature');
      console.log('Expected:', signature);
      console.log('Computed:', computedSignature);
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    console.log('✅ Signature verified');
    
    // Process payment
    const { orderCode, code, desc } = data;
    
    if (code === "00") {
      // Payment successful
      console.log(`✅ Payment successful for order ${orderCode}`);
      
      // Find booking by orderCode
      const booking = await Booking.findOne({ bookingCode: orderCode });
      
      if (!booking) {
        console.error(`❌ Booking not found for orderCode ${orderCode}`);
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      // Update status to PAID
      booking.status = 'PAID';
      booking.paidAt = new Date();
      
      // Add to status history
      booking.statusHistory.push({
        status: 'PAID',
        changedAt: new Date(),
        changedBy: null,
        note: `Thanh toán thành công qua PayOS. Order: ${orderCode}`
      });
      
      await booking.save();
      
      console.log(`✅ Booking ${booking._id} updated to PAID`);
      
      // Trigger BGJ to update to SUCCESS (optional, tùy logic)
      // triggerStatusUpdate(booking._id);
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## 📞 LIÊN HỆ HỖ TRỢ

Nếu sau khi check tất cả vẫn không hoạt động:

**PayOS Support:**
- Email: support@payos.vn
- Hotline: (ghi số hotline nếu có)
- Yêu cầu: Check webhook log cho orderCode cụ thể

**Thông Tin Cần Cung Cấp:**
- OrderCode: (từ response createPayOSCheckout)
- PaymentLinkId: (từ response createPayOSCheckout)
- Thời gian thanh toán: (exact time user thanh toán)
- Webhook URL: https://electric-rental-p4ohi.ondigitalocean.app/api/payos/webhook

---

## ✅ KẾT LUẬN

**Vấn đề:** Webhook PayOS không cập nhật booking status sau thanh toán

**Nguyên nhân có thể:**
1. ❌ PayOS dashboard chưa config webhook URL
2. ❌ Backend endpoint `/payos/webhook` không tồn tại
3. ❌ Signature verification sai
4. ❌ Logic update booking có bug

**Giải pháp:**
1. ✅ Check PayOS dashboard
2. ✅ Test webhook endpoint
3. ✅ Verify signature implementation
4. ✅ Check backend logs
5. ✅ Fix code theo mẫu trên

**Frontend đã OK hoàn toàn - Vấn đề nằm ở BACKEND hoặc PayOS config!**

---

**Generated:** 6 tháng 11, 2025  
**Status:** 🚨 CẦN BACKEND TEAM FIX URGENT  
**Priority:** HIGH - User đã thanh toán nhưng status không update
