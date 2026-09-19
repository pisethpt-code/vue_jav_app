<script setup>
import { ref, onMounted } from 'vue'
import { useConfig } from '@/stores/config'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const store = useConfig()
const { t } = useI18n()
const router = useRouter()

const materialCode = window.history.state?.materialCode || ''
const batchNumber = window.history.state?.batchNumber || ''

const dataTable = ref([])

const handleDownload = async (fileName, type) => {
    const loadingInstance = ElLoading.service({ text: '正在下载文件...' })
    try {
        await store.downloadFile(fileName)
        ElMessage.success(type + '下载成功')
    } catch (error) {
        console.error(error)
        ElMessage.error('文件下载失败，请重试')
    } finally {
        loadingInstance.close()
    }
}

const handleViewPdf = async (fileName) => {
    const loadingInstance = ElLoading.service({ text: '正在加载 PDF...' })
    try {
        await store.viewPdfFile(fileName)
    } catch (error) {
        console.error(error)
        ElMessage.error('PDF 文件加载失败')
    } finally {
        loadingInstance.close()
    }
}

onMounted(async () => {
    try {
        const res = await store.getPlotList()
        if (res) dataTable.value = res
    } catch (error) {
        console.error(error)
        ElMessage.error(error?.message || 'Data retrieval failed')
    }
})
</script>

<template>
    <div class="container">
        <!-- <el-button @click="() => router.back()" style="margin-bottom: 16px;">以前的</el-button> -->

        <el-table v-if="dataTable.length > 0" :data="dataTable" stripe style="width: 100%"
            :header-cell-style="{ fontWeight: 'bold', backgroundColor: '#f5f7fa', color: '#333' }">
            <el-table-column prop="materialCode" :label="$t('message.material')" width="140" sortable fixed="left" />
            <el-table-column prop="rubberBatchCode" :label="$t('message.batch')" width="120" sortable fixed="left" />
            <el-table-column prop="excelFileName" label="EXCEL" show-overflow-tooltip />
            <el-table-column prop="jsonFileName" label="JSON" show-overflow-tooltip />
            <el-table-column prop="pdfFileName" label="PDF" show-overflow-tooltip />
            <el-table-column prop="createTime" :label="$t('message.createTime')" width="180" sortable />

            <el-table-column :label="$t('message.operator')" width="360">
                <template #default="slot">
                    <el-button :disabled="!slot.row.excelFileName"
                        @click="handleDownload(slot.row.excelFileName, 'EXCEL')" type="primary" size="small">
                        {{ $t('message.download') }}excel
                    </el-button>

                    <el-button :disabled="!slot.row.jsonFileName" @click="handleDownload(slot.row.jsonFileName, 'JSON')"
                        type="primary" size="small">
                        {{ $t('message.download') }}json
                    </el-button>

                    <el-button :disabled="!slot.row.pdfFileName" @click="handleViewPdf(slot.row.pdfFileName)"
                        type="primary" size="small">
                        {{ $t('message.download') }}pdf
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-else class="content-center">
            <el-empty />
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    height: auto;
    margin: 10px;
}

.content-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}
</style>
