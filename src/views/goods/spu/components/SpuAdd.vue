<template>
  <a-form :label-col="labelCol">
    <a-form-item label="SPU名称">
      <a-input placeholder="SPU名称" v-model:value="spu.spuName"></a-input>
    </a-form-item>
    <a-form-item label="品牌">
      <a-select
        v-model:value="spu.tmId"
        placeholder="请选择品牌"
        :options="tmList"
        style="width: 250px"
      >
      </a-select>
    </a-form-item>
    <a-form-item label="SPU描述">
      <a-textarea v-model:value="spu.description" placeholder="SPU描述" />
    </a-form-item>
    <a-form-item label="SPU图片">
      <a-upload
        v-model:file-list="fileList"
        name="avatar11"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item label="销售属性">
      <a-select
        v-model:value="saleAttr"
        placeholder="还有3未选择"
        :options="saleAttrList"
        style="width: 250px; margin-right: 20px"
      >
      </a-select>
      <a-button type="primary"><Icon icon="ant-design:plus-outlined"></Icon>添加销售属性</a-button>
      <a-table :columns="columns" :data-source="[]" bordered style="margin-top: 10px"> </a-table>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 3, offset: 1 }">
      <a-button type="primary" @click="onSubmit">保存</a-button>
      <a-button style="margin-left: 10px" @click="onClickCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
  import { defineComponent, reactive, toRaw, ref, onMounted, onUnmounted } from 'vue'
  import { Icon } from '/@/components/Icon'
  import mitt from '/@/utils/useMitt'
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  const labelCol = reactive({ style: { width: '70px' } })
  const emit = defineEmits(['change'])

  const spu = reactive({
    category3Id: 0,
    description: '',
    spuName: '',
    tmId: '',
    spuImageList: [
      // {
      //   id: 0,
      //   imgName: "string",
      //   imgUrl: "string",
      //   spuId: 0,
      // },
    ],
    //平台属性与属性值收集
    spuSaleAttrList: [
      // {
      //   baseSaleAttrId: 0,
      //   id: 0,
      //   saleAttrName: "string",
      //   spuId: 0,
      //   spuSaleAttrValueList: [
      //     {
      //       baseSaleAttrId: 0,
      //       id: 0,
      //       isChecked: "string",
      //       saleAttrName: "string",
      //       saleAttrValueName: "string",
      //       spuId: 0,
      //     },
      //   ],
      // },
    ],
  })
  const tmList = reactive([
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
  ])
  const saleAttr = ref<string>(undefined)
  const saleAttrList = reactive([
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
  ])
  const fileList = ref([])
  const loading = ref<boolean>(false)
  const imageUrl = ref<string>('')
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
    { title: '属性名', dataIndex: 'attrName', key: 'attrName', width: 200 },
    { title: '属性值名称列表', dataIndex: 'attrNameList', key: 'attrNameList', width: 600 },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]

  onMounted(() => {
    mitt.on('passId3', getCategory3Id)
  })

  onUnmounted(() => {
    mitt.off('passId3', getCategory3Id)
  })

  const getCategory3Id = (e) => (spu.category3Id = e)

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      loading.value = true
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, (base64Url: string) => {
      //   imageUrl.value = base64Url
      //   loading.value = false
      // })
    }
    if (info.file.status === 'error') {
      loading.value = false
      message.error('upload error')
    }
  }

  const beforeUpload = (file: UploadProps['fileList'][number]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const onSubmit = () => {
    console.log('submit!', toRaw(formState))
  }

  const onClickCancel = () => {
    emit('change', 'SpuTable')
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
