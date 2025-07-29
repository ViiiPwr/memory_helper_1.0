// 云数据库操作函数
class CloudDatabase {
    constructor() {
        this.collections = CLOUD_CONFIG.collections;
        this._db = null; // 延迟初始化
        this._initialized = false; // 初始化状态
    }

    // 获取数据库实例（延迟初始化）
    async getDatabase() {
        if (!this._db && !this._initialized) {
            this._initialized = true;
            this._db = await getDatabase();
        }
        return this._db;
    }

    // 检查云开发是否可用
    async isAvailable() {
        // 检查官方推荐的 cloudbase SDK 是否加载
        if (typeof cloudbase !== 'undefined') {
            console.log('检测到官方 cloudbase SDK');

            // 检查配置
            if (!CLOUD_CONFIG || !CLOUD_CONFIG.envId || CLOUD_CONFIG.envId === 'your-env-id-here') {
                console.log('环境ID未正确配置');
                return false;
            }

            // 尝试初始化应用
            try {
                const app = await initCloud();
                if (app) {
                    console.log('云开发应用初始化成功');
                    return true;
                } else {
                    console.log('云开发应用初始化失败');
                    return false;
                }
            } catch (error) {
                console.log('云开发应用初始化出错:', error.message);
                return false;
            }
        }
        // 检查 tcb SDK 是否加载
        else if (typeof tcb !== 'undefined') {
            console.log('检测到 tcb SDK');

            // 检查配置
            if (!CLOUD_CONFIG || !CLOUD_CONFIG.envId || CLOUD_CONFIG.envId === 'your-env-id-here') {
                console.log('环境ID未正确配置');
                return false;
            }

            // 尝试初始化应用
            try {
                const app = tcb.init({
                    env: CLOUD_CONFIG.envId
                });
                if (app) {
                    console.log('云开发应用初始化成功');
                    return true;
                } else {
                    console.log('云开发应用初始化失败');
                    return false;
                }
            } catch (error) {
                console.log('云开发应用初始化出错:', error.message);
                return false;
            }
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

            const db = await this.getDatabase();
            if (!db) {
                throw new Error('数据库实例不可用');
            }

            // 检查用户是否已存在
            const existingUser = await db.collection(this.collections.users)
                .where({ userId })
                .get();

            if (existingUser.data.length > 0) {
                // 更新现有用户
                await db.collection(this.collections.users)
                    .where({ userId })
                    .update(user);
            } else {
                // 创建新用户
                user.createdAt = new Date().toISOString();
                await db.collection(this.collections.users).add(user);
            }

            console.log('✅ 用户数据已保存到云数据库');
        } catch (error) {
            console.error('❌ 保存用户数据失败:', error);
            // 降级到本地存储
            localStorage.setItem('currentUser', JSON.stringify(userData));
            throw error;
        }
    }

    // 获取用户信息
    async getUser(userId) {
        try {
            const db = await this.getDatabase();
            if (!db) {
                throw new Error('数据库实例不可用');
            }

            const result = await db.collection(this.collections.users)
                .where({ userId })
                .get();

            return result.data.length > 0 ? result.data[0] : null;
        } catch (error) {
            console.error('❌ 获取用户数据失败:', error);
            // 降级到本地存储
            const savedUser = localStorage.getItem('currentUser');
            return savedUser ? JSON.parse(savedUser) : null;
        }
    }

    // ==================== 卡组相关操作 ====================

