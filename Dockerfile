# 使用nginx作为基础镜像
FROM nginx:alpine

# 复制静态文件到nginx默认目录
COPY index.html /usr/share/nginx/html/

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 