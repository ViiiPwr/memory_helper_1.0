// 云数据库操作函数
class CloudDatabase {
    constructor() {
        this.db = getDatabase();
        this.collections = CLOUD_CONFIG.collections;
    }

    // 检查云开发是否可用
    isAvailable() {
        return this.db !== null;
    }

    // ==================== 用户相关操作 ====================

    // 保存用户信息
    async saveUser(userData) {
        if (!this.isAvailable()) {
            console.warn('云开发不可用，使用本地存储');
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return;
        }

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
        if (!this.isAvailable()) {
            console.warn('云开发不可用，使用本地存储');
            const savedUser = localStorage.getItem('currentUser');
            return savedUser ? JSON.parse(savedUser) : null;
        }

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
        if (!this.isAvailable()) {
            console.warn('云开发不可用，使用本地存储');
            localStorage.setItem(`history_${userId}`, JSON.stringify(cardSets));
            return;
        }

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

            console.log('卡组数据已保存到云数据库');
        } catch (error) {
            console.error('保存卡组数据失败:', error);
            // 降级到本地存储
            localStorage.setItem(`history_${userId}`, JSON.stringify(cardSets));
        }
    }

    // 获取卡组数据
    async getCardSets(userId) {
        if (!this.isAvailable()) {
            console.warn('云开发不可用，使用本地存储');
            const userHistory = localStorage.getItem(`history_${userId}`);
            return userHistory ? JSON.parse(userHistory) : [];
        }

        try {
            const result = await this.db.collection(this.collections.cardSets)
                .where({ userId })
                .orderBy('createdAt', 'desc')
                .get();

            return result.data.map(item => ({
                id: item.cardSetId,
                title: item.title,
                tags: item.tags,
                groups: item.groups,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }));
        } catch (error) {
            console.error('获取卡组数据失败:', error);
            // 降级到本地存储
            const userHistory = localStorage.getItem(`history_${userId}`);
            return userHistory ? JSON.parse(userHistory) : [];
        }
    }

    // ==================== 标签相关操作 ====================

    // 保存历史标签
    async saveHistoryTags(userId, tags) {
        if (!this.isAvailable()) {
            console.warn('云开发不可用，使用本地存储');
            localStorage.setItem(`cardSetHistoryTags_${userId}`, JSON.stringify(tags));
            return;
        }

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

            console.log('历史标签已保存到云数据库');
        } catch (error) {
            console.error('保存历史标签失败:', error);
            // 降级到本地存储
            localStorage.setItem(`cardSetHistoryTags_${userId}`, JSON.stringify(tags));
        }
    }

    // 获取历史标签
    async getHistoryTags(userId) {
        if (!this.isAvailable()) {
            console.warn('云开发不可用，使用本地存储');
            const saved = localStorage.getItem(`cardSetHistoryTags_${userId}`);
            return saved ? JSON.parse(saved) : [];
        }

        try {
            const result = await this.db.collection(this.collections.historyTags)
                .where({ userId })
                .get();

            return result.data.length > 0 ? result.data[0].tags : [];
        } catch (error) {
            console.error('获取历史标签失败:', error);
            // 降级到本地存储
            const saved = localStorage.getItem(`cardSetHistoryTags_${userId}`);
            return saved ? JSON.parse(saved) : [];
        }
    }

    // ==================== 数据迁移工具 ====================

    // 从本地存储迁移数据到云数据库
    async migrateFromLocalStorage(userId) {
        if (!this.isAvailable()) {
            console.warn('云开发不可用，无法迁移数据');
            return;
        }

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