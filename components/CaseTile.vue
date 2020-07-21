<template>
  <zi-card :class="colorClass">
    <zi-description :title="`#${caseData.id}`">
      <h4>{{ ResultEnum[caseData.result] }}</h4>
      <template v-if="caseData.detail">
        <p v-if="caseData.error_message">
          <b>Message:</b> {{ caseData.error_message }}
        </p>
        <p><b>Real Time Used:</b> {{ caseData.detail.real_time }} ms</p>
        <p>
          <b>Space Used:</b>
          {{ (caseData.detail.memory / 1048576).toFixed(3) }} MB
        </p>
        <hr class="my-2">
        <p>
          <zi-tooltip class="inline-block">
            <a>Testcase</a>
            <template v-slot:content>
              Input: {{ caseData.case.inFile }}
              <br>
              Answer: {{ caseData.case.ansFile }}
            </template>
          </zi-tooltip>
          <zi-tooltip class="inline-block">
            <a>Raw</a>
            <template v-slot:content>
              {{ JSON.stringify(caseData) }}
            </template>
          </zi-tooltip>
        </p>
      </template>
    </zi-description>
  </zi-card>
</template>

<style lang="postcss">
.tile-ac {
  @apply bg-green-100;
}

.tile-wa {
  @apply bg-red-100;
}

.tile-lim {
  @apply bg-orange-100;
}

</style>

<script>

const ResultEnum = {
  '-1': 'Wrong Answer',
  0: 'Accepted',
  1: 'CPU Time Limit Exceeded',
  2: 'Time Limit Exceeded',
  3: 'Memory Limit Exceeded',
  4: 'Runtime Error',
  5: 'System Error',
  '#': 'Judger is still judging...'
}

export default {
  props: {
    caseData: {
      type: Object,
      default: () => ({
        id: '###',
        case: { ansFile: '###', inFile: '###' },
        result: 255,
        error: '###'
      })
    }
  },
  data: () => ({
    ResultEnum
  }),
  computed: {
    colorClass () {
      switch (this.caseData.result) {
        case 0: return 'tile-ac'
        case -1: return 'tile-wa'
        case 2:
        case 3:
          return 'tile-lim'
        default: return ''
      }
    }
  }
}
</script>
