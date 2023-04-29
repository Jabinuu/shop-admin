<template>
  <div class="customBase">
    <CategoriesSelect :isDisabled="isDisabled"></CategoriesSelect>
    <a-card class="cardBottom">
      <keep-alive>
        <component :is="curComponent" @change="changeComp"></component>
      </keep-alive>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { markRaw, reactive, ref, shallowRef } from 'vue'
  import '/@/design/customBase.less'
  import SpuTable from './components/SpuTable.vue'
  import SpuAdd from './components/SpuAdd.vue'
  import SkuAdd from './components/SkuAdd.vue'
  const componentList = { SpuTable, SpuAdd, SkuAdd }
  const curComponent = ref(markRaw(SpuTable))
  const isDisabled = ref<boolean>(false)

  function changeComp(comp) {
    isDisabled.value = comp == 'SpuTable' ? false : true
    curComponent.value = markRaw(componentList[comp])
  }
</script>

<style lang="less" scoped>
  .cardBottom {
    margin: 20px 10px;
    box-shadow: 0 2px 12px 0 rgba(175, 138, 129, 0.1);
    :deep(.ant-table-thead) > tr > th {
      font-weight: bold;
    }
  }
</style>
