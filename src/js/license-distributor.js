// 授权码分发系统 - 确保新授权码能被所有用户使用
class LicenseDistributor {
    constructor() {
        this.distributionKey = 'pairing_license_distribution';
        this.loadDistributedLicenses();
    }

    // 加载已分发的授权码
    loadDistributedLicenses() {
        try {
            const distributed = localStorage.getItem(this.distributionKey);
            if (distributed) {
                this.distributedLicenses = JSON.parse(distributed);
            } else {
                this.distributedLicenses = [];
            }
        } catch (error) {
            console.error('加载分发授权码失败:', error);
            this.distributedLicenses = [];
        }
    }

    // 分发新授权码（管理员操作）
    distributeLicense(licenseCode, licenseType, customerInfo = {}) {
        const licenseData = {
            code: licenseCode,
            type: licenseType,
            distributedAt: new Date().toISOString(),
            customerInfo: customerInfo,
            status: 'active'
        };

        this.distributedLicenses.push(licenseData);
        this.saveDistributedLicenses();
        
        console.log(`✅ 授权码已分发: ${licenseCode}`);
        console.log('当前分发记录:', this.distributedLicenses);
        return true;
    }

    // 保存分发记录
    saveDistributedLicenses() {
        try {
            localStorage.setItem(this.distributionKey, JSON.stringify(this.distributedLicenses));
            console.log('分发记录已保存到localStorage:', this.distributionKey);
        } catch (error) {
            console.error('保存分发记录失败:', error);
        }
    }

    // 获取所有已分发的授权码
    getAllDistributedLicenses() {
        return this.distributedLicenses;
    }

    // 获取活跃的授权码
    getActiveLicenses() {
        return this.distributedLicenses.filter(license => license.status === 'active');
    }

    // 验证授权码是否已分发
    isLicenseDistributed(licenseCode) {
        return this.distributedLicenses.some(license => 
            license.code === licenseCode && license.status === 'active'
        );
    }

    // 停用授权码
    deactivateLicense(licenseCode) {
        const license = this.distributedLicenses.find(l => l.code === licenseCode);
        if (license) {
            license.status = 'inactive';
            license.deactivatedAt = new Date().toISOString();
            this.saveDistributedLicenses();
            return true;
        }
        return false;
    }

    // 获取授权码统计
    getDistributionStats() {
        const total = this.distributedLicenses.length;
        const active = this.distributedLicenses.filter(l => l.status === 'active').length;
        const inactive = total - active;
        
        const typeStats = {};
        this.distributedLicenses.forEach(license => {
            if (license.status === 'active') {
                typeStats[license.type] = (typeStats[license.type] || 0) + 1;
            }
        });

        return {
            total,
            active,
            inactive,
            byType: typeStats
        };
    }

    // 导出分发记录
    exportDistributionData() {
        return {
            exportedAt: new Date().toISOString(),
            totalLicenses: this.distributedLicenses.length,
            licenses: this.distributedLicenses
        };
    }

    // 导入分发记录
    importDistributionData(data) {
        if (data && data.licenses && Array.isArray(data.licenses)) {
            this.distributedLicenses = data.licenses;
            this.saveDistributedLicenses();
            return true;
        }
        return false;
    }
}

// 创建全局实例
const licenseDistributor = new LicenseDistributor();

// 导出（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LicenseDistributor, licenseDistributor };
} 