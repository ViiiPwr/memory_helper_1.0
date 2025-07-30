// 授权码管理系统 V2 - 预置授权码 + 分发管理
class LicenseManagerV2 {
    constructor() {
        this.licensePrefix = 'PAIRING_PREMIUM_';
        this.predefinedLicenses = new Map(); // 预置的授权码池
        this.usedLicenses = new Set(); // 已使用的授权码
        this.distributedLicenses = new Map(); // 分发记录
        
        this.initPredefinedLicenses();
        this.loadUsedLicenses();
        this.loadDistributionRecords();
    }

    // 初始化预置授权码池（100000个）
    initPredefinedLicenses() {
        console.log('正在初始化预置授权码池...');
        
        // 生成100000个预置授权码
        for (let i = 1; i <= 100000; i++) {
            const licenseCode = this.generateLicenseCode(i);
            this.predefinedLicenses.set(licenseCode, {
                id: i,
                code: licenseCode,
                status: 'available', // available, used, distributed
                createdAt: new Date().toISOString(),
                usedAt: null,
                distributedAt: null,
                customerInfo: null
            });
        }
        
        console.log(`预置授权码池初始化完成，共 ${this.predefinedLicenses.size} 个授权码`);
        
        // 调试：显示前几个授权码
        console.log('前5个授权码示例:');
        for (let i = 1; i <= 5; i++) {
            const code = this.generateLicenseCode(i);
            console.log(`ID ${i}: ${code}`);
        }
    }

    // 生成授权码
    generateLicenseCode(id) {
        const paddedId = id.toString().padStart(6, '0');
        // 使用固定的种子生成随机字符串，确保每次生成相同的授权码
        const seed = id * 12345 + 67890;
        const random1 = this.generateRandomString(seed, 8);
        const random2 = this.generateRandomString(seed + 1, 6);
        return `PAIRING_PREMIUM_${paddedId}_${random1}_${random2}`;
    }

    // 基于种子生成固定随机字符串
    generateRandomString(seed, length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        let currentSeed = seed;
        
        for (let i = 0; i < length; i++) {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            result += chars[currentSeed % chars.length];
        }
        
        return result;
    }

    // 验证授权码
    validateLicense(licenseCode) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        
        console.log('验证授权码:', trimmedCode);
        
        // 检查格式
        if (!this.isValidFormat(trimmedCode)) {
            return {
                valid: false,
                message: '授权码格式不正确',
                type: 'format_error'
            };
        }

        // 检查是否在预置列表中
        if (!this.predefinedLicenses.has(trimmedCode)) {
            return {
                valid: false,
                message: '授权码不存在',
                type: 'not_found'
            };
        }

        const licenseInfo = this.predefinedLicenses.get(trimmedCode);
        
        // 检查是否已被使用
        if (licenseInfo.status === 'used') {
            return {
                valid: false,
                message: '授权码已被使用',
                type: 'already_used'
            };
        }

        // 检查是否是管理员码
        if (trimmedCode.startsWith('PAIRING_ADMIN_')) {
            return {
                valid: true,
                message: '管理员授权码验证成功',
                type: 'admin',
                license: trimmedCode
            };
        }

