<script setup lang="ts">
defineProps<{ label?: string; hint?: string; required?: boolean; for?: string }>()
</script>

<template>
  <div class="field">
    <div v-if="label" class="field__head">
      <label class="field__label" :for="$props.for">
        {{ label }}
        <span v-if="required" class="field__req">*</span>
      </label>
      <span v-if="hint" class="field__hint">{{ hint }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  min-width: 0;
}
.field__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  /* 与输出框的标题栏同高，双栏时内容区顶边才对得齐 */
  min-height: 27px;
}
.field__label {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--c-text-2);
}
.field__req {
  color: var(--c-danger);
}
.field__hint {
  font-size: var(--fs-xs);
  color: var(--c-text-3);
}
</style>
