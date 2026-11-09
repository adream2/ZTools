<script setup lang="ts">
import ProsePage from '@/components/layout/ProsePage.vue'
import { CONTACT_EMAIL, SITE_OWNER, SITE_SINCE, ADSENSE_ENABLED } from '@/core/site-config'
import { APP_NAME } from '@/core/config'

const updated = '2026-11-09'
</script>

<template>
  <ProsePage title="服务条款" :subtitle="`最后更新：${updated}`">
    <h2>1. 服务说明</h2>
    <p>
      {{ APP_NAME }}（下称「本站」）向访问者提供免费的在线工具集合。工具在浏览器内运行，
      本站不设账号系统，不存储你的输入内容。
    </p>
    <p>
      本站按「现状」（as-is）提供服务，不承诺服务不中断、无错误。因网络、浏览器兼容性、
      第三方接口变化导致的不可用，本站会尽力修复，但不承担由此产生的损失。
    </p>

    <h2>2. 使用限制</h2>
    <p>使用本站时，你同意不进行以下行为：</p>
    <ul>
      <li>利用本站工具处理违法内容，或从事侵害他人权益的活动</li>
      <li>通过自动化脚本高频访问，影响其他用户正常使用</li>
      <li>尝试绕过、攻击本站或其所依赖的第三方服务</li>
      <li>将本站工具用于需要专业资质的场景（如医疗诊断、法律意见、金融决策）</li>
    </ul>

    <h2>3. 结果准确性</h2>
    <p>
      本站工具的计算与转换结果按通行标准实现，但<strong>不构成任何形式的担保</strong>。
      涉及金额、税务、健康、加密安全等场景时，请以权威机构或专业软件的结论为准。
    </p>
    <p>
      典型例子：房贷与个税计算未考虑地方政策差异；BMI 与基础代谢是统计估算；
      哈希与加密工具的正确性依赖浏览器实现，本站不对其密码学强度作背书。
    </p>

    <h2>4. 知识产权</h2>
    <p>
      本站的界面设计、代码与使用指南文字由 {{ SITE_OWNER }} 创作，版权归其所有。
      文章可在注明出处的前提下非商业转载；商业用途请先通过
      <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a> 联系。
    </p>
    <p>
      工具中使用的开源库遵循各自的许可证（MIT、ISC、Apache-2.0 等），
      本站未修改其核心逻辑。
    </p>

    <h2>5. 第三方服务</h2>
    <p>
      部分工具（IP 查询、DNS 查询、连通性测试等）会直接请求公开接口，
      你的请求会发送给对应的服务方，受其服务条款约束。本站不代理、不记录这些请求。
    </p>
    <p v-if="ADSENSE_ENABLED">
      本站展示 Google AdSense 广告，广告内容与投放行为由 Google 控制，
      适用 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google 广告政策</a>。
    </p>

    <h2>6. 条款变更</h2>
    <p>
      本站可能随功能调整更新本条款，更新后会在本页标注日期。继续使用即视为接受更新后的条款。
    </p>

    <h2>7. 适用法律</h2>
    <p>
      本条款适用中华人民共和国法律。因本站产生的争议，双方应友好协商解决；
      协商不成的，提交 {{ SITE_OWNER }} 所在地有管辖权的人民法院。
    </p>

    <h2>8. 联系方式</h2>
    <p>
      条款相关的问题请发邮件至
      <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>。
    </p>
    <p class="u-xs u-dim">© {{ SITE_SINCE }}–{{ new Date().getFullYear() }} {{ SITE_OWNER }}</p>
  </ProsePage>
</template>
