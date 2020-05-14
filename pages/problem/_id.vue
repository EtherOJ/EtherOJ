<template>
  <div class="container">
    <template v-if="def">
      <h1>{{ id }} - {{ def.name }}</h1>
      <Card name="ACTIONS">
        <nuxt-link to="/submit">
          Submit
        </nuxt-link>
      </Card>
      <Card name="PROBLEM">
        <vue-markdown
          class="markdown"
          :source="description"
        />
      </Card>
    </template>
    <h2 v-else>
      Loading...
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
      description: ''
    }
  },
  async mounted () {
    const defInfo = await this.$axios.$get(DEF_PATH + this.id)
    const decInfo = await this.$axios.$get(DEC_PATH + this.id)

    this.def = YAML.parse(Base64.decode(defInfo.content))
    this.description = Base64.decode(decInfo.content)
  }
}
</script>
