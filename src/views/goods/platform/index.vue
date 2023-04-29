<template>
  <div class="customBase">
    <div></div>
    <!-- 卡片1 三级分类搜索-->
    <CategoriesSelect :isDisabled="isAddAttr" @showAddBtn="changeAddBtn"></CategoriesSelect>
    <!-- 卡片2 展示商品属性,用到了动态组件和 keepalive 缓存机制提高性能-->
    <a-card class="cardBottom">
      <keep-alive>
        <component
          :is="isAddAttr ? AddAttribute : GoodsAttribute"
          :showAddBtn="showAddBtn"
          @change="changeComp"
        ></component>
      </keep-alive>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import '/@/design/customBase.less'
  import GoodsAttribute from './components/GoodsAttribute.vue'
  import AddAttribute from './components/AddAttribute.vue'
  // 注意：由于组件实例比较庞大，不建议将其作响应式，也没必要作响应式，这样性能开销较大，
  // 所以应用markRaw或ShllowRef或ShallowReactive将其排除响应式，不对它进行代理。
  const isAddAttr = ref<boolean>(false)
  const showAddBtn = ref<boolean>(false)
  function changeAddBtn(e) {
    showAddBtn.value = e
  }

  function changeComp(bool) {
    isAddAttr.value = bool
  }
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
