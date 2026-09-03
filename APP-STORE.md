# 上架 Apple App Store 操作手册

代码已经准备好（Capacitor 原生壳配置、隐私政策页面）。下面是你要做的事，按顺序来。

## 第 0 步：花钱的部分（今天就可以开始）

1. 注册 **Apple Developer Program**：<https://developer.apple.com/programs/enroll/>
   - 用你的 Apple ID，选 Individual（个人），**$99 美元/年**
   - 审核最多48小时，等邮件确认
2. Mac App Store 安装 **Xcode**（免费，约 15GB，下载要一会儿）

## 第 1 步：在你的 Mac 上生成 iOS 工程（等我的代码 push 之后）

```bash
cd ~/Desktop/GitHub/truth-card-game
npm install          # 安装 Capacitor
npm run ios:init     # 构建网页 + 生成 ios/ 工程（首次会装 CocoaPods 依赖）
npm run ios:open     # 在 Xcode 中打开
```

如果 `ios:init` 报 CocoaPods 相关错误：`brew install cocoapods` 后重跑。

## 第 2 步：Xcode 里的一次性设置

1. 左侧点 **App** 项目 → **Signing & Capabilities**：
   - Team 选你的开发者账号（登录 Apple ID 即可出现）
   - Bundle Identifier 保持 `com.enrongpan.truthcards`
2. 顶部设备选你自己的 iPhone（数据线连接）→ 点 ▶ 运行，先真机玩一遍确认没问题。

## 第 3 步：App Store Connect 建应用

<https://appstoreconnect.apple.com> → My Apps → ➕ New App：

- 名称建议：**Truth Cards 真心话大冒险**（如被占用，试 "Truth Cards · 团契真心话"）
- Bundle ID 选 `com.enrongpan.truthcards`；语言选 English + Chinese (Simplified)
- **Privacy Policy URL**：`https://cards.enrongpan.com/privacy.html`（已做好）
- App Privacy 问卷：选 "Data Not Collected"（昵称只在房间内转发、不与身份关联；如需更稳妥选 "Data Not Linked to You" → User Content）
- 年龄分级问卷：如实填，预计 12+（偶尔的成人话题）
- 截图：iPhone 至少 3 张（6.7"，1290×2796）。手机打开网站截图即可，我也可以帮你做带文案的精修版——需要就说。

## 第 4 步：提交审核

1. Xcode → Product → **Archive** → Distribute App → App Store Connect → Upload
2. 回到 App Store Connect 选刚上传的构建版本 → 填写"审核备注"（建议写）：
   > This is a bilingual (EN/中文) party card game for Christian fellowship groups. It works fully offline, supports live multiplayer rooms over the network, native install, and includes 350+ hand-curated questions. It is not a repackaged website template.
3. Submit for Review。通常 1–3 天出结果。

## 注意事项

- **4.2 风险**：Apple 有时拒绝"网页套壳"应用。我们的加分项：完全离线可玩、实时联机房间、原生分享。如果被拒，把拒信发我，我加原生功能（震动反馈、原生分享面板）再提交，通常第二次就过。
- **中国大陆商店**：2023 年起中国区上架需要 ICP 备案（需要国内主体），个人海外开发者基本办不了。**建议发布到除中国大陆外的所有地区**——国内的朋友继续用网站 cards.enrongpan.com，海外朋友用 App Store。发布地区在 App Store Connect → Pricing and Availability 里勾选。
- **以后更新**：改完代码 `npm run ios:sync` → Xcode Archive → 上传 → 提交。网站会继续独立自动部署，互不影响。

## 费用与时间

| 项目 | 费用/耗时 |
|---|---|
| Apple 开发者账号 | $99/年，审核 ≤48h |
| Xcode 设置 + 首次真机运行 | 约 1–2 小时 |
| App Store Connect 填资料 | 约 1 小时 |
| Apple 审核 | 通常 1–3 天 |
