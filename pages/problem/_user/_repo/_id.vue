<template>
  <div class="container">
    <template v-if="!error">
      <h1>{{ id }} - {{ def.name }}</h1>
      <LoginPrompt />
      <Card name="ACTIONS">
        <nuxt-link :to="`/submit/${user}/${repo}/heads/${id}`">
          <zi-button size="small">
            Submit
          </zi-button>
        </nuxt-link>
      </Card>
      <Card name="META">
        <p>
          <b>Repository:</b> {{ user }}/{{ repo }}: {{ id }}
        </p>
        <p v-if="def.source">
          <b>Problem Source:</b> {{ def.source }}
        </p>
        <p v-if="def.time_limit">
          <b>Time Limit:</b> {{ def.time_limit }} ms
        </p>
        <p v-if="def.space_limit">
          <b>Space Limit:</b> {{ def.space_limit }} MB
        </p>
      </Card>
      <Card name="PROBLEM">
        <vue-markdown
          class="markdown"
          :source="description"
        />
      </Card>
    </template>
    <template v-else>
      <Loader>{{ error }}</Loader>
    </template>
  </div>
</template>

<script>
import YAML from 'yaml'
import VueMarkdown from 'vue-markdown'
import Card from '~/components/Card'
import Loader from '~/components/Loader'

export default {
  auth: false,
  components: { Card, VueMarkdown, Loader },
  data () {
    return {
      id: this.$route.params.id,
      user: this.$route.params.user,
      repo: this.$route.params.repo,
      def: null,
      description: '',
      error: 'Loading...'
    }
  },
  async mounted () {
    try {
      const d = await this.$api.getFile(`${this.user}/${this.repo}`, 'problem.yml', this.id)
      if (!d) { throw new Error('Problem not found') }
      this.description = (await this.$api.getFile(`${this.user}/${this.repo}`, 'README.md', this.id)).text
      this.def = YAML.parse(d.text)
      this.error = false
    } catch (e) {
      this.error = e
    }
  }
}
</script>
