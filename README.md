# Cooking App

Ứng dụng nấu ăn trên React Native, cho phép người dùng xem công thức, nhập số lượng người, tính nguyên liệu, theo dõi các bước nấu, tính thời gian nấu và lưu công thức đã nấu.  

---

## 📌 Tính năng chính

1. **Xem công thức**  
   - Hiển thị danh sách công thức, nguyên liệu, các bước nấu.  

2. **Chế độ Cooking Carousel Modal**  
   - Nhập số lượng người.  
   - Tự động tính nguyên liệu theo số người.  
   - Next từng bước: Chuẩn bị → Nấu → Tổng thời gian → Hoàn thành.  
   - Hiển thị Prep Time, Cook Time và Total Time.  

3. **Lưu công thức đã nấu**  
   - Lưu vào Redux + AsyncStorage.  
   - Chỉ lưu khi người dùng đã đăng nhập.  
   - Xem danh sách công thức đã nấu.  
   - Xóa từng công thức nếu muốn.  

4. **Quản lý người dùng**  
   - Kiểm tra đăng nhập trước khi lưu công thức.  

---

## ⚙️ Công nghệ sử dụng

- React Native  
- Redux Toolkit (`userSlice`, `recipeSlice`)  
- AsyncStorage (lưu công thức offline)  
- React Navigation  
- FlatList / Modal / TextInput / Button  

---

## 🗂️ Cấu trúc thư mục

