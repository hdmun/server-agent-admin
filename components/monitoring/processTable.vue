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
        <v-chip :disabled="!item.alive" @click="onClickClose">
          Close
        </v-chip>
      </template>
    </v-data-table>

    <KillCommandDialog :opendialog="progress" :hostname="select.hostName" :servername="select.serverName"
      @onkillcommand="onKillCommand" />
    <ErrorSnackBar :text="errorMessage" :show="errorMessage !== ''" />
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, PropSync, Vue } from 'nuxt-property-decorator'

import ErrorSnackBar from '@/components/ErrorSnackBar.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import { ProcessTableItem } from '@/dto/process'

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
    LoadingDialog
  }
})
export default class ProcessTable extends Vue {
  headers: TableHeader[] = [
    { text: 'HostName', value: 'hostName' },
    { text: 'Server', value: 'serverName' },
    { text: 'Process', value: 'processName' },
    { text: 'Processing Time (sec)', value: 'processingTime' },
    { text: 'ThreadId', value: 'threadId' },
    { text: 'Last Receive', value: 'receiveTime' },
    { text: 'Alive', value: 'alive' },
    { text: 'Close Command', value: 'command' },
  ]

  @PropSync('processProp', { type: Array as PropType<Array<ProcessTableItem>> })
  processes?: ProcessTableItem[]

  select: SelectProcessTableItem = { hostName: '', serverName: '' }
  progress: boolean = false
  errorMessage: string = ''

  onClickClose(item: ProcessTableItem) {
    this.select.hostName = item.hostName
    this.select.serverName = item.serverName
    this.progress = true
  }

  onKillCommand(command: string) {
    try {
      // request kill command
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
