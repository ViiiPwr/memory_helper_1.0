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
async function initCloud() {
    // 优先使用官方推荐的 cloudbase SDK
    if (typeof cloudbase !== 'undefined') {
        console.log('使用官方 cloudbase SDK');
        const app = cloudbase.init({
            env: CLOUD_CONFIG.envId
        });

        // 进行匿名登录
        try {
            const auth = app.auth();
            await auth.signInAnonymously();
            console.log('✅ 匿名登录成功');
        } catch (error) {
            console.error('❌ 匿名登录失败:', error);
        }

        return app;
    }
    // 降级使用 tcb SDK
    else if (typeof tcb !== 'undefined') {
        console.log('使用 tcb SDK');
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
async function getDatabase() {
    const app = await initCloud();
    if (app) {
        return app.database();
    }
    return null;
}

// 获取数据模型实例（如果支持）
async function getModels() {
    const app = await initCloud();
    if (app && app.models) {
        return app.models;
    }
    return null;
}

// 获取认证实例（如果支持）
async function getAuth() {
    const app = await initCloud();
    if (app && app.auth) {
        return app.auth();
    }
    return null;
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLOUD_CONFIG, initCloud, getDatabase, getModels, getAuth };
} 