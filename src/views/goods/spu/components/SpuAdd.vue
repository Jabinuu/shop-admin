<template>
  <a-form :label-col="{ style: { width: '70px' } }">
    <a-form-item label="SPU名称">
      <a-input placeholder="SPU名称" v-model:value="spu.spuName"></a-input>
    </a-form-item>
    <a-form-item label="品牌">
      <a-select
        v-model:value="tmSelector"
        placeholder="请选择品牌"
        :options="tmList"
        style="width: 250px"
        @change="handleBrandChange"
      >
      </a-select>
    </a-form-item>
    <a-form-item label="SPU描述">
      <a-textarea v-model:value="spu.description" placeholder="SPU描述" />
    </a-form-item>
    <a-form-item label="SPU图片">
      <a-upload
        v-model:file-list="fileList"
        name="file"
        action="/advanced-api/admin/product/fileUpload"
        list-type="picture-card"
        @preview="handlePreview"
      >
        <div v-if="fileList.length < 8">
          <plus-outlined />
          <div style="margin-top: 8px">Upload</div>
        </div>
      </a-upload>
      <a-modal
        :visible="previewVisible"
        :title="previewTitle"
        :footer="null"
        @cancel="handleCancel"
      >
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-form-item>
    <a-form-item label="销售属性">
      <a-select
        v-model:value="saleAttr"
        :placeholder="saleAttrList.length ? `还有${saleAttrList.length}未选择` : '已全部选择'"
        :options="saleAttrList"
        style="width: 250px; margin-right: 20px"
        @change="handleSaleAttrChange"
      >
      </a-select>
      <a-button type="primary" @click="onClickAddSaleAttr" :disabled="!isSelected"
        ><Icon icon="ant-design:plus-outlined"></Icon>添加销售属性</a-button
      >
      <a-table
        :columns="columns"
        :data-source="spu.spuSaleAttrList"
        bordered
        :pagination="false"
        style="margin-top: 10px"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'spuSaleAttrValueList'">
            <template v-for="tag in record.spuSaleAttrValueList" :key="tag">
              <a-tag closable @close="handleClose(tag, record)">
                {{ tag.saleAttrValueName }}
              </a-tag>
            </template>
            <a-input
              v-if="record.inputVisible"
              ref="inputRef"
              v-model:value="record.tempAttrValue"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              @blur="handleInputConfirm(record)"
              @keyup.enter="handleInputConfirm(record)"
            />
            <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput(record)">
              <plus-outlined />
              添加
            </a-tag>
          </template>
          <template v-if="column.key === 'operation'">
            <a-button type="danger" title="删除销售属性" @click="onClickRemoveSaleAttr(record)"
              ><Icon icon="material-symbols:delete-outline"></Icon
            ></a-button>
          </template>
        </template>
      </a-table>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 3, offset: 1 }">
      <a-button type="primary" @click="onSubmit">保存</a-button>
      <a-button style="margin-left: 10px" @click="onClickCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
  import {
    defineComponent,
    reactive,
    toRaw,
    ref,
    onMounted,
    onUnmounted,
    computed,
    nextTick,
  } from 'vue'
  import { Icon } from '/@/components/Icon'
  import useSpuStore from '/@/store/modules/spu'
  import mitt from '/@/utils/useMitt'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import { message, UploadProps } from 'ant-design-vue'

  const emit = defineEmits(['change'])
  const spuStore = useSpuStore()
  const spu = reactive({
    id: undefined,
    category3Id: 0,
    description: '',
    spuName: '',
    tmId: undefined,
    spuImageList: [],
    spuSaleAttrList: [],
  })
  const tmList = computed(() => spuStore.tmList)
  const saleAttr = ref(undefined)
  const saleAttrList = computed(() => spuStore.saleAttrs)
  let selectedSaleOption = {}
  const columns = [
    { title: '序号', dataIndex: 'baseSaleAttrId', key: 'baseSaleAttrId', width: 80 },
    { title: '属性名', dataIndex: 'saleAttrName', key: 'saleAttrName', width: 200 },
    {
      title: '属性值名称列表',
      dataIndex: 'spuSaleAttrValueList',
      key: 'spuSaleAttrValueList',
      width: 600,
    },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]
  const previewVisible = ref(false)
  const previewImage = ref('')
  const previewTitle = ref('')
  const fileList = ref<UploadProps['fileList']>([])
  const isSelected = ref<boolean>(false)
  const tmSelector = ref(undefined)
  const inputRef = ref()

  onMounted(() => {
    mitt.on('addNewSpu', getCategory3Id)
    mitt.on('updateSpu', getSpuById)
    // spuStore.getBrandList()
    // spuStore.getSaleAttrList()
  })

  onUnmounted(() => {
    mitt.off('addNewSpu', getCategory3Id)
    mitt.off('updateSpu', getSpuById)
  })

  const getCategory3Id = (e) => (spu.category3Id = e)

  const getSpuById = async (spuId) => {
    const temp = await spuStore.getSpuById(spuId)
    spu.id = temp.id
    spu.category3Id = temp.category3Id
    spu.description = temp.description
    spu.spuName = temp.spuName
    spu.tmId = temp.tmId
    spu.spuImageList = temp.spuImageList
    spu.spuSaleAttrList = temp.spuSaleAttrList
    tmSelector.value = await spuStore.getBrandById(temp.tmId)
    spuStore.saleAttrList = spuStore.saleAttrList.filter(
      (item) => temp.spuSaleAttrList.findIndex((elem) => elem.saleAttrName == item.name) == -1,
    )
  }

  const handleBrandChange = (_, option) => (spu.tmId = option.id)

  const handleSaleAttrChange = (_, option) => {
    selectedSaleOption = option
    isSelected.value = true
  }

  const onClickAddSaleAttr = () => {
    spuStore.restSaleAttrs(selectedSaleOption.value)
    saleAttr.value = undefined
    spu.spuSaleAttrList.push({
      tempAttrValue: '', //辅助用，发请求时可去掉
      inputVisible: false, //辅助用，发请求时可去掉
      baseSaleAttrId: selectedSaleOption.id,
      saleAttrName: selectedSaleOption.value,
      spuId: undefined,
      id: undefined,
      spuSaleAttrValueList: [],
    })
    isSelected.value = false
  }

  const handleCancel = () => {
    previewVisible.value = false
    previewTitle.value = ''
  }

  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    previewImage.value = file.response.data || file.preview
    previewVisible.value = true
    previewTitle.value =
      file.name || file.response.data.substring(file.response.data.lastIndexOf('/') + 1)
  }

  const onSubmit = async () => {
    // 收集图片墙数据，添加到请求参数中
    fileList.value.forEach((item) => {
      spu.spuImageList.push({
        id: undefined,
        imgName: item.name,
        imgUrl: item.response.data,
        spuId: undefined,
      })
    })
    // 发送请求保存spu
    await spuStore.saveNewSpu(spu)
    clearForm()
    message.success('添加Spu成功！')
    emit('change', 'SpuTable')
  }

  const onClickCancel = () => {
    clearForm()
    emit('change', 'SpuTable')
  }

  // 移除某个tag标签
  const handleClose = (removedTag: string, e: any) => {
    e.spuSaleAttrValueList = e.spuSaleAttrValueList.filter((tag) => tag !== removedTag)
  }

  // 点击添加，展示输入框
  const showInput = (e) => {
    e.inputVisible = true
    nextTick(() => inputRef.value.focus())
  }

  // 输入框失去焦点
  const handleInputConfirm = (e) => {
    if (e.tempAttrValue) {
      e.spuSaleAttrValueList.push({
        saleAttrValueName: e.tempAttrValue,
        saleAttrName: e.saleAttrName,
        baseSaleAttrId: e.baseSaleAttrId,
        isChecked: 'true',
        spuId: undefined,
        id: undefined,
      })
      e.tempAttrValue = ''
    }
    e.inputVisible = false
  }

  const onClickRemoveSaleAttr = (e) => {
    spu.spuSaleAttrList = spu.spuSaleAttrList.filter(
      (item) => item.baseSaleAttrId !== e.baseSaleAttrId,
    )
    spuStore.saleAttrList.push({
      name: e.saleAttrName,
      id: e.baseSaleAttrId,
    })
  }

  // 恢复表单初始状态
  async function clearForm() {
    spu.description = ''
    spu.spuName = ''
    spu.spuImageList = []
    spu.spuSaleAttrList = []
    fileList.value = []
    saleAttr.value = undefined
    tmSelector.value = undefined
    previewImage.value = ''
    await spuStore.getSaleAttrList()
  }
</script>

<style lang="less" scoped>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  :deep(.ant-form-item-label > label) {
    font-size: 14px;
    font-weight: bold;
  }
</style>
