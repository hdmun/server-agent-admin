<template>
  <v-card>
    <v-card-title>
      호스트 머신
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table v-model="selected" :headers="headers" :items="hostServers" item-key="hostName" show-select>
      <template #[`item.alive`]="{ item }">
        <v-chip :color="item.alive ? 'green' : 'red'">
          {{ item.alive ? 'ON' : 'OFF' }}
        </v-chip>
      </template>

      <template #[`item.monitoring`]="{ item }">
        <v-chip :color="item.monitoring ? 'green' : 'gray'" :disabled="item.alive === false" @click="showDialog(item)">
          {{ item.monitoring ? 'ON' : 'OFF' }}
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog v-model="isAsk" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Monitoring
        </v-card-title>

        <v-card-text v-if="dialogHost !== null">
          {{ dialogHost.hostName }}의 Monitoring 상태를 `{{ dialogHost.monitoring ? 'ON' : 'OFF' }}`으로 변경합니다.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="() => this.dialogHost = null">
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
import { HostMachineTableItem } from '@/dto/hostMachine'

interface TableHeader {
  text: string
  value: string
}

interface SetMonitoring {
  hostName: string
  on: boolean
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
    { text: 'AliveAck', value: 'alive' },
    { text: 'Monitoring', value: 'monitoring' },
  ]

  @PropSync('hostMachineProp', { type: Array as PropType<Array<HostMachineTableItem>> })
  hostServers?: HostMachineTableItem[]

  selected: HostMachineTableItem[] = []

  dialogHost: SetMonitoring | null = null
  progress: boolean = false
  errorMessage: string = ''

  mounted() { }
  beforeDestroy() { }

  get isAsk() {
    return this.dialogHost !== null
  }

  showDialog(item: HostMachineTableItem) {
    this.dialogHost = {
      hostName: item.hostName,
      on: !item.monitoring
    }
  }

  async onClickDialogOK() {
    const requestHost = this.dialogHost
    if (requestHost === null || this.hostServers === undefined) {
      // 선택된 호스트 머신이 없습니다
      return
    }

    try {
      // axios 요청 레이어를 하나 둬야겠지?
      const res = await this.$axios.patch<SetMonitoring>(`/api/host/monitoring/${requestHost.hostName}`, { on: requestHost.on })
      for (const host of this.hostServers) {
        if (host.hostName === res.data.hostName) {
          host.monitoring = res.data.on
        }
      }
    }
    catch (error) {
      this.errorMessage = String(error)
    }

    this.dialogHost = null  // close dialog
  }
}
</script>