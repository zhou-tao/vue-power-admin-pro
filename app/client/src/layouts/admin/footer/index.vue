<script setup lang="ts" name="LayoutFooter">
  import { storeToRefs } from 'pinia'
  import { useSettingStore } from '@/store/modules/setting'

  const { hasFooter } = storeToRefs(useSettingStore())
</script>

<template>
  <el-footer v-show="hasFooter" h="footer">
    <div h="full" flex items="center" justify="center" text="placeholder">
      MIT Licensed <i-app-heart text="rose-600!" /> Copyright © 2022-present vue-power-admin
    </div>
  </el-footer>
</template>

<style lang="scss" scoped></style>
