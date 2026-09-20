<script setup>
import { ref, onMounted, computed } from 'vue'
import { useConfig } from '@/stores/config'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const store = useConfig()
const { t } = useI18n()
const router = useRouter()
const isLoadData = ref(true);
const search = ref('');

const materialCode = window.history.state?.materialCode || ''
const batchNumber = window.history.state?.batchNumber || ''

const dataTable = ref([])

const handleDownload = async (fileName, type) => {
    const loadingInstance = ElLoading.service({ text: t('message.downloadingFileMessage') })
    try {
        await store.downloadFile(fileName)
        ElMessage.success(type + t('message.downloadSuccessMessage'))
    } catch (error) {
        console.error(error)
        ElMessage.error(t('message.downloadFileFailedMessage'))
    } finally {
        loadingInstance.close()
    }
}

const handleViewPdf = async (fileName) => {
    const loadingInstance = ElLoading.service({ text: t('message.loadingPdf') })
    try {
        await store.viewPdfFile(fileName)
    } catch (error) {
        console.error(error)
        ElMessage.error(t('message.failedLoadPdf'))
    } finally {
        loadingInstance.close()
    }
}

onMounted(async () => {
    try {
        isLoadData.value = true
        const res = await store.getPlotList()
        if (res) dataTable.value = res

    } catch (error) {
        console.error(error)
        ElMessage.error(error?.message || 'Data retrieval failed')
        isLoadData.value = false
    } finally {
        isLoadData.value = false
    }
})

const dataFilterTable = computed(() => {
    if (!dataTable.value) return []

    const query = search.value.toLowerCase()
    if (!query) return dataTable.value

    return dataTable.value.filter((data) =>
        data.materialCode?.toLowerCase().includes(query) ||
        data.rubberBatchCode?.toLowerCase().includes(query)
    )
})
</script>

<template>
    <div class="container">
        <!-- <el-button @click="() => router.back()" style="margin-bottom: 16px;">以前的</el-button> -->
        <div
            style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 10px; align-items: center !important; margin: 5px 0;">
            <label for="materialCode" style="color: #333;">{{ $t('message.searchLabel') }}:</label>
            <el-input v-model="search" style="width: 240px;" :placeholder="$t('message.searchPlaceholder')"
                :clearable="true" />
        </div>
        <el-table v-loading="isLoadData" :data="dataFilterTable" stripe style="width: 100%"
            :header-cell-style="{ fontWeight: 'bold', backgroundColor: '#f5f7fa', color: '#333' }">
            <el-table-column prop="materialCode" :label="$t('message.material')" width="140" sortable fixed="left" />
            <el-table-column prop="rubberBatchCode" :label="$t('message.batch')" width="120" sortable fixed="left" />
            <el-table-column prop="excelFileName" label="EXCEL" show-overflow-tooltip min-width="150" />
            <el-table-column prop="jsonFileName" label="JSON" show-overflow-tooltip min-width="150" />
            <el-table-column prop="pdfFileName" label="PDF" show-overflow-tooltip min-width="150" />
            <el-table-column prop="createTime" :label="$t('message.createTime')" width="180" sortable />

            <el-table-column :label="$t('message.operator')" width="380">
                <template #default="slot">
                    <el-button :disabled="!slot.row.excelFileName"
                        @click="handleDownload(slot.row.excelFileName, 'EXCEL')"
                        :type="!slot.row.excelFileName ? 'link' : 'primary'" size="small">
                        {{ $t('message.download') }}excel
                    </el-button>

                    <el-button :disabled="!slot.row.jsonFileName" @click="handleDownload(slot.row.jsonFileName, 'JSON')"
                        :type="!slot.row.jsonFileName ? 'link' : 'primary'" size="small">
                        {{ $t('message.download') }}json
                    </el-button>

                    <el-button :disabled="!slot.row.pdfFileName" @click="handleViewPdf(slot.row.pdfFileName)"
                        :type="!slot.row.pdfFileName ? 'link' : 'primary'" size="small">
                        {{ $t('message.download') }}pdf
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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
