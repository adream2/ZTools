/**
 * 站点级配置：站长验证、广告位。
 *
 * 所有敏感/个性化内容都从环境变量读，代码里不出现硬编码 ID。
 * 没配置时相关功能整体关闭，不会渲染空占位、也不会发请求。
 */

const env = import.meta.env

/** Google AdSense 发布商 ID，形如 ca-pub-1234567890123456 */
export const ADSENSE_CLIENT = (env.VITE_ADSENSE_CLIENT as string | undefined)?.trim() ?? ''

/** 广告总开关：只要有 client 才认为启用了广告 */
export const ADSENSE_ENABLED = ADSENSE_CLIENT.length > 0

export type AdPlacement = 'homeBottom' | 'toolBottom' | 'categoryBottom'

/** 每个广告位的 slot id，在 AdSense 后台创建广告单元后填入 */
export const AD_SLOTS: Record<AdPlacement, string> = {
  homeBottom: (env.VITE_ADSENSE_SLOT_HOME as string | undefined)?.trim() ?? '',
  toolBottom: (env.VITE_ADSENSE_SLOT_TOOL as string | undefined)?.trim() ?? '',
  categoryBottom: (env.VITE_ADSENSE_SLOT_CATEGORY as string | undefined)?.trim() ?? '',
}

export function slotOf(placement: AdPlacement): string {
  return ADSENSE_ENABLED ? (AD_SLOTS[placement] ?? '') : ''
}

/** 联系邮箱，AdSense 审核会检查「能否联系到站方」 */
export const CONTACT_EMAIL = (env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || 'admin@lxzt.fun'

/** 站点运营者署名，用在关于页与条款页 */
export const SITE_OWNER = ((env.VITE_SITE_OWNER as string | undefined)?.trim() || 'ZT 折腾簿')

/** 站点上线年份，用于版权声明 */
export const SITE_SINCE = '2024'

/** 站点是否对外声称「无广告」，文案里用它决定措辞 */
export const CLAIMS_NO_ADS = !ADSENSE_ENABLED

/** 站长的各类验证码，只在构建时注入 index.html 的 meta */
export interface VerifyConfig {
  google?: string
  bing?: string
  baidu?: string
  sogou?: string
  so360?: string
  yandex?: string
}

export const VERIFY: VerifyConfig = {
  google: (env.VITE_VERIFY_GOOGLE as string | undefined)?.trim(),
  bing: (env.VITE_VERIFY_BING as string | undefined)?.trim(),
  baidu: (env.VITE_VERIFY_BAIDU as string | undefined)?.trim(),
  sogou: (env.VITE_VERIFY_SOGOU as string | undefined)?.trim(),
  so360: (env.VITE_VERIFY_360 as string | undefined)?.trim(),
  yandex: (env.VITE_VERIFY_YANDEX as string | undefined)?.trim(),
}
