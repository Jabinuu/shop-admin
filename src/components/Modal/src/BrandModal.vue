<template>
  <BasicModal v-bind="$attrs" @register="register" title="添加品牌" @ok="onOk" @cancel="onCancel">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="品牌名称"
        name="brandName"
        :rules="[{ required: true, message: '请输入品牌名称！' }]"
      >
        <a-input v-model:value="formState.brandName" />
      </a-form-item>

      <a-form-item label="品牌Logo" name="logo">
        <a-upload
          v-model:file-list="fileList"
          name="tmLogo"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :customRequest="uploadLogo"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传logo</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal'
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
  import { useBrandStore } from '/@/store/modules/brand'
  import { object } from 'vue-types'
  interface FormState {
    brandName: string
  }

  function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  export default defineComponent({
    name: 'BrandModal',
    components: { BasicModal, LoadingOutlined, PlusOutlined },
    emits: ['added', 'register', 'edited'],
    setup(_, { emit }) {
      const callback = (data: any): void => {
        formState.brandName = data.tmName
        imageUrl.value = data.url
        id.value = data.id
        if (Object.keys(data).length !== 0) {
          isEdit.value = true
        }
      }
      const [register, { closeModal, setModalProps }] = useModalInner(callback)
      const brandStore = useBrandStore()
      const fileList = ref([])
      const loading = ref<boolean>(false)
      const imageBase64 = ref<string>('')
      const imageUrl = ref<string>('')
      const formState = reactive<FormState>({
        brandName: '',
      })
      const isEdit = ref<boolean>(false)
      const id = ref<number>(0)

      const onFinish = (values: any) => {
        console.log('Success:', values)
      }

      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
      }

      const handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
          loading.value = true
          return
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          imageUrl.value = info.file.response
          getBase64(info.file.originFileObj, (base64Url: string) => {
            imageBase64.value = base64Url
            loading.value = false
          })
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

      // 手动封装Upload组件的上传请求，覆盖默认的action
      const uploadLogo = async (data: { file: any; onError?: any; onSuccess?: any }) => {
        const { file, onError, onSuccess } = data
        let formData = new FormData() // 表单数据
        formData.append('file', file)
        try {
          const logoUrl = await brandStore.uploadLogo(formData)
          // 调用回调函数，说明上传完成,修改状态status
          onSuccess(logoUrl)
        } catch (error) {
          onError(error)
        }
      }

      // 点击弹窗确定按钮的回调
      const onOk = async (e): void => {
        // 发请求
        if (imageUrl.value && formState.brandName) {
          if (!isEdit.value) {
            await brandStore.addBrand({ logoUrl: imageUrl.value, tmName: formState.brandName })
            message.success('添加品牌成功！')

            emit('added')
          } else {
            await brandStore.updateBrand({
              logoUrl: imageUrl.value,
              tmName: formState.brandName,
              id: id.value,
            })
            message.success('修改品牌成功！')
            emit('edited')
            isEdit.value = false
          }
          closeModal()
          clearModal()
        } else {
          message.warn('请输入品牌名并上传logo！')
        }
      }

      const onCancel = (): void => {
        clearModal()
      }

      const clearModal = (): void => {
        imageUrl.value = ''
        formState.brandName = ''
      }
      return {
        fileList,
        loading,
        imageUrl,
        imageBase64,
        formState,
        onOk,
        onCancel,
        onFinish,
        onFinishFailed,
        handleChange,
        beforeUpload,
        uploadLogo,
        register,
        closeModal,
      }
    },
  })
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
</style>
