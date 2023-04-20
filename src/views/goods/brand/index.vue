<template>
  <div class="customBase table-div">
    <a-button type="primary" class="addBrand"
      ><Icon icon="ant-design:plus-outlined"></Icon>添加</a-button
    >
    <a-table
      class="brandTable"
      :rowClassName="(row, index) => (index == 0 ? 'headerBold' : null)"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      bordered
    ></a-table>

    <a-pagination
      class="pagination"
      v-model:current="current"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      :page-size="pageSize"
      @showSizeChange="onShowSizeChange"
    >
      <template #buildOptionText="props">
        <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
        <span v-else>全部</span>
      </template>
    </a-pagination>
  </div>
</template>

<script lang="ts">
  import '/@/design/customBase.less'
  import { ref, reactive, onMounted } from 'vue'
  import { Icon } from '/@/components/Icon'
  import { useBrandStore } from '/@/store/modules/brand'
  // import { BrandInfo } from '/#/brand'
  export default {
    name: 'BrandIndex',
    components: { Icon },
    setup() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 70,
        },
        {
          title: '品牌名称',
          dataIndex: 'tmName',
          key: 'tmName',
        },
        {
          title: '品牌LOGO',
          dataIndex: 'logoUrl',
          key: 'logoUrl',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
        },
      ]
      const brandStore = useBrandStore()
      let tableData = ref([])
      let pagination = reactive({
        current: 1,
        total: 100,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40'],
      })

      onMounted(() => {
        // 发送请求
        getBrandList()
      })

      async function getBrandList() {
        await brandStore.getBrandList({ page: pagination.current, pageSize: pagination.pageSize })
        tableData.value = brandStore.brandList
      }

      async function onShowSizeChange() {
        // 再次发请求
      }
      return {
        tableData,
        columns,
        ...pagination,
        onShowSizeChange,
      }
    },
  }
</script>

<style lang="less" scoped>
  .addBrand {
    margin: 10px 0;
  }
  .brandTable {
    margin: 10px 10px 30px 0;
    // 因为scoped这里的样式只能修改本组件，修改不了子组件，要用深度选择器，实现样式穿透
    :deep(.ant-table-thead) > tr > th {
      font-weight: bold;
    }
  }
  .pagination {
    text-align: center;
  }
</style>
