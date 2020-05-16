<template>
  <div class="container">
    <template v-if="!error">
      <h1>{{ id }} - {{ def.name }}</h1>
      <Card name="ACTIONS">
        <nuxt-link :to="`/submit/${id}`">
          Submit
        </nuxt-link>
      </Card>
      <Card name="META">
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
    <h2 v-else>
      {{ error }}
    </h2>
  </div>
</template>

<script>
import YAML from 'yaml'
import VueMarkdown from 'vue-markdown'
import Base64 from '~/assets/base64'
import Card from '~/components/Card'

const DEF_PATH = '/repos/pcovellite/problem/contents/problem.yml?ref='
const DEC_PATH = '/repos/pcovellite/problem/contents/README.md?ref='

export default {
  components: { Card, VueMarkdown },
  data () {
    return {
      id: this.$route.params.id,
      def: null,
      description: '',
      error: 'Loading...'
    }
  },
  async mounted () {
    try {
      const defInfo = await this.$axios.$get(DEF_PATH + this.id)
      const decInfo = await this.$axios.$get(DEC_PATH + this.id)
      this.def = YAML.parse(Base64.decode(defInfo.content))
      this.description = Base64.decode(decInfo.content)
      this.error = false
    } catch (e) {
      this.error = e
    }
  }
}
</script>
