#!/bin/bash

# 显示错误并退出
set -e

# 清理之前的构建
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -f extension.zip

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# 运行 vite 构建
echo "🏗️  Building extension..."
npm run build

# 创建用于发布的 zip 文件
echo "📦 Creating extension.zip..."
cd dist
zip -r ../extension.zip ./*
cd ..

echo "✅ Build completed!"
echo "📁 Test build: ./dist"
echo "📦 Release zip: ./extension.zip"

# 显示文件大小
echo -e "\n📊 Build sizes:"
du -sh dist extension.zip
