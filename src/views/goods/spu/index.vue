<template>
  <div class="customBase">
    <CategoriesSelect :isDisabled="isAddAttr" @selected="change"></CategoriesSelect>
    <a-card class="cardBottom">
      <!-- <keep-alive>
        <component :is="componentId"></component>
      </keep-alive> -->
      <SpuTable></SpuTable>
    </a-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import '/@/design/customBase.less'
  import SpuTable from './components/SpuTable.vue'
</script>

<style lang="less" scoped>
  .cardBottom {
    margin: 20px 10px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    :deep(.ant-table-thead) > tr > th {
      font-weight: bold;
    }
  }
</style>
