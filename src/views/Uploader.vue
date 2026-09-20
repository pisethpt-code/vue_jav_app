<script setup>
import { ref, onBeforeUpdate, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import FileUploader from '@/components/FileUploader.vue';

const { t } = useI18n();
const router = useRouter();

const materialCode = ref('200330')
const batchNumber = ref('C26B01')

const uploaderRefs = ref([])
const filesUploaded = reactive({
    excel: null,
    json: null,
    pdf: null
})

const excelCurrentRecordId = ref(0);
const jsonCurrentRecordId = ref(0);
const pdfCurrentRecordId = ref(0);

const handleGetLandParcelList = async () => {
    ElMessage({
        message: t('message.onpenPlotListMessage'),
        type: 'primary',
        icon: ''
    })

    const url = router.resolve({
        name: 'list',
        query: {},
    });

    window.open(url.href, '_blank');
}

const handleRefresh = () => {
    ElMessage.primary(t('message.refreshPageMessage'))
    window.location.reload()
}

const handleSubmit = async () => {
    if (!materialCode.value || materialCode.value === null || materialCode.value.trim() === '') {
        ElMessage.error(t('message.materialCodeEmptyMessage'))
        return
    }

    if (batchNumber.value === null || batchNumber.value.trim() === '') {
        ElMessage.error(t('message.rubberBatchEmptyMessage'))
        return
    }

    if (filesUploaded.excel === null && filesUploaded.json === null && filesUploaded.pdf === null) {
        ElMessage.error(t('message.allowDocFileMessage') + 'EXCEL、JSON、PDF')
        return
    }

    try {
        const filePayloads = {
            excelFile: filesUploaded.excel?.file || null,
            jsonFile: filesUploaded.json?.file || null,
            pdfFile: filesUploaded.pdf?.file || null
        }

        ElMessage.success(t('message.successMessage'))
    } catch (error) {
        ElMessage.error(error)
        console.error(error)
    }
}

const handleResetAll = () => {
    ElMessageBox.confirm(
        t('message.alertComfirmResetMessage'),
        {
            distinguishCancelAndClose: true,
            confirmButtonText: t('message.yes'),
            cancelButtonText: t('message.cancel'),
        }
    )
        .then(() => {
            uploaderRefs.value.forEach((uploader) => {
                uploader?.reset()
            })

            filesUploaded.excel = null;
            filesUploaded.json = null;
            filesUploaded.pdf = null;

            materialCode.value = '';
            batchNumber.value = '';

            ElMessage({
                type: 'primary',
                message: t('message.reseted'),
            })
        })
        .catch((action) => {
        })
}

const setUploaderRef = (el) => {
    if (el) {
        uploaderRefs.value.push(el)
    }
}

onBeforeUpdate(() => {
    uploaderRefs.value = []
})

const handleFileUploadChange = (type, payload) => {
    filesUploaded[type] = payload;

    // console.log(JSON.stringify(filesUploaded));
}
</script>

<template>
    <div style="display: flex; flex-direction: column; margin: 15px; gap: 10px;">
        <!-- main buttons -->
        <el-card>
            <div style="display: flex; justify-content: space-between;">
                <div class="card-background">
                    <el-button @click="handleGetLandParcelList" type="primary">
                        {{
                            $t('message.loadData') }}</el-button>
                    <el-button @click="handleRefresh" type="success">
                        {{
                            $t('message.refresh')
                        }}</el-button>
                </div>
            </div>
        </el-card>

        <!-- input fields blocks -->
        <el-card class="card-background">
            <div style="display: flex !important; flex-wrap: wrap; flex-direction: row !important; gap: 15px">
                <div
                    style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 10px; align-items: center !important;">
                    <label for="materialCode"><em style="color: red !important;">* </em>{{ $t('message.materialCode')
                        }}:</label>
                    <el-input v-model="materialCode" style="width: 240px;"
                        :placeholder="$t('message.materCodePlaceholder')" />
                </div>

                <div
                    style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 10px; align-items: center !important;">
                    <label for="batchNumber"><em style="color: red !important;">* </em>{{ $t('message.rubberBatch')
                        }}:</label>
                    <el-input v-model="batchNumber" style="width: 240px"
                        :placeholder="$t('message.rubberBatchPlaceholder')" />
                </div>
            </div>
        </el-card>

        <!-- uploads block -->
        <el-card class="card-background">
            <template #header>
                <div class="card-header">
                    <span style="font-weight: bold">{{ $t('message.fileUpload') }}</span>
                </div>
            </template>

            <!-- excel accept files-->
            <FileUploader :ref="setUploaderRef" @upload-success="(data) => handleFileUploadChange('excel', data)"
                @file-deleted="() => handleFileUploadChange('excel', null)" :label-text="$t('message.excelTextLabel')"
                format-text="EXCEL" allowed-extensions=".xlsx,.xls" allowed-types-text=".xlsx / .xls"
                :material-code="materialCode" :batch-number="batchNumber" :current-record-id="excelCurrentRecordId" />

            <!-- json accept file-->
            <FileUploader class="margin-top" :ref="setUploaderRef"
                @upload-success="(data) => handleFileUploadChange('json', data)"
                @file-deleted="() => handleFileUploadChange('json', null)" :label-text="$t('message.jsonTextLabel')"
                format-text="JSON" allowed-extensions=".json" allowed-types-text=".json" :max-size-m-b="5"
                :material-code="materialCode" :batch-number="batchNumber" :current-record-id="jsonCurrentRecordId" />

            <!-- pdf accept file -->
            <FileUploader class="margin-top" :ref="setUploaderRef"
                @upload-success="(data) => handleFileUploadChange('pdf', data)"
                @file-deleted="() => handleFileUploadChange('pdf', null)" :label-text="$t('message.pdfTextLable')"
                format-text="PDF" allowed-extensions=".pdf" allowed-types-text=".pdf" :max-size-m-b="20"
                :material-code="materialCode" :batch-number="batchNumber" :current-record-id="pdfCurrentRecordId" />
        </el-card>

        <!-- action buttons -->
        <!-- <el-card class="card-background">
            <div
                style="display: flex !important; flex-direction: row !important; gap: 5px; justify-content: center !important;">
                <el-button @click="handleResetAll">{{ $t('message.reset') }}</el-button>
                <el-button @click="handleSubmit" type="primary">{{ $t('message.submit') }}</el-button>
            </div>
        </el-card> -->
    </div>
</template>

<style>
.text-color {
    color: white;
}

.card-background {
    background-color: white !important;
}

.margin-top {
    margin-top: 18px;
}
</style>