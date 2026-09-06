# docx2pdf-nest

Tool cá nhân dùng NestJS để convert hàng loạt file `.docx` sang `.pdf`.
Convert thật sự được thực hiện bởi **LibreOffice** (chạy headless), Node chỉ điều phối.

## Yêu cầu
- Node.js >= 18
- Đã cài **LibreOffice** trên máy (có lệnh `soffice` trong PATH)
  - Windows: cài LibreOffice, thêm `C:\Program Files\LibreOffice\program` vào PATH
  - Mac: `brew install --cask libreoffice`
  - Linux: `sudo apt install libreoffice`

## Cài đặt
```bash
npm install
```

## Cách dùng qua UI web (khuyên dùng)

Chạy server:
```bash
npm run start:dev
```

Mở trình duyệt: **http://localhost:3000**

- Kéo thả hoặc chọn nhiều file `.docx` (tối đa 50 file/lượt)
- Bấm **Convert sang PDF**
- Trang kết quả hiện danh sách file, file nào lỗi sẽ báo rõ, file nào ok có nút **Tải PDF**

Giao diện là SSR (server render HTML thuần, không cần build frontend riêng), file upload/convert được lưu tạm theo từng phiên trong `uploads/` và `output/` ở thư mục gốc project (có thể xoá định kỳ).

## Cách dùng qua CLI (không cần mở trình duyệt)

Bỏ hết file .docx cần convert vào 1 thư mục, ví dụ `./input`, rồi chạy:

```bash
npx ts-node src/cli.ts ./input ./output
```

- Tham số 1: thư mục chứa các file `.docx` cần convert
- Tham số 2 (tùy chọn): thư mục lưu file `.pdf` kết quả, mặc định `./output`

Kết quả in ra file nào thành công / thất bại.

## Cách dùng qua REST API (nếu muốn tích hợp/gọi từ chỗ khác)

Gọi API:
```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{
        "files": ["/duong/dan/a.docx", "/duong/dan/b.docx"],
        "outputDir": "./output"
      }'
```

Response:
```json
{
  "results": [
    { "input": "...", "output": "...", "success": true },
    { "input": "...", "output": null, "success": false, "error": "..." }
  ]
}
```

## Sao chép PDF có mật khẩu

Service này dùng Python, thư viện `pypdf` và `cryptography` để mở PDF bằng mật khẩu và ghi nội dung sang
một file PDF mới (file mới không còn mã hóa). Đường dẫn nhập vào là **thư mục đích**,
file mới giữ nguyên tên file nguồn. Nếu bỏ trống, file được lưu vào `./output/pdf/copy`.

Cài dependency:

```powershell
python -m pip install -r requirements.txt
```

Nếu lệnh Python không có tên `python`, cấu hình đường dẫn Python:

```powershell
$env:PYTHON_BIN = 'C:\Path\to\python.exe'
```

Gọi API:

```bash
curl -X POST http://localhost:3000/pdf/copy \
  -H "Content-Type: application/json" \
  -d '{
        "sourcePath": "C:\\input\\protected.pdf",
        "password": "mat-khau",
        "outputDir": "E:\\output\\pdf\\copy"
      }'
```

API tự tạo thư mục đích nếu chưa có, không ghi đè file nguồn và không ghi mật khẩu vào log.

## Ghi chú
- Cả batch (ví dụ 30 file) được convert trong **1 lần gọi soffice** để nhanh và tránh lỗi khóa profile khi
  chạy nhiều tiến trình LibreOffice song song.
- Nếu muốn chỉ định đường dẫn `soffice` khác (không có trong PATH), set biến môi trường:
  ```bash
  SOFFICE_BIN="/duong/dan/toi/soffice" npx ts-node src/cli.ts ./input ./output
  ```
