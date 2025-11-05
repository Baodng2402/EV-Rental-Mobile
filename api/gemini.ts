import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy API key từ environment variable
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY chưa được cấu hình trong .env");
}

// Khởi tạo Gemini Client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Gửi prompt đến Gemini và nhận phản hồi văn bản.
 * @param prompt Câu lệnh/câu hỏi người dùng.
 * @param context Dữ liệu ngữ cảnh (danh sách xe điện)
 * @returns Promise<string> Phản hồi từ model.
 */
export async function generateTextFromGemini(
  prompt: string,
  context?: string
): Promise<string> {
  if (!genAI) {
    throw new Error(
      "Gemini API chưa được cấu hình. Vui lòng thêm EXPO_PUBLIC_GEMINI_API_KEY vào file .env"
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Tạo system instruction để giới hạn trả lời về xe điện
    const systemInstruction = `
Bạn là trợ lý AI chuyên về xe điện (Electric Vehicles - EV) cho hệ thống cho thuê xe điện.

QUY TẮC QUAN TRỌNG:
1. CHỈ trả lời các câu hỏi liên quan đến xe điện, ô tô điện, và dịch vụ cho thuê xe điện
2. Nếu câu hỏi KHÔNG liên quan đến xe điện, hãy lịch sự từ chối và hướng dẫn người dùng hỏi về xe điện
3. Sử dụng dữ liệu xe điện được cung cấp để trả lời chính xác
4. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu
5. Nếu không có thông tin, hãy nói rõ thay vì bịa đặt

CÁC CHỦ ĐỀ ĐƯỢC PHÉP:
- Thông tin về các dòng xe điện
- So sánh xe điện
- Tư vấn chọn xe phù hợp
- Giá thuê, pin, phạm vi hoạt động
- Các câu hỏi về dịch vụ cho thuê xe điện

CHỦ ĐỀ TU CHỐI:
- Chính trị, tôn giáo, nội dung nhạy cảm
- Lập trình, toán học (trừ khi liên quan đến xe điện)
- Các chủ đề không liên quan đến xe điện
`;

    let fullPrompt = systemInstruction + "\n\n";

    if (context) {
      fullPrompt += `DANH SÁCH XE ĐIỆN HIỆN CÓ:\n${context}\n\n`;
    }

    fullPrompt += `CÂU HỎI CỦA NGƯỜI DÙNG: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API Gemini:", error);

    if (error?.message?.includes("API key")) {
      throw new Error("API key không hợp lệ. Vui lòng kiểm tra cấu hình.");
    }

    throw new Error("Không thể kết nối với AI. Vui lòng thử lại sau.");
  }
}

/**
 * Phân tích danh sách xe và trả lời câu hỏi người dùng
 * @param userQuestion Câu hỏi của người dùng
 * @param vehiclesData Dữ liệu xe điện từ API
 * @returns Promise<string> Câu trả lời từ Gemini
 */
export async function askAboutElectricVehicles(
  userQuestion: string,
  vehiclesData: any[]
): Promise<string> {
  try {
    // Format dữ liệu xe thành text dễ đọc cho AI
    const vehiclesContext = vehiclesData
      .map((vehicle, index) => {
        const brand =
          typeof vehicle.brand === "object"
            ? vehicle.brand.name
            : vehicle.brand;
        return `
${index + 1}. ${vehicle.model || "N/A"}
   - Hãng: ${brand}
   - Biển số: ${vehicle.plateNo || "N/A"}
   - Trạng thái: ${vehicle.status || "N/A"}
   - Giá thuê cơ bản: ${
     typeof vehicle.brand === "object"
       ? vehicle.brand.baseDailyRate?.toLocaleString()
       : "N/A"
   } đ/ngày
   - Pin: ${vehicle.batteryPercent || "N/A"} kWh
   - Phạm vi: ${vehicle.brand.specs?.range || "N/A"} km
    - Số lượng chỗ: ${vehicle.brand.specs?.seats|| "N/A"} chỗ

   - Năm sản xuất: ${vehicle.year || "N/A"}
        `.trim();
      })
      .join("\n\n");

    const response = await generateTextFromGemini(
      userQuestion,
      vehiclesContext
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi phân tích xe điện:", error);
    throw error;
  }
}
