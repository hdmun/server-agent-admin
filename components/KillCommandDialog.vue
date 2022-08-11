<template>
  <v-container>
    <v-dialog v-model="show" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> 서버 프로세스 종료 </v-card-title>
        <v-card-text>
          {{ hostName }}
        </v-card-text>
        <v-card-text>
          {{ serverName }} 서버 프로세스 종료 명령을 전송합니다.
        </v-card-text>
        <v-card-text>
          <v-radio-group v-model="selectCommand">
            <v-radio v-for="command in killCommands" :key="command.value" :label="command.text"
              :value="command.value" />
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="show = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="onClickOK()"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "nuxt-property-decorator"

interface KillCommandItem {
  text: string
  value: string
}

@Component
export default class ProcessTable extends Vue {
  @Prop({ type: String, required: true })
  readonly hostName!: string

  @Prop({ type: String, required: true })
  readonly serverName!: string

  @PropSync('open', { type: Boolean })
  show!: boolean

  @PropSync('errorMessage', { type: String })
  errorMsg!: string

  killCommands: KillCommandItem[] = [
    { text: '종료', value: 'close' },
    { text: '강제 종료', value: 'kill' },
    { text: '전체 종료', value: 'closeAll' },
    { text: '전체 강제종료', value: 'killAll' },
  ]

  selectCommand: string = 'close'

  mounted() { }

  onClickOK() {
    if (this.selectCommand === '') {
      this.errorMsg = '선택된 커맨드가 없습니다.'
      this.show = false
      return
    }

    if (this.serverName === '') {
      this.errorMsg = '선택된 서버가 없습니다.'
      this.show = false
      return
    }

    this.$emit('onKillCommand', this.selectCommand)
    this.show = false
  }
}
</script>