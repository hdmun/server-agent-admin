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
          processingTime: -1,
          threadId: -1,
          receiveTime: 'waiting...',
          alive: false,
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

  mounted() { }
  beforeDestroy() { }
}
</script>
