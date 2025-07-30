# Electron应用导入导出功能修复说明

## 问题描述
原Electron应用的导入导出按钮点击后没有反应，这是因为Electron的安全限制导致的。

## 问题原因
1. **安全限制**：Electron默认不允许渲染进程直接访问文件系统
2. **缺少preload脚本**：没有preload脚本来暴露安全的API
3. **contextIsolation启用**：启用了上下文隔离，需要通过IPC通信

## 解决方案

### 1. 创建preload脚本 (`preload.js`)
```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exportFile: (data, filename) => {
    return ipcRenderer.invoke('export-file', data, filename);
  },
  importFile: () => {
    return ipcRenderer.invoke('import-file');
  },
  // ... 其他API
});
```

### 2. 修改主进程 (`main.js`)
- 添加了preload脚本配置
- 添加了IPC处理器来处理文件操作
- 使用Electron的dialog API来显示文件选择对话框

### 3. 修改渲染进程代码 (`index.html`)
- 将原来的浏览器文件API替换为Electron API
- 使用异步函数处理文件操作
- 添加了错误处理和用户反馈

## 主要修改内容

### main.js 修改
- 添加了 `ipcMain` 和 `fs` 模块导入
- 在 `webPreferences` 中添加了 `preload` 配置
- 添加了文件操作的IPC处理器

### index.html 修改
- `exportAllData()` 函数改为异步，使用 `window.electronAPI.exportFile()`
- `importData()` 函数改为异步，使用 `window.electronAPI.importFile()`
- 移除了原来的文件输入框相关代码

## 功能特点

### 导出功能
- 使用系统原生的"保存文件"对话框
- 支持选择保存位置和文件名
- 自动生成带时间戳的文件名
- 提供操作反馈和错误处理

### 导入功能
- 使用系统原生的"打开文件"对话框
- 支持文件格式验证
- 提供确认对话框防止误操作
- 支持数据覆盖和合并

## 安全考虑
- 保持了 `contextIsolation: true` 的安全设置
- 通过preload脚本暴露有限的API
- 使用IPC通信确保安全性
- 文件操作在主进程中执行

## 测试方法
1. 启动应用：`npm start`
2. 点击"导出数据"按钮，应该弹出保存文件对话框
3. 点击"导入数据"按钮，应该弹出打开文件对话框
4. 在开发者工具中查看控制台输出

## 注意事项
- 确保 `preload.js` 文件存在且路径正确
- 如果修改了preload脚本，需要重启应用
- 在打包应用时，确保preload脚本被包含在构建文件中 