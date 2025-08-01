# 配对题生成器

一个简单易用的配对题练习工具，支持创建、练习和复习配对题卡组。

## 功能特性

### 1. 创建配对题卡组
- 支持自定义题目名称
- **新增：支持添加标签，便于分类和搜索**
- 可以添加多个分组（类别）
- 每个分组可以包含多个条目
- 条目支持逗号或换行分隔

### 2. 练习模式
- 拖拽式交互，直观易用
- 实时反馈，即时检查答案
- 支持多列布局显示，适应不同数量的条目
- 响应式设计，支持移动设备

### 3. 复习模式
- **全部打乱复习**：重新打乱所有待选项的顺序，增加练习难度
- **只复习错题**：仅显示之前答错的题目，针对性复习
- **两列布局**：复习模式下，拖拽到分类区域内的条目自动以两列形式展示

### 4. 历史记录管理
- 自动保存所有创建的卡组
- **新增：支持历史卡组的增删查改操作**
- **新增：支持按标签和标题搜索卡组**
- **新增：支持编辑现有卡组的内容和标签**
- **新增：支持删除不需要的卡组**
- 数据本地存储，无需网络连接
- 自动备份功能，防止数据丢失

## 使用方法

### 创建新卡组
1. 在"题目名称"输入框中输入卡组名称
2. **在"标签"输入框中输入标签，用逗号分隔（可选）**
3. 在"分组名称"中输入类别名称（如：促进胃酸分泌的因素）
4. 在"条目列表"中输入该类别下的所有条目，用逗号或换行分隔
5. 点击"添加新分组"可以添加更多类别
6. 点击"生成配对题"创建卡组

### 管理历史卡组
1. **搜索卡组**：在搜索框中输入标签或标题关键词，点击"搜索"按钮
2. **编辑卡组**：点击历史卡组上的"编辑"按钮，修改内容后点击"更新卡组"
3. **删除卡组**：点击历史卡组上的"删除"按钮，确认后删除
4. **新建卡组**：点击"新建卡组"按钮清空表单，开始创建新卡组

### 练习配对题
1. 从上方待选区域拖拽条目到下方对应的分类区域
2. 点击"检查答案"查看正确性
3. **正确答案显示绿色，错误答案显示红色**
4. **系统根据每个条目原本所属的类别判断正确性**
5. **只检查已拖入分类区域的答案，未作答的条目不参与评分**
6. **显示每个分类的已作答数量和正确数量**
7. 系统会记录每个条目的答题情况

### 复习历史卡组
1. 在"历史卡组"区域点击任意卡组
2. 选择复习模式：
   - **全部打乱复习**：所有待选项重新打乱顺序
   - **只复习错题**：仅显示之前答错的题目
3. 在复习模式下，拖拽到分类区域内的条目会自动以两列形式展示

## 技术特性

- **纯前端实现**：无需服务器，直接在浏览器中运行
- **本地存储**：使用localStorage保存数据
- **响应式设计**：适配桌面和移动设备
- **拖拽交互**：使用HTML5 Drag and Drop API
- **自动布局**：根据条目数量自动调整显示列数
- **标签系统**：支持多标签分类和搜索

## 文件结构

```
配对题生成器/
├── 未命名.html          # 主程序文件
└── README.md            # 项目说明文档
```

## 浏览器兼容性

支持所有现代浏览器，包括：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 数据备份

系统会自动进行数据备份：
- 启动时自动备份一次
- 每24小时自动备份一次
- 备份数据以日期命名存储在localStorage中

## 更新日志

### v1.2.9
- **用户授权系统**：进入页面需要输入授权码验证，Mock版本支持任意非空输入
- **用户数据隔离**：每个用户的数据独立存储，切换账号时数据完全隔离
- **退出登录功能**：支持退出登录，清除当前用户数据并返回授权界面
- **用户信息显示**：顶部显示当前用户ID和退出登录按钮

