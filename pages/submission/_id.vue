<template>
  <div class="container">
    <template v-if="!error">
      <h1>Submission #{{ resp.number }}</h1>
      <Card name="INFO">
        <p>
          <b>Submitter:</b>
          <a :href="resp.user.html_url" target="_blank">
            {{ resp.user.login }}
          </a>
        </p>
        <p>
          <b>Pull Request:</b>
          <a :href="resp.html_url" target="_blank">
            submissions#{{ resp.number }}
          </a>
        </p>
        <p>
          <b>Created:</b>
          {{ new Date(resp.created_at).toLocaleDateString() }}
          {{ new Date(resp.created_at).toLocaleTimeString() }}
        </p>
        <p>
          <b>Head SHA:</b> {{ headSHA }}
        </p>
        <p>
          <b>Status:</b>
          <span :class="badgeClass">
            {{ judger.conclusion === 'success'? 'Accepted' : 'Unaccepted' }}
          </span>
        </p>
      </Card>
      <Card name="RESULT">
        <details v-for="e in parseAnnotations()" :key="e.key">
          <summary>{{ e.summary }}</summary>
          {{ e }}
        </details>
      </Card>
    </template>
    <p v-else>
      Loading...
    </p>
  </div>
</template>

<style lang="postcss" scoped>
.result-box {
  @apply bg-gray-400 w-32 h-32;
}

.fail {
  @apply text-red-600;
}

.success {
  @apply text-green-600;
}

</style>

<script>
import Card from '~/components/Card'

const PR = '/repos/pcovellite/submissions/pulls/'
const CHECK_SUITE = '/repos/pcovellite/submissions/commits/{0}/check-runs'
const DETAIL = '/repos/pcovellite/submissions/check-runs/{0}/annotations'

export default {
  components: {
    Card
  },
  data () {
    return {
      id: this.$route.params.id,
      headSHA: null,
      resp: null,
      judger: null,
      annotations: [],
      error: 'Loading...',
      ax: this.$axios.create({
        headers: {
          Accept: 'application/vnd.github.antiope-preview+json'
        }
      })
    }
  },
  computed: {
    badgeClass () {
      return this.judger.conclusion === 'success' ? 'success' : 'fail'
    }
  },
  async mounted () {
    // simple util function
    const f = function (t, ...args) {
      return t.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined'
          ? args[number]
          : match
      })
    }

    this.resp = await (this.$axios.$get(PR + this.id))
    this.headSHA = this.resp.head.sha

    const checkRuns = (await (this.ax.get(f(CHECK_SUITE, this.headSHA)))).data.check_runs
    // Assume that one is what we want
    this.judger = checkRuns[0]

    const annot = (await this.ax.get(f(DETAIL, this.judger.id))).data
    this.annotations = annot

    this.error = false
  },
  methods: {
    parseAnnotations () {
      const ret = []
      for (const e of this.annotations) {
        const dats = e.message.split('\n')
        ret.push({
          key: e.blob_href,
          summary: dats[0],
          ...JSON.parse(dats[1])
        })
      }
      return ret
    }
  }
}
</script>
