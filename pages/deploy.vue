<template>
  <v-row>
    <v-col lg="9">
      <HistoryList />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import HistoryList from '@/components/historyList.vue'

@Component({
  components: {
    HistoryList
  }
})
export default class DeployPage extends Vue {
  mounted() { }
  beforeDestroy() { }
}
</script>
