// 授权码管理器 - 本地验证系统
class LicenseManager {
    constructor() {
        this.licensePrefix = 'PAIRING_';
        this.validLicenses = new Set();
        this.loadValidLicenses();
    }

    // 加载有效的授权码列表
    loadValidLicenses() {
        // 这里可以硬编码一些测试授权码
        const testLicenses = [
            'PAIRING_TEST_001',
            'PAIRING_TEST_002', 
            'PAIRING_DEMO_001',
            'PAIRING_FREE_001',
            'PAIRING_PREMIUM_001',
            'PAIRING_ADMIN_001'  // 管理员授权码
        ];
        
        testLicenses.forEach(license => {
            this.validLicenses.add(license);
        });

        // 从localStorage加载用户购买的授权码
        const userLicenses = localStorage.getItem('user_licenses');
        if (userLicenses) {
            try {
                const licenses = JSON.parse(userLicenses);
                licenses.forEach(license => {
                    this.validLicenses.add(license);
                });
            } catch (error) {
                console.error('加载用户授权码失败:', error);
            }
        }

        // 加载已分发的授权码（确保新生成的授权码对所有用户有效）
        this.loadDistributedLicenses();
    }

    // 加载已分发的授权码
    loadDistributedLicenses() {
        try {
            const distributed = localStorage.getItem('pairing_license_distribution');
            if (distributed) {
                const distributedLicenses = JSON.parse(distributed);
                console.log('从localStorage加载分发记录:', distributedLicenses);
                distributedLicenses.forEach(license => {
                    if (license.status === 'active') {
                        // 确保授权码以大写形式存储，与验证时保持一致
                        const upperCode = license.code.toUpperCase();
                        this.validLicenses.add(upperCode);
                        console.log('加载分发授权码:', upperCode);
                    }
                });
            } else {
                console.log('没有找到分发记录');
            }
        } catch (error) {
            console.error('加载分发授权码失败:', error);
        }
    }

    // 验证授权码
    validateLicense(licenseCode) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        
        console.log('验证授权码:', trimmedCode);
        console.log('当前有效授权码数量:', this.validLicenses.size);
        console.log('有效授权码列表:', Array.from(this.validLicenses));
        
        // 检查格式
        if (!this.isValidFormat(trimmedCode)) {
            console.log('格式检查失败');
            return {
                valid: false,
                message: '授权码格式不正确',
                type: 'format_error'
            };
        }

        // 检查是否在有效列表中
        if (this.validLicenses.has(trimmedCode)) {
            console.log('授权码验证成功');
            return {
                valid: true,
                message: '授权码验证成功',
                type: 'success',
                license: trimmedCode
            };
        }

        // 检查是否是免费试用码
        if (this.isTrialCode(trimmedCode)) {
            console.log('试用码验证成功');
            return {
                valid: true,
                message: '试用授权码验证成功',
                type: 'trial',
                license: trimmedCode
            };
        }

        // 检查是否是管理员码
        if (this.isAdminCode(trimmedCode)) {
            console.log('管理员码验证成功');
            return {
                valid: true,
                message: '管理员授权码验证成功',
                type: 'admin',
                license: trimmedCode
            };
        }

        console.log('授权码验证失败');
        return {
            valid: false,
            message: '授权码无效或已过期',
            type: 'invalid'
        };
    }

    // 检查授权码格式
    isValidFormat(code) {
        // 基本格式检查：PAIRING_开头，包含字母数字
        const formatRegex = /^PAIRING_[A-Z0-9_]{8,}$/;
        return formatRegex.test(code);
    }

    // 检查是否是试用码
    isTrialCode(code) {
        return code.startsWith('PAIRING_TRIAL_') || 
               code.startsWith('PAIRING_DEMO_') ||
               code.startsWith('PAIRING_FREE_');
    }

    // 检查是否是管理员码
    isAdminCode(code) {
        return code.startsWith('PAIRING_ADMIN_');
    }

    // 添加新的授权码
    addLicense(licenseCode) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        if (this.isValidFormat(trimmedCode)) {
            this.validLicenses.add(trimmedCode);
            this.saveUserLicenses();
            return true;
        }
        return false;
    }

    // 保存用户授权码到localStorage
    saveUserLicenses() {
        const userLicenses = Array.from(this.validLicenses)
            .filter(license => !license.startsWith('PAIRING_TEST_'));
        
        localStorage.setItem('user_licenses', JSON.stringify(userLicenses));
    }

    // 获取授权码信息
    getLicenseInfo(licenseCode) {
        const trimmedCode = licenseCode.trim().toUpperCase();
        
        if (trimmedCode.startsWith('PAIRING_PREMIUM_')) {
            return {
                type: 'premium',
                name: '高级版',
                features: ['无限卡组', '数据导出', '高级功能'],
                validUntil: '永久有效'
            };
        } else if (trimmedCode.startsWith('PAIRING_TRIAL_')) {
            return {
                type: 'trial',
                name: '试用版',
                features: ['基础功能', '30天试用'],
                validUntil: '30天后过期'
            };
        } else if (trimmedCode.startsWith('PAIRING_FREE_')) {
            return {
                type: 'free',
                name: '免费版',
                features: ['基础功能'],
                validUntil: '永久有效'
            };
        } else if (trimmedCode.startsWith('PAIRING_ADMIN_')) {
            return {
                type: 'admin',
                name: '管理员版',
                features: ['所有功能', '授权码管理', '系统管理'],
                validUntil: '永久有效'
            };
        }
        
        return {
            type: 'standard',
            name: '标准版',
            features: ['基础功能'],
            validUntil: '永久有效'
        };
    }

    // 生成授权码（用于测试）
    generateLicense(type = 'standard') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        
        switch (type) {
            case 'premium':
                return `PAIRING_PREMIUM_${timestamp}_${random}`;
            case 'trial':
                return `PAIRING_TRIAL_${timestamp}_${random}`;
            case 'free':
                return `PAIRING_FREE_${timestamp}_${random}`;
            case 'admin':
                return `PAIRING_ADMIN_${timestamp}_${random}`;
            default:
                return `PAIRING_STD_${timestamp}_${random}`;
        }
    }

    // 获取统计信息
    getStats() {
        const totalLicenses = this.validLicenses.size;
        const premiumLicenses = Array.from(this.validLicenses)
            .filter(license => license.startsWith('PAIRING_PREMIUM_')).length;
        const trialLicenses = Array.from(this.validLicenses)
            .filter(license => license.startsWith('PAIRING_TRIAL_')).length;
        const freeLicenses = Array.from(this.validLicenses)
            .filter(license => license.startsWith('PAIRING_FREE_')).length;

        return {
            total: totalLicenses,
            premium: premiumLicenses,
            trial: trialLicenses,
            free: freeLicenses
        };
    }
}

// 创建全局实例
const licenseManager = new LicenseManager();

// 导出（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LicenseManager, licenseManager };
} 