    // 保存卡组数据
    async saveCardSets(userId, cardSets) {
        console.log('开始保存卡组数据到云端...', { userId, cardSetsCount: cardSets.length });

        try {
            // 检查数据库连接
            const db = await this.getDatabase();
            if (!db) {
                throw new Error('数据库实例不可用');
            }

            console.log('数据库连接正常，开始删除旧数据...');

            // 删除该用户的所有卡组
            await db.collection(this.collections.cardSets)
                .where({ userId })
                .remove();

            console.log('旧数据删除完成，开始添加新数据...');

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

                console.log('准备添加卡组数据:', cardSetData);
                await db.collection(this.collections.cardSets).add(cardSetData);
            }

            console.log('✅ 卡组数据已保存到云数据库');
        } catch (error) {
            console.error('❌ 保存卡组数据到云数据库失败:', error);
            console.error('错误详情:', {
                message: error.message,
                stack: error.stack,
                userId,
                cardSetsCount: cardSets.length
            });
            // 降级到本地存储
            localStorage.setItem(`history_${userId}`, JSON.stringify(cardSets));
            console.log('✅ 卡组数据已保存到本地存储');
            throw error; // 抛出异常，让调用方知道保存失败
        }
    }

    // 获取卡组数据
    async getCardSets(userId) {
        console.log('开始从云端获取卡组数据...', { userId });

        try {
            // 检查数据库连接
            const db = await this.getDatabase();
            if (!db) {
                throw new Error('数据库实例不可用');
            }

            console.log('数据库连接正常，开始查询数据...');

            const result = await db.collection(this.collections.cardSets)
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

            console.log('✅ 卡组数据已从云数据库加载', { count: cardSets.length });
            return cardSets;
        } catch (error) {
            console.error('❌ 从云数据库获取卡组数据失败:', error);
            console.error('错误详情:', {
                message: error.message,
                stack: error.stack,
                userId
            });
            throw error; // 抛出异常，让调用方处理降级
        }
    }

    // ==================== 标签相关操作 ====================

    // 保存历史标签
    async saveHistoryTags(userId, tags) {
        try {
            const db = await this.getDatabase();
            if (!db) {
                throw new Error('数据库实例不可用');
            }

            // 检查是否已存在该用户的标签记录
            const existingTags = await db.collection(this.collections.historyTags)
                .where({ userId })
                .get();

            if (existingTags.data.length > 0) {
                // 更新现有记录
                await db.collection(this.collections.historyTags)
                    .where({ userId })
                    .update({
                        tags,
                        updatedAt: new Date().toISOString()
                    });
            } else {
                // 创建新记录
                await db.collection(this.collections.historyTags).add({
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
            const db = await this.getDatabase();
            if (!db) {
                throw new Error('数据库实例不可用');
            }

            const result = await db.collection(this.collections.historyTags)
                .where({ userId })
                .get();

            const tags = result.data.length > 0 ? result.data[0].tags : [];
            console.log('✅ 历史标签已从云数据库加载');
            return tags;
        } catch (error) {
            console.error('❌ 从云数据库获取历史标签失败:', error);
            throw error; // 抛出异常，让调用方处理降级
        }
    }

    // ==================== 数据迁移工具 ====================

    // 从本地存储迁移数据到云数据库
    async migrateFromLocalStorage(userId) {
        console.log('开始数据迁移...', { userId });

        // 首先检查云开发是否可用
        const isAvailable = await this.isAvailable();
        if (!isAvailable) {
            console.log('❌ 云开发不可用，无法迁移数据');
            return;
        }

        try {
            console.log('✅ 云开发可用，开始迁移数据...');

            // 迁移卡组数据
            const localHistory = localStorage.getItem(`history_${userId}`);
            if (localHistory) {
                const cardSets = JSON.parse(localHistory);
                console.log(`迁移卡组数据，数量: ${cardSets.length}`);
                await this.saveCardSets(userId, cardSets);
                console.log('✅ 卡组数据迁移完成');
            } else {
                console.log('没有本地卡组数据需要迁移');
            }

            // 迁移历史标签
            const localTags = localStorage.getItem(`cardSetHistoryTags_${userId}`);
            if (localTags) {
                const tags = JSON.parse(localTags);
                console.log(`迁移历史标签，数量: ${tags.length}`);
                await this.saveHistoryTags(userId, tags);
                console.log('✅ 历史标签迁移完成');
            } else {
                console.log('没有本地标签数据需要迁移');
            }

            console.log('✅ 数据迁移完成');
        } catch (error) {
            console.error('❌ 数据迁移失败:', error);
            console.error('错误详情:', {
                message: error.message,
                stack: error.stack,
                userId
            });
        }
    }
}

// 创建全局实例
const cloudDB = new CloudDatabase();

// 导出（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudDatabase, cloudDB };
} 