### v1.2.8
- **输入框对齐优化**：题目名称和标签输入框左右对齐，统一宽度为300px
- **按钮颜色主次分明**：主要操作使用蓝色，次要操作使用橙色，删除/清空使用灰色
- **视觉层次清晰**：通过颜色区分按钮的重要程度，提升用户操作效率
- **界面布局改进**：标签宽度固定80px右对齐，输入框统一宽度，整体更加规整

### v1.2.7
- **统一配色方案**：采用协调的蓝色系配色，遵循"少即是多"的设计原则
- **色彩层次优化**：主色调#3498db，辅助色#2c3e50，成功色#27ae60，错误色#e74c3c
- **视觉一致性**：所有按钮、标签、边框使用统一的色彩体系
- **用户体验提升**：减少视觉干扰，提升整体界面的专业性和现代感

### v1.2.6
- **历史标签删除**：支持删除历史标签池中的标签，保持标签池整洁
- **智能点击处理**：点击历史标签可选择，点击删除按钮可删除，避免冲突
- **删除反馈**：删除历史标签后显示成功提示，自动更新显示
- **视觉区分**：历史标签删除按钮使用不同样式，与当前标签删除按钮区分

### v1.2.5
- **完整表单验证**：确保题目名称必填、分组至少2个、每个分组条目至少1个
- **智能错误提示**：验证失败时显示具体错误信息，自动聚焦到问题输入框
- **Toast错误反馈**：使用红色toast消息提示验证错误，提升用户体验
- **多场景验证**：新建、编辑、更新卡组时都进行完整验证

### v1.2.4
- **智能表单清理**：创建完新卡组后自动清除所有输入框，提升用户体验
- **实时标签系统**：支持实时添加、删除标签，使用现代化标签UI设计
- **标签排序机制**：按最新添加顺序排列，最多显示2行标签
- **标签交互优化**：支持回车、逗号、失焦等多种添加方式，支持点击删除

### v1.2.3
- **智能数据清理**：删除卡组时自动检测并清除正在复习的相关数据
- **区域UI分隔**：为三个主要功能区域（创建、复习、历史）添加清晰的视觉分隔
- **改进布局结构**：使用卡片式设计，提升整体视觉层次和用户体验
- **动态区域显示**：复习区域只在有内容时显示，避免空白区域

### v1.2.2
- **新增Toast消息系统**：替换所有alert弹窗，使用右上角滑入式toast消息
- **新增确认对话框**：替换confirm弹窗，使用自定义确认对话框
- **统一界面风格**：所有提示消息都与现有UI风格保持一致
- **改进用户体验**：更现代、更友好的消息提示方式

### v1.2.1
- **优化检查答案逻辑**：根据每个条目原本所属的类别判断正确性
- **改进评分机制**：只检查已拖入分类区域的答案，未作答的条目不参与评分
- **增强结果显示**：显示每个分类的已作答数量和正确数量
- **提升用户体验**：更清晰的正确/错误反馈机制
- **修复颜色显示问题**：使用CSS类确保正确/错误颜色正确显示

### v1.2.0
- **新增标签功能**：支持为卡组添加标签，便于分类管理
- **新增搜索功能**：支持按标签和标题搜索历史卡组
- **新增编辑功能**：支持编辑现有卡组的内容和标签
- **新增删除功能**：支持删除不需要的卡组
- **新增新建卡组按钮**：快速清空表单创建新卡组
- **优化历史卡组显示**：使用卡片式布局，显示标签和创建时间
- **改进用户体验**：添加悬停效果和更好的视觉反馈

### v1.1.0
- 新增复习模式下的两列布局显示（拖拽区域内的条目分两列）
- 新增"全部打乱复习"功能，随机打乱待选项顺序
- 优化用户体验和界面布局
- 修复移动端下拖拽框内条目超出边框的UI问题
- 增强响应式设计，适配不同屏幕尺寸

### v1.0.0
- 基础配对题创建和练习功能
- 历史记录和复习功能
- 拖拽交互和答案检查 