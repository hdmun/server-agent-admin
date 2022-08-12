<template>
  <v-card>
    <v-card-title class="pb-0">
      History
    </v-card-title>

    <v-list>
      <v-divider />

      <template v-for="(log, index) in logs">
        <v-list-item>
          <v-list-item-avatar>
            <!--<v-icon> mdi-circle-slice-5 </v-icon>-->
            <!--<v-icon> mdi-information-outline </v-icon>-->
            <!--<v-icon color="orange"> mdi-alert-circle </v-icon>-->
            <v-icon color="red"> mdi-close-circle-outline </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle>
              {{ log.date }} {{ log.time }}
              <v-icon small> mdi-account-circle</v-icon>
              {{ log.user }}
            </v-list-item-subtitle>

            <v-list-item-title v-text="log.message"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-divider v-if="index < logs.length - 1" :key="index"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

interface LogItem {
  date: string
  time: string
  user: string
  message: string
}

@Component({
  components: {}
})
export default class HistoryList extends Vue {
  logs: LogItem[] = [
    { date: '2022-08-11', time: '05:24:66', user: 'user1', message: '테스트 로그 메세지1' },
    { date: '2022-08-11', time: '05:24:66', user: 'user1', message: '테스트 로그 메세지2' },
    { date: '2022-08-11', time: '05:24:66', user: 'user1', message: '테스트 로그 메세지3' },
    { date: '2022-08-11', time: '05:24:66', user: 'user1', message: '테스트 로그 메세지4' }
  ]
}
</script>