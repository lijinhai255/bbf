# 使用更高版本的 Node.js，例如 16
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目的全部文件到工作目录
COPY . .

# 暴露应用端口
EXPOSE 8081

# 启动应用
CMD ["npm", "run", "serve"]
