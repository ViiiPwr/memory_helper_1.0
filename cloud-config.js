// 腾讯云云开发配置
const CLOUD_CONFIG = {
    // 环境ID - 请替换为你的实际环境ID
    // 获取方式：腾讯云控制台 -> 云开发 -> 环境管理 -> 环境ID
    envId: 'cloud1-3gk2wadje2fe35be',

    // 数据库集合名称
    collections: {
        users: 'users',
        cardSets: 'cardSets',
        historyTags: 'historyTags'
    }
};

// 初始化云开发
function initCloud() {
    if (typeof tcb !== 'undefined') {
        // 如果已经加载了云开发SDK
        const app = tcb.init({
            env: CLOUD_CONFIG.envId
        });
        return app;
    } else {
        console.warn('腾讯云云开发SDK未加载');
        return null;
    }
}

// 获取数据库实例
function getDatabase() {
    const app = initCloud();
    if (app) {
        return app.database();
    }
    return null;
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLOUD_CONFIG, initCloud, getDatabase };
} 