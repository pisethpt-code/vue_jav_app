import { defineStore } from 'pinia'
import axios from 'axios'

export const useConfig = defineStore('useConfig', {
  state: () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL
    return {
      BASE_URL,
    }
  },
  getters: {},
  actions: {
    async getPlotList(materialCode, rubberBatch) {
      const endpoint = `${this.BASE_URL}/api/v1/mes/order/list`
      try {
        const response = await axios.get(endpoint, {
          params: {
            materialCode: materialCode || null,
            rubberBatch: rubberBatch || null,
          },
        })

        if (response.status !== 200) return response.statusText
        return response.data
      } catch (error) {
        console.error('getPlotList error:', error)
        throw error
      }
    },

    async singleUploadFile(materialCode, rubberBatch, rawFile) {
      try {
        if (!rawFile) {
          return Promise.reject('Invalid file: File object is missing.')
        }

        const fileObj = rawFile.file || rawFile

        const formData = new FormData()
        formData.append('file', fileObj)

        console.log('form data: ' + JSON.stringify(formData))

        const endpoint = `${this.BASE_URL}/api/v1/mes/order/upload`

        const response = await axios.post(endpoint, formData, {
          params: {
            materialNo: materialCode || '',
            batchNo: rubberBatch || '',
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        return response.data
      } catch (error) {
        console.error('singleUploadFile error:', error)
        throw error
      }
    },
  },
})
