# Sử dụng Node.js LTS để build React app
FROM node:18 AS build

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY ./package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build React app
RUN npm run build

# Sử dụng Nginx để serve React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Lắng nghe ở cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
