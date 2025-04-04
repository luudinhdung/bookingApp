# Sử dụng Node.js LTS
FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Lắng nghe ở cổng 4000
EXPOSE 6060

# Chạy server
CMD ["npm", "start"]
