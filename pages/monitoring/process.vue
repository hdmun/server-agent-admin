<template>
  <v-row>
    <v-col lg="9">
      <ProcessTable :processProp.sync="processes" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'

import ProcessTable from '@/components/monitoring/processTable.vue'
import { ProcessResponse, ProcessTableItem } from '@/dto/process'


function calcDiffSec(receiveTime: string) {
  try {
    const diffInMs = Math.abs(new Date().getTime() - new Date(receiveTime).getTime());
    if (diffInMs) {
      return `${Math.floor(diffInMs / 1000)}초 전`;
    }
  }
  catch { }
  return 'waiting...';
}


@Component({
  components: {
    ProcessTable
  },
  async asyncData(ctx: Context) {
    try {
      const response = await ctx.$axios.get<ProcessResponse[]>(`/api/server`)
      const processes = response.data.map<ProcessTableItem>((value) => {
        return {
          hostName: value.hostName,
          serverName: value.serverName,
          processName: value.processName,
          threadId: value.threadId,
          processingTime: value.processingTime,
          receiveTime: value.receiveTime,
          receiveTimeText: calcDiffSec(value.receiveTime),
          alive: value.threadId !== 0,
        }
      })
      return { processes }
    } catch (error) {
      return { processes: [] }
    }
  }
})
export default class ProcessPage extends Vue {
  processes: ProcessTableItem[] = []

  receiveTimer?: number = 0
  refreshTimer?: number

  mounted() {
    this.receiveTimer = window.setInterval(() => {
      for (const process of this.processes) {
        process.receiveTimeText = calcDiffSec(process.receiveTime);
      }
    }, 1000)

    this.refreshTimer = window.setInterval(() => {
      this.requestServers()
    }, 5000)
  }

  beforeDestroy() {
    if (this.receiveTimer) {
      window.clearInterval(this.receiveTimer)
    }

    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer)
    }
  }

  async requestServers() {
    const response = await this.$axios.get<ProcessResponse[]>(`/api/server`)
    this.processes = response.data.map<ProcessTableItem>((value) => {
      return {
        hostName: value.hostName,
        serverName: value.serverName,
        processName: value.processName,
        threadId: value.threadId,
        processingTime: value.processingTime,
        receiveTime: value.receiveTime,
        receiveTimeText: calcDiffSec(value.receiveTime),
        alive: value.threadId !== 0,
      }
    })
  }
}
</script>
