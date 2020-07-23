<template>
  <div class="container">
    <h1>Tools</h1>
    <LoginPrompt />
    <zi-note>
      This page contains useful tools and data you may find useful while
      solving problems with EtherOJ.
    </zi-note>
    <zi-spacer />
    <zi-collapse v-model="collapse">
      <zi-collapse-item title="GitHub API Quota Used">
        <template v-if="quota">
          <zi-progress :value="quota.remaining" :max="quota.limit" />
          <span>{{ quota.remaining }} / {{ quota.limit }}</span>
          <p><b>Reset Time:</b> {{ quota.reset }}</p>
        </template>
        <zi-button v-else @click="queryQuota">
          Query
        </zi-button>
      </zi-collapse-item>
    </zi-collapse>
  </div>
</template>

<script>
export default {
  auth: false,
  data: () => ({
    collapse: [],
    quota: undefined
  }),
  methods: {
    async queryQuota () {
      const g = await this.$axios.get('/')
      this.quota = {
        limit: g.headers['x-ratelimit-limit'],
        remaining: g.headers['x-ratelimit-remaining'],
        reset: new Date(~~g.headers['x-ratelimit-reset'] * 1000)
      }
    }
  }
}
</script>
