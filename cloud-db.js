// 云数据库操作函数
class CloudDatabase {
    constructor() {
        this.db = getDatabase();
        this.collections = CLOUD_CONFIG.collections;
    }

    // 检查云开发是否可用
    isAvailable() {
        // 检查新的 @cloudbase/js-sdk 是否加载
        if (typeof cloudbase !== 'undefined') {
            console.log('检测到 @cloudbase/js-sdk');
            if (!this.db) {
                console.log('数据库实例不可用');
                return false;
            }
            if (!CLOUD_CONFIG || !CLOUD_CONFIG.envId || CLOUD_CONFIG.envId === 'your-env-id-here') {
                console.log('环境ID未正确配置');
                return false;
            }
            return true;
        }
        // 检查 tcb SDK 是否加载
        else if (typeof tcb !== 'undefined') {
            console.log('检测到 tcb SDK');
            if (!this.db) {
                console.log('数据库实例不可用');
                return false;
            }
            if (!CLOUD_CONFIG || !CLOUD_CONFIG.envId || CLOUD_CONFIG.envId === 'your-env-id-here') {
                console.log('环境ID未正确配置');
                return false;
            }
            return true;
        } else {
            console.log('云开发SDK未加载');
            return false;
        }
    }

    // ==================== 用户相关操作 ====================

    // 保存用户信息
    async saveUser(userData) {
        try {
            const { userId } = userData;
            const user = {
                ...userData,
                updatedAt: new Date().toISOString()
            };

            // 检查用户是否已存在
            const existingUser = await this.db.collection(this.collections.users)
                .where({ userId })
                .get();

            if (existingUser.data.length > 0) {
                // 更新现有用户
                await this.db.collection(this.collections.users)
                    .where({ userId })
                    .update(user);
            } else {
                // 创建新用户
                user.createdAt = new Date().toISOString();
                await this.db.collection(this.collections.users).add(user);
            }

            console.log('用户数据已保存到云数据库');
        } catch (error) {
            console.error('保存用户数据失败:', error);
            // 降级到本地存储
            localStorage.setItem('currentUser', JSON.stringify(userData));
        }
    }

    // 获取用户信息
    async getUser(userId) {
        try {
            const result = await this.db.collection(this.collections.users)
                .where({ userId })
                .get();

            return result.data.length > 0 ? result.data[0] : null;
        } catch (error) {
            console.error('获取用户数据失败:', error);
            // 降级到本地存储
            const savedUser = localStorage.getItem('currentUser');
            return savedUser ? JSON.parse(savedUser) : null;
        }
    }

    // ==================== 卡组相关操作 ====================

    // 保存卡组数据
    async saveCardSets(userId, cardSets) {
        try {
            // 删除该用户的所有卡组
            await this.db.collection(this.collections.cardSets)
                .where({ userId })
                .remove();

            // 批量添加卡组
            if (cardSets.length > 0) {
                const cardSetData = cardSets.map(cardSet => ({
                    userId,
                    cardSetId: cardSet.id || Date.now().toString(),
                    title: cardSet.title,
                    tags: cardSet.tags || [],
                    groups: cardSet.groups,
                    createdAt: cardSet.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));

                await this.db.collection(this.collections.cardSets).add(cardSetData);
            }

            console.log('✅ 卡组数据已保存到云数据库');
        } catch (error) {
            console.error('❌ 保存卡组数据到云数据库失败:', error);
            // 降级到本地存储
            localStorage.setItem(`history_${userId}`, JSON.stringify(cardSets));
            console.log('✅ 卡组数据已保存到本地存储');
            throw error; // 抛出异常，让调用方知道保存失败
        }
    }

    // 获取卡组数据
    async getCardSets(userId) {
        try {
            const result = await this.db.collection(this.collections.cardSets)
                .where({ userId })
                .orderBy('createdAt', 'desc')
                .get();

            const cardSets = result.data.map(item => ({
                id: item.cardSetId,
                title: item.title,
                tags: item.tags,
                groups: item.groups,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }));

            console.log('卡组数据已从云数据库加载');
            return cardSets;
        } catch (error) {
            console.error('从云数据库获取卡组数据失败:', error);
            throw error; // 抛出异常，让调用方处理降级
        }
    }

    // ==================== 标签相关操作 ====================

    // 保存历史标签
    async saveHistoryTags(userId, tags) {
        try {
            // 检查是否已存在该用户的标签记录
            const existingTags = await this.db.collection(this.collections.historyTags)
                .where({ userId })
                .get();

            if (existingTags.data.length > 0) {
                // 更新现有记录
                await this.db.collection(this.collections.historyTags)
                    .where({ userId })
                    .update({
                        tags,
                        updatedAt: new Date().toISOString()
                    });
            } else {
                // 创建新记录
                await this.db.collection(this.collections.historyTags).add({
                    userId,
                    tags,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }

            console.log('✅ 历史标签已保存到云数据库');
        } catch (error) {
            console.error('❌ 保存历史标签到云数据库失败:', error);
            // 降级到本地存储
            localStorage.setItem(`cardSetHistoryTags_${userId}`, JSON.stringify(tags));
            console.log('✅ 历史标签已保存到本地存储');
            throw error; // 抛出异常，让调用方知道保存失败
        }
    }

    // 获取历史标签
    async getHistoryTags(userId) {
        try {
            const result = await this.db.collection(this.collections.historyTags)
                .where({ userId })
                .get();

            const tags = result.data.length > 0 ? result.data[0].tags : [];
            console.log('历史标签已从云数据库加载');
            return tags;
        } catch (error) {
            console.error('从云数据库获取历史标签失败:', error);
            throw error; // 抛出异常，让调用方处理降级
        }
    }

    // ==================== 数据迁移工具 ====================

    // 从本地存储迁移数据到云数据库
    async migrateFromLocalStorage(userId) {
        try {
            // 迁移卡组数据
            const localHistory = localStorage.getItem(`history_${userId}`);
            if (localHistory) {
                const cardSets = JSON.parse(localHistory);
                await this.saveCardSets(userId, cardSets);
                console.log('卡组数据迁移完成');
            }

            // 迁移历史标签
            const localTags = localStorage.getItem(`cardSetHistoryTags_${userId}`);
            if (localTags) {
                const tags = JSON.parse(localTags);
                await this.saveHistoryTags(userId, tags);
                console.log('历史标签迁移完成');
            }

            console.log('数据迁移完成');
        } catch (error) {
            console.error('数据迁移失败:', error);
        }
    }
}

// 创建全局实例
const cloudDB = new CloudDatabase();

// 导出（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudDatabase, cloudDB };
} 