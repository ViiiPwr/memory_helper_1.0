#!/bin/bash

# 构建Docker镜像
echo "构建Docker镜像..."
docker build -t pairing-card-generator .

# 运行容器进行测试
echo "启动容器进行测试..."
docker run -d -p 8080:80 --name pairing-card-test pairing-card-generator

echo "容器已启动，访问 http://localhost:8080 查看效果"
echo "停止容器: docker stop pairing-card-test"
echo "删除容器: docker rm pairing-card-test" 