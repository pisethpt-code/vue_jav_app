import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // Import full styles
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'cn',
  fallbackLocale: 'cn',
  messages: {
    cn: {
      message: {
        loadData: '地块列表',
        refresh: '刷新',
        materialCode: '物料编码',
        materCodePlaceholder: '请输入物料编码',
        rubberBatch: '天然胶批次',
        rubberBatchPlaceholder: '请输入批次号',
        fileUpload: '文件上传',
        excelTextLabel: '地块信息EXCEL',
        jsonTextLabel: '地块信息JSON还没传',
        pdfTextLable: '尽职声明PDF未上传',
        fileTextLabelHasnt: '还没传',
        dragInTextLabel: '拖入',
        fileOrTextLabel: '文件 或',
        clickToUpload: '点击上传',
        documentTextLabel: '文件',
        fileSupport: '支持',
        formatFileSize: '格式，文件大小不超过',
      },
    },
    en: {
      message: {
        loadData: 'Query Data',
        refresh: 'Refresh',
        materialCode: 'Material Code',
        materCodePlaceholder: 'Please enter the material code',
        rubberBatch: 'Rubber Batch',
        rubberBatchPlaceholder: 'Please enter the batch number',
        fileUpload: 'File Upload',
        excelTextLabel: 'EXCEL file',
        jsonTextLabel: 'JSON file',
        pdfTextLable: 'PDF file',
        fileTextLabelHasnt: " hasn't been uploaded yet",
        dragInTextLabel: 'Drag in',
        fileOrTextLabel: 'File or',
        clickToUpload: 'Click to upload',
        documentTextLabel: 'document',
        fileSupport: 'support',
        formatFileSize: 'Format; file size not to exceed',
      },
    },
    kh: {
      message: {
        loadData: 'ទាញទិន្ន័យ',
        refresh: 'ធ្វើអោយស្រស់',
        materialCode: 'លេខកូដសម្ភារៈ',
        materCodePlaceholder: 'សូមបញ្ចូលលេខកូដសម្ភារៈ',
        rubberBatch: 'បាច់កៅស៊ូ',
        rubberBatchPlaceholder: 'សូមបញ្ចូលលេខបាច់',
        fileUpload: 'ការផ្ទុកឯកសារឡើង',
        excelTextLabel: 'ឯកសារExcel',
        jsonTextLabel: 'ឯកសារJSON',
        pdfTextLable: 'ឯកសារPDF',
        fileTextLabelHasnt: 'មិនទាន់បញ្ចូលនៅឡើយទេ',
        dragInTextLabel: 'អូសចូល',
        fileOrTextLabel: 'ឯកសារ ឬ',
        clickToUpload: 'ចុច​ដើម្បី​ផ្ទុក​ឡើង',
        documentTextLabel: 'ឯកសារ',
        fileSupport: 'ការគាំទ្រ',
        formatFileSize: 'ទម្រង់; ទំហំឯកសារមិនត្រូវលើសពី',
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(i18n)

app.mount('#app')
