<template>
  <v-row>
    <v-col lg="6">
      <HostMachineTable :hostMachineProp.sync="hostServers" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'

import HostMachineTable from '@/components/monitoring/hostMachineTable.vue'
import { HostMachineResponse, HostMachineTableItem } from '@/dto/hostMachine'

@Component({
  components: {
    HostMachineTable
  },
  async asyncData(ctx: Context) {
    try {
      const response = await ctx.$axios.get<HostMachineResponse[]>(`/api/host`)

      const hostServers = response.data.map<HostMachineTableItem>((value) => {
        return value
      })

      return { hostServers }
    } catch (error) {
      return { hostServers: [] }
    }
  }
})
export default class HostMachinePage extends Vue {
  hostServers: HostMachineTableItem[] = []
  refreshTimer?: number

  mounted() {
    this.refreshTimer = window.setInterval(() => {
      this.requestHosts()
    }, 5000)
  }

  beforeDestroy() {
    if (this.refreshTimer !== undefined) {
      window.clearInterval(this.refreshTimer)
    }
  }

  async requestHosts() {
    const response = await this.$axios.get<HostMachineResponse[]>(`/api/host`)
    this.hostServers = response.data.map<HostMachineTableItem>((value) => {
      return value
    })
  }
}
</script>
