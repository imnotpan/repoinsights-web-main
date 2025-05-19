import { defineStore } from 'pinia'
import {axiosNLP} from '@/plugins/axios.js'

export const useMetricStore = defineStore('metric', {
  state: () => ({
    metrics: [],
    page: 0,
    hasMore: true,
    lastQuery: ''
  }),
  actions: {
    async searchMetrics(query, limit = 10) {
      this.page = 0
      this.lastQuery = query
      const response = await axiosNLP.get('/core/metrics/search', {
        params: { query, limit, offset: 0 }
      })
      this.metrics = response.data
      this.hasMore = response.data.length === limit
    },
    async fetchMore(limit = 10) {
      if (!this.hasMore) return
      const offset = (this.page + 1) * limit
      const response = await axiosNLP.get('/core/metrics/search', {
        params: { query: this.lastQuery, limit, offset }
      })
      this.metrics.push(...response.data)
      this.page++
      this.hasMore = response.data.length === limit
    },
    clear() {
      this.metrics = []
      this.page = 0
      this.hasMore = true
      this.lastQuery = ''
    }
  }
})
