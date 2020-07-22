<template>
  <div class="container">
    <template v-if="!error">
      <h1>Submission #{{ resp.number }}</h1>
      <LoginPrompt />
      <!-- <zi-note type="warning">
        This submission is not validated for results to be legal.
      </zi-note> -->
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
          <b>Name:</b> {{ resp.title }}
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
          <zi-dot :type="statusBadge">
            {{ statusText }}
          </zi-dot>
        </p>
      </Card>
      <Card name="RESULT">
        <zi-tabs>
          <zi-tabs-item label="Result" value="parsed">
            <template v-if="info.result !== 'Error'">
              <p v-if="info.accepted">
                Total {{ info.accepted }} of {{ info.total }} cases accepted.
              </p>
              <zi-spacer />
              <zi-grid :container="true" :spacing="3">
                <zi-grid v-for="i in info.cases" :key="i.id" :xs="12">
                  <CaseTile :case-data="i" />
                </zi-grid>
              </zi-grid>
            </template>
            <template v-else>
              <p>A problem occurred while judging this submission.</p>
              <p><b>Error {{ info.error }}</b> {{ info.error_message }} </p>
            </template>
          </zi-tabs-item>
          <zi-tabs-item label="Raw Data" value="raw">
            <client-only>
              <prism-editor
                language="json"
                :line-numbers="true"
                :readonly="true"
                :code="annotMsg"
              />
            </client-only>
          </zi-tabs-item>
        </zi-tabs>
      </Card>
    </template>
    <Loader v-else />
  </div>
</template>

<style lang="postcss" scoped>
</style>

<script>
import Card from '~/components/Card'
import Loader from '~/components/Loader'
import CaseTile from '~/components/CaseTile'

const PR = '/repos/EtherOJ/submissions/pulls/'
const CHECK_SUITE = '/repos/EtherOJ/submissions/commits/{0}/check-runs'
const DETAIL = '/repos/EtherOJ/submissions/check-runs/{0}/annotations'

export default {
  auth: false,
  components: {
    Card, Loader, CaseTile
  },
  data () {
    return {
      id: this.$route.params.id,
      headSHA: null,
      resp: null,
      judger: null,
      annotMsg: '',
      info: null,
      error: 'Loading...',
      ax: this.$axios.create({
        headers: {
          Accept: 'application/vnd.github.antiope-preview+json'
        }
      })
    }
  },
  computed: {
    statusBadge () {
      switch (this.judger.conclusion) {
        case 'success': return 'success'
        case null: return 'warning'
        case 'failure':
        default: return 'danger'
      }
    },
    statusText () {
      switch (this.judger.conclusion) {
        case 'success': return 'Accepted'
        case 'failure': return 'Unaccepted'
        case null: return 'Judging'
        default: return `Error: ${this.judger.conclusion}`
      }
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
    if (annot.length === 0) {
      this.annotMsg = 'No judge infomation available at this time'
      this.info = {
        cases: [{ id: '#', result: '#' }]
      }
    } else {
      this.annotMsg = annot[0].message.split('\n').slice(1).join('\n')
      this.info = JSON.parse(this.annotMsg)
    }
    this.error = false
  }
}
</script>
