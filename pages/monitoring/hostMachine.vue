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
      const response = await ctx.$axios.get<HostMachineResponse[]>(`/api/server`)
      const _ = response.data.map<HostMachineTableItem>((value) => {
        return {
          hostName: value.hostName,
          ipAddr: value.ipAddr
        }
      })
    } catch (error) {
      return { hostServers: [] }
    }
  }
})
export default class HostMachinePage extends Vue {
  hostServers: HostMachineTableItem[] = []

  mounted() { }
  beforeDestroy() { }
}
</script>
