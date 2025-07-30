const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
}

// IPC处理器测试
ipcMain.handle('export-file', async (event, data, filename) => {
    console.log('导出文件请求:', filename);
    try {
        const result = await dialog.showSaveDialog(mainWindow, {
            title: '导出数据',
            defaultPath: filename || 'test.json',
            filters: [
                { name: 'JSON文件', extensions: ['json'] }
            ]
        });

        if (!result.canceled && result.filePath) {
            fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log('文件导出成功:', result.filePath);
            return { success: true, message: '文件导出成功' };
        } else {
            console.log('用户取消了导出');
            return { success: false, message: '用户取消了导出' };
        }
    } catch (error) {
        console.error('导出文件失败:', error);
        return { success: false, message: '导出文件失败: ' + error.message };
    }
});

ipcMain.handle('import-file', async (event) => {
    console.log('导入文件请求');
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: '导入数据',
            properties: ['openFile'],
            filters: [
                { name: 'JSON文件', extensions: ['json'] }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            console.log('文件导入成功:', filePath);
            return { success: true, data: data, message: '文件导入成功' };
        } else {
            console.log('用户取消了导入');
            return { success: false, message: '用户取消了导入' };
        }
    } catch (error) {
        console.error('导入文件失败:', error);
        return { success: false, message: '导入文件失败: ' + error.message };
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
}); 