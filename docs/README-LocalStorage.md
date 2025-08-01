# 配对题生成器 - 本地存储版本

## 🎉 更新说明

应用已从腾讯云数据库迁移到本地存储，现在完全离线运行，无需网络连接！

## ✨ 新功能

### 🔄 数据迁移
- 自动从旧格式迁移数据到新格式
- 保持向后兼容性
- 无数据丢失

### 💾 数据管理
- **数据导出**: 将数据导出为JSON文件
- **数据导入**: 从JSON文件导入数据
- **数据备份**: 支持完整的数据备份和恢复
- **存储信息**: 查看本地存储使用情况

### 🛡️ 数据安全
- 所有数据存储在本地
- 无需网络连接
- 数据完全私有

## 📁 文件结构

```
配对题生成器/
├── index.html              # 主应用
├── local-storage.js        # 本地存储管理器
├── data-manager.html       # 数据管理工具
├── main.js                 # Electron主进程
├── package.json            # 项目配置
└── dist/                   # 构建输出
```

## 🚀 快速开始

### 开发模式
```bash
npm start
```

### 构建应用
```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

### 使用脚本
```bash
# 快速启动
./quick-start.sh

# 专门构建macOS
./build-mac.sh

# 更新构建
./update.sh
```

## 📊 数据管理

### 访问数据管理工具
在应用中按 `F12` 打开开发者工具，在控制台输入：
```javascript
window.open('data-manager.html', '_blank');
```

### 数据导出
1. 打开数据管理工具
2. 点击"📤 导出数据"
3. 选择保存位置
4. 文件包含所有用户数据

### 数据导入
1. 打开数据管理工具
2. 点击"📁 选择JSON文件"
3. 选择之前导出的文件
4. 数据将自动导入

### 数据迁移
1. 打开数据管理工具
2. 点击"🔄 开始迁移"
3. 系统自动迁移旧格式数据

## 🔧 技术特性

### 本地存储管理器
- **统一接口**: 提供统一的数据操作接口
- **版本控制**: 支持数据版本管理
- **错误处理**: 完善的错误处理机制
- **兼容性**: 保持与原有cloudDB接口的兼容性

### 存储格式
```javascript
{
  "data": "实际数据",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 存储键前缀
- 所有数据使用 `pairing_card_` 前缀
- 避免与其他应用冲突
- 便于管理和清理

## 📈 性能优化

### 存储效率
- 数据压缩存储
- 智能缓存机制
- 批量操作支持

### 内存管理
- 延迟加载
- 自动清理
- 内存使用监控

## 🛠️ 开发工具

### 测试本地存储
在控制台输入：
```javascript
testLocalStorage();
```

### 查看存储信息
```javascript
localStorageManager.getStorageInfo();
```

### 手动迁移数据
```javascript
localStorageManager.migrateFromLegacyFormat('user_id');
```

## 🔄 迁移指南

### 从云数据库版本迁移
1. 确保旧版本数据已保存
2. 安装新版本
3. 应用会自动迁移数据
4. 验证数据完整性

### 数据格式变化
- **旧格式**: `history_userId`, `cardSetHistoryTags_userId`
- **新格式**: `pairing_card_cardSets_userId`, `pairing_card_historyTags_userId`

## 🚨 注意事项

### 数据安全
- 定期备份重要数据
- 不要删除应用数据目录
- 升级前请备份数据

### 存储限制
- 本地存储有大小限制
- 建议定期清理不必要的数据
- 大文件建议使用数据导出功能

### 兼容性
- 支持所有现代浏览器
- Electron应用完全兼容
- 保持与原有功能的兼容性

## 🐛 故障排除

### 数据丢失
1. 检查是否有备份文件
2. 尝试数据迁移功能
3. 查看浏览器存储设置

### 存储空间不足
1. 清理不必要的数据
2. 导出并删除旧数据
3. 使用数据管理工具清理

### 应用无法启动
1. 检查Node.js版本
2. 重新安装依赖
3. 清理缓存后重试

## 📞 技术支持

如果遇到问题，请：
1. 查看控制台错误信息
2. 使用数据管理工具诊断
3. 检查存储空间和权限

---

**版本**: 2.0.0  
**更新日期**: 2024年1月  
**兼容性**: Electron 28+, Node.js 18+ 