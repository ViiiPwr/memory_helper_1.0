// 本地存储管理器 - 替代云数据库功能
class LocalStorageManager {
    constructor() {
        this.storagePrefix = 'pairing_card_';
        this.init();
    }

    // 初始化
    init() {
        console.log('✅ 本地存储管理器已初始化');
    }

    // 生成存储键
    getStorageKey(key) {
        return `${this.storagePrefix}${key}`;
    }

    // 保存数据到本地存储
    saveData(key, data) {
        try {
            const storageKey = this.getStorageKey(key);
            const dataToSave = {
                data: data,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            localStorage.setItem(storageKey, JSON.stringify(dataToSave));
            console.log(`✅ 数据已保存到本地存储: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ 保存数据失败: ${key}`, error);
            return false;
        }
    }

    // 从本地存储读取数据
    loadData(key, defaultValue = null) {
        try {
            const storageKey = this.getStorageKey(key);
            const savedData = localStorage.getItem(storageKey);

            if (savedData) {
                const parsedData = JSON.parse(savedData);
                console.log(`✅ 数据已从本地存储加载: ${key}`);
                return parsedData.data;
            } else {
                console.log(`📝 本地存储中没有找到数据: ${key}`);
                return defaultValue;
            }
        } catch (error) {
            console.error(`❌ 读取数据失败: ${key}`, error);
            return defaultValue;
        }
    }

    // 删除数据
    deleteData(key) {
        try {
            const storageKey = this.getStorageKey(key);
            localStorage.removeItem(storageKey);
            console.log(`🗑️ 数据已删除: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ 删除数据失败: ${key}`, error);
            return false;
        }
    }

    // 清空所有应用数据
    clearAllData() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));
            console.log(`🗑️ 已清空 ${keysToRemove.length} 个本地存储项`);
            return true;
        } catch (error) {
            console.error('❌ 清空数据失败', error);
            return false;
        }
    }

    // 获取存储使用情况
    getStorageInfo() {
        try {
            let totalSize = 0;
            let itemCount = 0;
            const items = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    const value = localStorage.getItem(key);
                    const size = new Blob([value]).size;
                    totalSize += size;
                    itemCount++;
                    items.push({
                        key: key.replace(this.storagePrefix, ''),
                        size: size,
                        sizeFormatted: this.formatBytes(size)
                    });
                }
            }

            return {
                totalSize: totalSize,
                totalSizeFormatted: this.formatBytes(totalSize),
                itemCount: itemCount,
                items: items
            };
        } catch (error) {
            console.error('❌ 获取存储信息失败', error);
            return null;
        }
    }

    // 格式化字节大小
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ==================== 用户相关操作 ====================

    // 保存用户信息
    async saveUser(userData) {
        const { userId } = userData;
        const user = {
            ...userData,
            updatedAt: new Date().toISOString()
        };

        return this.saveData(`user_${userId}`, user);
    }

    // 获取用户信息
    async getUser(userId) {
        return this.loadData(`user_${userId}`, null);
    }

    // ==================== 卡组相关操作 ====================

    // 保存卡组数据
    async saveCardSets(userId, cardSets) {
        console.log('开始保存卡组数据到本地存储...', { userId, cardSetsCount: cardSets.length });

        const success = this.saveData(`cardSets_${userId}`, cardSets);
        if (success) {
            console.log('✅ 卡组数据已保存到本地存储');
        } else {
            console.error('❌ 保存卡组数据失败');
        }
        return success;
    }

    // 获取卡组数据
    async getCardSets(userId) {
        console.log('开始从本地存储获取卡组数据...', { userId });

        const cardSets = this.loadData(`cardSets_${userId}`, []);
        console.log('✅ 卡组数据已从本地存储加载', { count: cardSets.length });
        return cardSets;
    }

    // ==================== 标签相关操作 ====================

    // 保存历史标签
    async saveHistoryTags(userId, tags) {
        console.log('开始保存历史标签到本地存储...', { userId, tagsCount: tags.length });

        const success = this.saveData(`historyTags_${userId}`, tags);
        if (success) {
            console.log('✅ 历史标签已保存到本地存储');
        } else {
            console.error('❌ 保存历史标签失败');
        }
        return success;
    }

    // 获取历史标签
    async getHistoryTags(userId) {
        const tags = this.loadData(`historyTags_${userId}`, []);
        console.log('✅ 历史标签已从本地存储加载');
        return tags;
    }

    // ==================== 数据迁移工具 ====================

    // 从旧格式迁移数据
    async migrateFromLegacyFormat(userId) {
        console.log('开始从旧格式迁移数据...', { userId });

        try {
            // 迁移卡组数据
            const legacyHistory = localStorage.getItem(`history_${userId}`);
            if (legacyHistory) {
                const cardSets = JSON.parse(legacyHistory);
                console.log(`迁移卡组数据，数量: ${cardSets.length}`);
                await this.saveCardSets(userId, cardSets);
                localStorage.removeItem(`history_${userId}`);
                console.log('✅ 卡组数据迁移完成');
            }

            // 迁移历史标签
            const legacyTags = localStorage.getItem(`cardSetHistoryTags_${userId}`);
            if (legacyTags) {
                const tags = JSON.parse(legacyTags);
                console.log(`迁移历史标签，数量: ${tags.length}`);
                await this.saveHistoryTags(userId, tags);
                localStorage.removeItem(`cardSetHistoryTags_${userId}`);
                console.log('✅ 历史标签迁移完成');
            }

            console.log('✅ 数据迁移完成');
        } catch (error) {
            console.error('❌ 数据迁移失败:', error);
        }
    }

    // 导出数据
    exportData(userId) {
        try {
            const user = this.loadData(`user_${userId}`);
            const cardSets = this.loadData(`cardSets_${userId}`, []);
            const tags = this.loadData(`historyTags_${userId}`, []);

            const exportData = {
                version: '1.0.0',
                exportDate: new Date().toISOString(),
                user: user,
                cardSets: cardSets,
                historyTags: tags
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `配对题生成器_数据备份_${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            console.log('✅ 数据导出完成');
            return true;
        } catch (error) {
            console.error('❌ 数据导出失败:', error);
            return false;
        }
    }

    // 导入数据
    importData(userId, jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.user) {
                this.saveData(`user_${userId}`, data.user);
            }

            if (data.cardSets) {
                this.saveData(`cardSets_${userId}`, data.cardSets);
            }

            if (data.historyTags) {
                this.saveData(`historyTags_${userId}`, data.historyTags);
            }

            console.log('✅ 数据导入完成');
            return true;
        } catch (error) {
            console.error('❌ 数据导入失败:', error);
            return false;
        }
    }
}

// 创建全局实例
const localStorageManager = new LocalStorageManager();

// 导出（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocalStorageManager, localStorageManager };
} 