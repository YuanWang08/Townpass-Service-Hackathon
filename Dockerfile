# 使用官方 Node.js 映像
FROM node:18

# 設置工作目錄
WORKDIR /app/frontend

# 複製 package.json 和 package-lock.json
COPY package.json .

# 安裝依賴
RUN npm install

# 複製其餘的源代碼
COPY * .

# 曝露前端服務的端口
EXPOSE 3000

# 使用 hot-reloading 的命令啟動服務
CMD ["npm", "run", "serve"]
