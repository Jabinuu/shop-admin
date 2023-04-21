<template>
  <div>
    <div class="customBase table-div">
      <a-button type="primary" class="addBrand" @click="onClickAddBrand"
        ><Icon icon="ant-design:plus-outlined"></Icon>添加</a-button
      >
      <a-table
        class="brandTable"
        :rowClassName="(row, index) => (index == 0 ? 'headerBold' : null)"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'logoUrl'">
            <img src="../../../assets/images/header.jpg" style="width: 50px; height: 50px" />
          </template>
          <template v-if="column.key === 'operation'">
            <a-button id="editBtn"><Icon icon="system-uicons:write"></Icon>修改</a-button>
            <a-button danger id="deleteBtn"
              ><Icon icon="material-symbols:delete-outline"></Icon>删除</a-button
            >
          </template>
        </template>
      </a-table>

      <a-pagination
        class="pagination"
        v-model:current="current"
        :page-size-options="pageSizeOptions"
        :total="total"
        show-size-changer
        :page-size="pageSize"
        @showSizeChange="onShowSizeChange"
        @change="onPageChange"
      >
        <template #buildOptionText="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-else>全部</span>
        </template>
      </a-pagination>
    </div>
    <BrandModal @register="register"></BrandModal>
  </div>
</template>

<script lang="ts">
  import '/@/design/customBase.less'
  import { ref, reactive, onMounted, toRefs, toRef } from 'vue'
  import { Icon } from '/@/components/Icon'
  import BrandModal from '/@/components/Modal/src/BrandModal.vue'
  import { useBrandStore } from '/@/store/modules/brand'
  import { useModal } from '/@/components/Modal'
  export default {
    name: 'BrandIndex',
    components: { Icon, BrandModal },
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
          width: 300,
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
      const [register, { openModal, setModalProps }] = useModal() // 数组也可以用[]解构
      const brandStore = useBrandStore()
      const tableData = ref([])
      let pagination = reactive({
        current: 1,
        total: 5,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '15', '20'],
      })

      onMounted(() => {
        // 发送请求
        getBrandInfo()
      })

      async function getBrandInfo() {
        await brandStore.getBrandInfo({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
        tableData.value = brandStore.brandList
        pagination.total = brandStore.brandTotal
      }

      // 每页展示条数变化，再次发请求
      async function onShowSizeChange(_, pageSize: Number) {
        pagination.pageSize = pageSize
        getBrandInfo()
      }

      // 再次发请求
      async function onPageChange(page: number, pageSize: number) {
        getBrandInfo()
      }

      function onClickAddBrand() {
        openModal(true)
      }

      return {
        tableData,
        columns,
        ...toRefs(pagination),
        register,
        openModal,
        onShowSizeChange,
        onPageChange,
        onClickAddBrand,
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
    :deep(#editBtn) {
      margin-right: 10px;
      background-color: #40a9ff;
      color: white;
      border-radius: 4px;
    }
    :deep(#deleteBtn) {
      background-color: #ff4d4f;
      color: white;
      border-radius: 4px;
    }
  }
  .pagination {
    text-align: center;
  }
</style>