        // 验证成功
        return {
            valid: true,
            message: '授权码验证成功',
            type: 'success',
            license: trimmedCode
        };
    }

    // 分发授权码
    distributeLicense(licenseCode, customerInfo = {}) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        
        // 检查授权码是否存在
        if (!this.predefinedLicenses.has(trimmedCode)) {
            return {
                success: false,
                message: '授权码不存在'
            };
        }

        const licenseInfo = this.predefinedLicenses.get(trimmedCode);
        
        // 检查是否已被使用
        if (licenseInfo.status === 'used') {
            return {
                success: false,
                message: '授权码已被使用'
            };
        }

        // 检查是否已被分发
        if (licenseInfo.status === 'distributed') {
            return {
                success: false,
                message: '授权码已被分发'
            };
        }

        // 更新授权码状态
        licenseInfo.status = 'distributed';
        licenseInfo.distributedAt = new Date().toISOString();
        licenseInfo.customerInfo = customerInfo;

        // 保存分发记录
        this.distributedLicenses.set(trimmedCode, licenseInfo);
        this.saveDistributionRecords();

        console.log(`授权码分发成功: ${trimmedCode}`);
        
        return {
            success: true,
            message: '授权码分发成功',
            licenseInfo: licenseInfo
        };
    }

    // 标记授权码为已使用
    markAsUsed(licenseCode) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        
        if (!this.predefinedLicenses.has(trimmedCode)) {
            return {
                success: false,
                message: '授权码不存在'
            };
        }

        const licenseInfo = this.predefinedLicenses.get(trimmedCode);
        
        if (licenseInfo.status === 'used') {
            return {
                success: false,
                message: '授权码已被使用'
            };
        }

        // 更新状态
        licenseInfo.status = 'used';
        licenseInfo.usedAt = new Date().toISOString();
        
        // 添加到已使用列表
        this.usedLicenses.add(trimmedCode);
        this.saveUsedLicenses();

        console.log(`授权码标记为已使用: ${trimmedCode}`);
        
        return {
            success: true,
            message: '授权码已标记为使用',
            licenseInfo: licenseInfo
        };
    }

    // 获取授权码信息
    getLicenseInfo(licenseCode) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        
        if (trimmedCode.startsWith('PAIRING_ADMIN_')) {
            return {
                type: 'admin',
                name: '管理员版',
                features: ['所有功能', '授权码管理', '系统管理'],
                validUntil: '永久有效'
            };
        }
        
        return {
            type: 'premium',
            name: '高级版',
            features: ['无限卡组创建', '数据导出功能', '高级统计功能', '优先技术支持', '完整功能访问', '无使用限制'],
            validUntil: '永久有效'
        };
    }

    // 获取统计信息
    getStats() {
        const total = this.predefinedLicenses.size;
        const available = Array.from(this.predefinedLicenses.values()).filter(l => l.status === 'available').length;
        const distributed = Array.from(this.predefinedLicenses.values()).filter(l => l.status === 'distributed').length;
        const used = this.usedLicenses.size;

        return {
            total,
            available,
            distributed,
            used
        };
    }

    // 获取可用授权码列表（分页）
    getAvailableLicenses(page = 1, pageSize = 50) {
        const availableLicenses = Array.from(this.predefinedLicenses.values())
            .filter(l => l.status === 'available')
            .sort((a, b) => a.id - b.id);

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        return {
            licenses: availableLicenses.slice(start, end),
            total: availableLicenses.length,
            page,
            pageSize,
            totalPages: Math.ceil(availableLicenses.length / pageSize)
        };
    }

    // 获取已分发授权码列表
    getDistributedLicenses() {
        return Array.from(this.distributedLicenses.values());
    }

    // 获取已使用授权码列表
    getUsedLicenses() {
        return Array.from(this.usedLicenses);
    }

    // 搜索授权码
    searchLicenses(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const [code, info] of this.predefinedLicenses) {
            if (code.toLowerCase().includes(searchTerm) || 
                (info.customerInfo && info.customerInfo.customer && 
                 info.customerInfo.customer.toLowerCase().includes(searchTerm))) {
                results.push(info);
            }
        }
        
        return results;
    }

    // 检查授权码格式
    isValidFormat(code) {
        const formatRegex = /^PAIRING_PREMIUM_\d{6}_[A-Z0-9]{8}_[A-Z0-9]{6}$/;
        return formatRegex.test(code);
    }

    // 保存已使用授权码
    saveUsedLicenses() {
        try {
            localStorage.setItem('used_licenses', JSON.stringify(Array.from(this.usedLicenses)));
        } catch (error) {
            console.error('保存已使用授权码失败:', error);
        }
    }

    // 加载已使用授权码
    loadUsedLicenses() {
        try {
            const usedLicenses = localStorage.getItem('used_licenses');
            if (usedLicenses) {
                const usedArray = JSON.parse(usedLicenses);
                this.usedLicenses = new Set(usedArray);
                
                // 更新预置授权码状态
                for (const code of this.usedLicenses) {
                    if (this.predefinedLicenses.has(code)) {
                        this.predefinedLicenses.get(code).status = 'used';
                        this.predefinedLicenses.get(code).usedAt = new Date().toISOString();
                    }
                }
            }
        } catch (error) {
            console.error('加载已使用授权码失败:', error);
        }
    }

    // 保存分发记录
    saveDistributionRecords() {
        try {
            const records = Array.from(this.distributedLicenses.values());
            localStorage.setItem('distribution_records', JSON.stringify(records));
        } catch (error) {
            console.error('保存分发记录失败:', error);
        }
    }

    // 加载分发记录
    loadDistributionRecords() {
        try {
            const records = localStorage.getItem('distribution_records');
            if (records) {
                const recordsArray = JSON.parse(records);
                this.distributedLicenses = new Map();
                
                for (const record of recordsArray) {
                    this.distributedLicenses.set(record.code, record);
                    
                    // 更新预置授权码状态
                    if (this.predefinedLicenses.has(record.code)) {
                        this.predefinedLicenses.get(record.code).status = 'distributed';
                        this.predefinedLicenses.get(record.code).distributedAt = record.distributedAt;
                        this.predefinedLicenses.get(record.code).customerInfo = record.customerInfo;
                    }
                }
            }
        } catch (error) {
            console.error('加载分发记录失败:', error);
        }
    }

    // 导出数据
    exportData() {
        return {
            exportedAt: new Date().toISOString(),
            stats: this.getStats(),
            distributedLicenses: this.getDistributedLicenses(),
            usedLicenses: this.getUsedLicenses()
        };
    }

    // 重置系统
    resetSystem() {
        this.usedLicenses.clear();
        this.distributedLicenses.clear();
        
        // 重置所有预置授权码状态
        for (const license of this.predefinedLicenses.values()) {
            license.status = 'available';
            license.usedAt = null;
            license.distributedAt = null;
            license.customerInfo = null;
        }
        
        this.saveUsedLicenses();
        this.saveDistributionRecords();
        
        console.log('授权码系统已重置');
    }
}

// 创建全局实例
const licenseManagerV2 = new LicenseManagerV2();

// 导出（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LicenseManagerV2, licenseManagerV2 };
} 