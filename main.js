const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// 保持对窗口对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，窗口会被自动地关闭
let mainWindow;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        title: '配对题生成器',
        show: false, // 先隐藏窗口
        autoHideMenuBar: false
    });

    // 加载应用的 index.html
    mainWindow.loadFile('index.html');

    // 当窗口准备好显示时再显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 当窗口被关闭时触发
    mainWindow.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null;
    });

    // 处理外部链接
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// 创建菜单
function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建卡组',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.executeJavaScript(`
                if (typeof resetForm === 'function') {
                  resetForm();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              `);
                        }
                    }
                },
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { role: 'undo', label: '撤销' },
                { role: 'redo', label: '重做' },
                { type: 'separator' },
                { role: 'cut', label: '剪切' },
                { role: 'copy', label: '复制' },
                { role: 'paste', label: '粘贴' },
                { role: 'selectall', label: '全选' }
            ]
        },
        {
            label: '视图',
            submenu: [
                { role: 'reload', label: '重新加载' },
                { role: 'forceReload', label: '强制重新加载' },
                { role: 'toggleDevTools', label: '切换开发者工具' },
                { type: 'separator' },
                { role: 'resetZoom', label: '实际大小' },
                { role: 'zoomIn', label: '放大' },
                { role: 'zoomOut', label: '缩小' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: '切换全屏' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于配对题生成器',
                            message: '配对题生成器 v1.0.0',
                            detail: '学成选择题——配对卡片练习桌面应用\n\n一个帮助学习和记忆的配对题练习工具。'
                        });
                    }
                }
            ]
        }
    ];

    // macOS 特殊处理
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about', label: '关于配对题生成器' },
                { type: 'separator' },
                { role: 'services', label: '服务' },
                { type: 'separator' },
                { role: 'hide', label: '隐藏配对题生成器' },
                { role: 'hideothers', label: '隐藏其他' },
                { role: 'unhide', label: '显示全部' },
                { type: 'separator' },
                { role: 'quit', label: '退出配对题生成器' }
            ]
        });

        // 编辑菜单
        template[2].submenu.push(
            { type: 'separator' },
            {
                label: '语音',
                submenu: [
                    { role: 'startspeaking', label: '开始朗读' },
                    { role: 'stopspeaking', label: '停止朗读' }
                ]
            }
        );

        // 窗口菜单
        template[3].submenu = [
            { role: 'close', label: '关闭' },
            { role: 'minimize', label: '最小化' },
            { role: 'zoom', label: '缩放' },
            { type: 'separator' },
            { role: 'front', label: '前置全部' }
        ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
    createWindow();
    createMenu();

    app.on('activate', () => {
        // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
        // 通常在应用程序中重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 当所有窗口都被关闭时退出
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

// 处理安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// IPC处理器 - 文件操作
ipcMain.handle('export-file', async (event, data, filename) => {
    try {
        const result = await dialog.showSaveDialog(mainWindow, {
            title: '导出数据',
            defaultPath: filename || '配对题数据.json',
            filters: [
                { name: 'JSON文件', extensions: ['json'] },
                { name: '所有文件', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePath) {
            fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf8');
            return { success: true, message: '文件导出成功' };
        } else {
            return { success: false, message: '用户取消了导出' };
        }
    } catch (error) {
        console.error('导出文件失败:', error);
        return { success: false, message: '导出文件失败: ' + error.message };
    }
});

ipcMain.handle('import-file', async (event) => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: '导入数据',
            properties: ['openFile'],
            filters: [
                { name: 'JSON文件', extensions: ['json'] },
                { name: '所有文件', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            return { success: true, data: data, message: '文件导入成功' };
        } else {
            return { success: false, message: '用户取消了导入' };
        }
    } catch (error) {
        console.error('导入文件失败:', error);
        return { success: false, message: '导入文件失败: ' + error.message };
    }
});

ipcMain.handle('show-message-box', async (event, options) => {
    try {
        const result = await dialog.showMessageBox(mainWindow, options);
        return result;
    } catch (error) {
        console.error('显示消息框失败:', error);
        return { response: 0 };
    }
});

ipcMain.handle('show-confirm-dialog', async (event, options) => {
    try {
        const result = await dialog.showMessageBox(mainWindow, {
            type: 'question',
            buttons: ['确定', '取消'],
            defaultId: 0,
            cancelId: 1,
            ...options
        });
        return { confirmed: result.response === 0 };
    } catch (error) {
        console.error('显示确认对话框失败:', error);
        return { confirmed: false };
    }
}); 