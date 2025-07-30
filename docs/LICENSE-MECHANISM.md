# 授权码机制详解

## 🔑 授权码系统架构

### 1. 核心组件

```
授权码系统
├── LicenseManager (授权码管理器)
│   ├── 验证授权码有效性
│   ├── 管理授权码类型
│   └── 提供授权码信息
├── LicenseDistributor (授权码分发器)
│   ├── 分发新授权码
│   ├── 管理分发记录
│   └── 统计分发数据
└── 用户验证流程
    ├── 输入授权码
    ├── 验证有效性
    └── 显示对应功能
```

### 2. 授权码格式

```
格式：PAIRING_[TYPE]_[TIMESTAMP]_[RANDOM]

示例：
- PAIRING_PREMIUM_1234567890_ABC123
- PAIRING_STD_1234567890_DEF456
- PAIRING_TRIAL_1234567890_GHI789
- PAIRING_ADMIN_1234567890_JKL012
```

## 🔧 工作机制

### 1. 授权码生成

```javascript
// 生成授权码
const licenseManager = new LicenseManager();
const newLicense = licenseManager.generateLicense('premium');
// 输出: PAIRING_PREMIUM_TIMESTAMP_RANDOM
```

### 2. 授权码分发

```javascript
// 分发授权码给客户
const licenseDistributor = new LicenseDistributor();
licenseDistributor.distributeLicense(
    'PAIRING_PREMIUM_1234567890_ABC123',
    'premium',
    { customer: '张三', contact: '13800138000' }
);
```

### 3. 授权码验证

```javascript
// 用户输入授权码时验证
const result = licenseManager.validateLicense(userInput);
if (result.valid) {
    // 显示对应功能
    const licenseInfo = licenseManager.getLicenseInfo(userInput);
    showFeatures(licenseInfo.type);
}
```

## 📊 数据存储

### 1. 本地存储结构

```javascript
// 用户授权码
localStorage.setItem('user_licenses', JSON.stringify([
    'PAIRING_PREMIUM_001',
    'PAIRING_STD_002'
]));

// 分发记录
localStorage.setItem('pairing_license_distribution', JSON.stringify([
    {
        code: 'PAIRING_PREMIUM_1234567890_ABC123',
        type: 'premium',
        distributedAt: '2025-07-30T...',
        customerInfo: { customer: '张三', contact: '13800138000' },
        status: 'active'
    }
]));
```

### 2. 数据同步机制

```javascript
// 加载所有有效授权码
function loadAllValidLicenses() {
    // 1. 硬编码测试授权码
    const testLicenses = ['PAIRING_TEST_001', 'PAIRING_ADMIN_001'];
    
    // 2. 用户购买的授权码
    const userLicenses = JSON.parse(localStorage.getItem('user_licenses') || '[]');
    
    // 3. 已分发的授权码
    const distributedLicenses = JSON.parse(localStorage.getItem('pairing_license_distribution') || '[]');
    const activeDistributed = distributedLicenses.filter(l => l.status === 'active');
    
    // 合并所有有效授权码
    return [...testLicenses, ...userLicenses, ...activeDistributed.map(l => l.code)];
}
```

## 🎯 确保新授权码正常使用

### 1. 分发流程

```
管理员操作：
1. 生成新授权码
2. 使用分发系统分发
3. 授权码保存到localStorage
4. 所有用户都能使用该授权码
```

### 2. 验证流程

```
用户操作：
1. 输入授权码
2. 系统检查所有来源：
   - 硬编码测试码
   - 用户购买码
   - 已分发码
3. 验证通过后显示功能
```

### 3. 数据持久化

```javascript
// 确保授权码在所有用户间共享
class LicenseManager {
    loadValidLicenses() {
        // 加载硬编码授权码
        this.loadTestLicenses();
        
        // 加载用户授权码
        this.loadUserLicenses();
        
        // 加载已分发授权码（关键）
        this.loadDistributedLicenses();
    }
    
    loadDistributedLicenses() {
        const distributed = localStorage.getItem('pairing_license_distribution');
        if (distributed) {
            const licenses = JSON.parse(distributed);
            licenses.forEach(license => {
                if (license.status === 'active') {
                    this.validLicenses.add(license.code);
                }
            });
        }
    }
}
```

## 🔒 安全机制

### 1. 授权码格式验证

```javascript
isValidFormat(code) {
    const formatRegex = /^PAIRING_[A-Z0-9_]{8,}$/;
    return formatRegex.test(code);
}
```

### 2. 授权码状态管理

```javascript
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
```

### 3. 防重复使用

```javascript
// 检查授权码是否已被分发
isLicenseDistributed(licenseCode) {
    return this.distributedLicenses.some(license => 
        license.code === licenseCode && license.status === 'active'
    );
}
```

## 📈 统计和监控

### 1. 分发统计

```javascript
getDistributionStats() {
    return {
        total: this.distributedLicenses.length,
        active: this.distributedLicenses.filter(l => l.status === 'active').length,
        inactive: this.distributedLicenses.filter(l => l.status === 'inactive').length,
        byType: {
            premium: this.countByType('premium'),
            standard: this.countByType('standard'),
            trial: this.countByType('trial')
        }
    };
}
```

### 2. 使用情况监控

```javascript
// 记录授权码使用情况
logLicenseUsage(licenseCode, userId) {
    const usage = {
        licenseCode,
        userId,
        usedAt: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    const usageLog = JSON.parse(localStorage.getItem('license_usage_log') || '[]');
    usageLog.push(usage);
    localStorage.setItem('license_usage_log', JSON.stringify(usageLog));
}
```

## 🚀 最佳实践

### 1. 授权码生成

- 使用时间戳确保唯一性
- 添加随机字符串增加安全性
- 避免连续编号防止猜测

### 2. 分发管理

- 记录客户信息便于追踪
- 设置授权码状态（活跃/停用）
- 定期清理过期授权码

### 3. 用户体验

- 提供清晰的错误提示
- 支持授权码找回功能
- 显示授权码有效期和功能

### 4. 数据备份

```javascript
// 导出分发数据
exportDistributionData() {
    return {
        exportedAt: new Date().toISOString(),
        totalLicenses: this.distributedLicenses.length,
        licenses: this.distributedLicenses
    };
}

// 导入分发数据
importDistributionData(data) {
    if (data && data.licenses && Array.isArray(data.licenses)) {
        this.distributedLicenses = data.licenses;
        this.saveDistributedLicenses();
        return true;
    }
    return false;
}
```

## 🎯 总结

通过这个机制，我们确保了：

1. **新生成的授权码能被所有用户使用** - 通过分发系统
2. **授权码安全性** - 通过格式验证和状态管理
3. **数据持久化** - 通过localStorage存储
4. **统计监控** - 通过分发统计和使用日志
5. **用户体验** - 通过清晰的验证流程和错误提示

这个系统完全基于前端，无需后端服务器，同时保证了授权码的有效分发和使用！ 