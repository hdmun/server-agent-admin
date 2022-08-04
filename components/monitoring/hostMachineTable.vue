<template>
  <v-card>
    <v-card-title>
      호스트 머신
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table v-model="selected" :headers="headers" :items="hostServers" item-key="hostName" show-select>
      <template #[`item.monitoring`]="{ item }">
        <v-chip :color="item.monitoring ? 'green' : 'gray'" :disabled="item.alive ?? false" @click="showDialog(item)">
          {{ item.monitoring ? 'ON' : 'OFF' }}
        </v-chip>
      </template>

      <template #[`item.alive`]="{ item }">
        <v-chip :color="item.alive ? 'green' : 'red'">
          {{ item.aliveAckText ?? 'off-line' }}
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog v-model="isAsk" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Monitoring
        </v-card-title>

        <v-card-text>
          {{ requestHost?.hostName }}의 Monitoring 상태를 `{{ requestHost?.monitoring ? 'ON' : 'OFF' }}`으로 변경합니다.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="() => this.requestHost = null">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="onClickDialogOK()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ErrorSnackBar :text="errorMessage" :show="errorMessage !== ''" />
    <LoadingDialog :message="'waiting...'" :open="progress" />
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Component, PropSync, Vue } from 'nuxt-property-decorator'

import ErrorSnackBar from '@/components/ErrorSnackBar.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import { HostMachineTableItem, MonitoringRequest } from '@/dto/hostMachine'

interface TableHeader {
  text: string
  value: string
}

@Component({
  components: {
    ErrorSnackBar,
    LoadingDialog
  }
})
export default class HostMachineTable extends Vue {
  headers: TableHeader[] = [
    { text: 'HostName', value: 'hostName' },
    { text: 'Address', value: 'ipAddr' },
    { text: 'Monitoring', value: 'monitoring' },
    { text: 'AliveAck', value: 'alive' },
  ]

  @PropSync('hostMachineProp', { type: Array as PropType<Array<HostMachineTableItem>> })
  hostServers?: HostMachineTableItem[]

  selected: HostMachineTableItem[] = []

  requestHost: MonitoringRequest | null = null
  progress: boolean = false
  errorMessage: string = ''

  mounted() { }
  beforeDestroy() { }

  get isAsk() {
    return this.requestHost !== null
  }

  showDialog(item: HostMachineTableItem) {
    this.requestHost = {
      hostName: item.hostName,
      monitoring: !item.monitoring
    }
  }

  onClickDialogOK() {
    const requestHost = this.requestHost
    if (requestHost === null) {
      // 선택된 호스트 머신이 없습니다
      return
    }

    // request

    this.requestHost = null  // close dialog
  }
}
</script>