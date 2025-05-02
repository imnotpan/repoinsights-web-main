// src/stores/chartStore.js
import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', {
  state: () => ({
    dataMap: {}  // { [messageId]: { labels, values, axis_labels, chart_type } }
  }),
  actions: {
    setChartData(messageId, data) {
      this.dataMap[messageId] = data
    }
  }
})
