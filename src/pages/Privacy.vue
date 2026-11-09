<script setup lang="ts">
import ProsePage from '@/components/layout/ProsePage.vue'
import { ADSENSE_ENABLED, CLAIMS_NO_ADS } from '@/core/site-config'
</script>

<template>
  <ProsePage title="隐私说明" subtitle="没有账号、没有埋点、没有第三方统计。">
    <h2>默认不联网</h2>
    <p>
      除标记为「需联网」的工具外，所有输入都在你的浏览器内存里处理，关闭页面即消失。
      <template v-if="CLAIMS_NO_ADS">本站不设 Cookie、不接入任何统计或广告脚本。</template>
      <template v-else>本站不设业务 Cookie、不接入第三方统计脚本。</template>
    </p>

    <template v-if="ADSENSE_ENABLED">
      <h2>关于广告</h2>
      <p>
        本站通过 Google AdSense 展示广告以覆盖域名与带宽成本。广告由 Google 提供，可能使用 Cookie
        或设备标识来展示与衡量广告效果；这部分数据由 Google 控制，本站无法读取，也不会把它与你的工具输入关联。
      </p>
      <p>
        广告只出现在首页底部、分类页底部和工具页底部，不会遮挡或插入工具输入区域。
        你可以通过浏览器广告拦截扩展屏蔽，或使用
        <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google 广告设置</a>
        关闭个性化广告，这不影响任何工具的正常使用。
      </p>
    </template>

    <h2>需要联网的工具会去哪</h2>
    <p>只有在你点击查询按钮时，浏览器才会直接请求下列公开接口，本站服务器（其实没有服务器）不参与转发：</p>
    <table>
      <thead>
        <tr><th>工具</th><th>接口</th></tr>
      </thead>
      <tbody>
        <tr><td>IP 查询</td><td><code>ipwho.is</code> · <code>ipapi.co</code> · <code>api.ipify.org</code></td></tr>
        <tr><td>DNS 查询</td><td><code>cloudflare-dns.com</code> · <code>dns.google</code> · <code>223.5.5.5</code>（阿里 DoH）</td></tr>
        <tr><td>站点可达性</td><td>你用 <code>no-cors</code> 模式请求的目标站点本身</td></tr>
      </tbody>
    </table>
    <p>这些请求只包含你输入的域名或 IP，不携带本地存储、不使用 Cookie、不发送 Referer。对应服务方会看到你的 IP，这是任何直连请求都无法避免的。</p>

    <h2>本地存储</h2>
    <ul>
      <li><code>zt-theme</code>：主题偏好</li>
      <li><code>zt-allow-network</code>：联网总开关</li>
      <li><code>zt-recent-tools</code>：最近使用的工具 id 列表（最多 8 条）</li>
    </ul>
    <p>以上数据只存在本机，随时可在「设置 → 数据」里清除。</p>

    <h2>离线缓存</h2>
    <p>Service Worker 会缓存应用外壳与字体文件，缓存同样只在本机。设置页提供「重置本地缓存」，用于版本异常或白屏时自救。</p>
  </ProsePage>
</template>
