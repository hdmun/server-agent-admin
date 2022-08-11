<template>
  <v-card>
    <v-card-title>
      서버 프로세스
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table :headers="headers" :items="processes">
      <template #[`item.alive`]="{ item }">
        <v-chip :color="item.alive ? 'green' : 'red'">
          {{ item.alive ? 'Running' : 'Dead' }}
        </v-chip>
      </template>

      <template #[`item.command`]="{ item }">
        <v-chip :disabled="!item.alive" @click="onClickClose(item)">
          Close
        </v-chip>
      </template>
    </v-data-table>

    <KillCommandDialog :open.sync="progress" :errorMessage.sync="errorMessage" :hostName="select.hostName"
      :serverName="select.serverName" @onKillCommand="onKillCommand" />
    <ErrorSnackBar :text="errorMessage" :show="errorMessage !== ''" />
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, PropSync, Vue } from 'nuxt-property-decorator'

import ErrorSnackBar from '@/components/ErrorSnackBar.vue'
import KillCommandDialog from '@/components/KillCommandDialog.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import { ProcessKillResponse, ProcessTableItem } from '@/dto/process'

interface TableHeader {
  text: string
  value: string
}

interface SelectProcessTableItem {
  hostName: string
  serverName: string
}

@Component({
  components: {
    ErrorSnackBar,
    LoadingDialog,
    KillCommandDialog
  }
})
export default class ProcessTable extends Vue {
  headers: TableHeader[] = [
    { text: 'HostName', value: 'hostName' },
    { text: 'Server', value: 'serverName' },
    { text: 'Process', value: 'processName' },
    { text: 'Processing Time (sec)', value: 'processingTime' },
    { text: 'ThreadId', value: 'threadId' },
    { text: 'Last Receive', value: 'receiveTimeText' },
    { text: 'Alive', value: 'alive' },
    { text: 'Close Command', value: 'command' },
  ]

  @PropSync('processProp', { type: Array as PropType<Array<ProcessTableItem>> })
  processes?: ProcessTableItem[]

  select: SelectProcessTableItem = { hostName: '', serverName: '' }
  progress: boolean = false
  errorMessage: string = ''

  mounted() { }

  onClickClose(item: ProcessTableItem) {
    this.select.hostName = item.hostName
    this.select.serverName = item.serverName
    this.progress = true
  }

  async onKillCommand(command: string) {
    try {
      const response = await this.$axios.delete<ProcessKillResponse>(
        `/api/server/${this.select.hostName}/${this.select.serverName}/${command}`)
      console.log(`ProcessKillResponse`, response.data)
      for (const killedProcess of response.data.servers) {
        const process = this.processes?.find((value) => value.serverName === killedProcess.serverName)
        if (process) {
          process.alive = !killedProcess.close
        }
      }
    } catch (error) {
      let message = ''
      if (error instanceof Error) message = error.message
      else message = String(error)

      this.errorMessage = message
    }
    this.progress = false
  }
}
</script>
