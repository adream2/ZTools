<script setup lang="ts">
import ProsePage from '@/components/layout/ProsePage.vue'
import { CONTACT_EMAIL, SITE_OWNER } from '@/core/site-config'
import { VISIBLE_TOOLS } from '@/core/registry'
import { APP_NAME } from '@/core/config'
</script>

<template>
  <ProsePage title="联系与反馈" subtitle="工具出错、内容有误、合作洽谈，都可以从这里找过来。">
    <h2>邮件</h2>
    <p>
      最直接的方式是发邮件到
      <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>。
      通常 2–3 个工作日内回复，节假日会慢一些。
    </p>

    <h2>反馈工具问题</h2>
    <p>为了能快速定位，麻烦在邮件里带上这几项：</p>
    <ul>
      <li>工具名称与链接（形如 <code>#/tools/json-formatter</code>）</li>
      <li>你输入的示例数据（脱敏后）</li>
      <li>期望结果与实际结果</li>
      <li>浏览器与版本，例如「Chrome 131 / macOS 15」</li>
    </ul>
    <p>
      如果是页面白屏或样式错乱，先试试设置页的「重置本地缓存」——多数情况下是 Service Worker
      缓存了旧版本导致的。
    </p>

    <h2>内容纠错</h2>
    <p>
      使用指南里的技术细节如果有误，非常欢迎指出。请说明是哪一篇、哪一段，以及你依据的资料
      （MDN、RFC 编号、某篇论文都可以）。
    </p>

    <h2>合作与其他</h2>
    <ul>
      <li>广告投放：站点目前支持 Google AdSense，其他形式的投放请先邮件沟通</li>
      <li>工具定制：如果有具体需求，可以说明场景与期望效果</li>
      <li>内容转载：站内文章可注明出处后转载，商业用途请先联系</li>
    </ul>

    <h2>关于本页</h2>
    <p>
      {{ APP_NAME }}由 {{ SITE_OWNER }} 独立维护，目前收录 {{ VISIBLE_TOOLS.length }} 个工具。
      站点没有注册系统，因此也没有账号相关的客服流程。
    </p>
  </ProsePage>
</template>
