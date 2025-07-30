const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    // 导出文件
    exportFile: (data, filename) => {
        return ipcRenderer.invoke('export-file', data, filename);
    },

    // 导入文件
    importFile: () => {
        return ipcRenderer.invoke('import-file');
    },

    // 显示消息框
    showMessageBox: (options) => {
        return ipcRenderer.invoke('show-message-box', options);
    },

    // 显示确认对话框
    showConfirmDialog: (options) => {
        return ipcRenderer.invoke('show-confirm-dialog', options);
    }
}); 