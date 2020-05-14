<template>
  <div class="container">
    <h1>Problems</h1>
    <p>Index File SHA1: {{ indexResponse.sha }}</p>
    <br>
    <table class="bg-gray-100 rounded-lg w-full">
      <tr class="bg-gray-200">
        <th class="w-1/5">
          id
        </th>
        <th>name</th>
      </tr>
      <tr v-for="d in problems" :key="d.name">
        <td>{{ d.id }}</td>
        <td>
          <nuxt-link :to="`/problem/${d.id}`">
            {{ d.name }}
          </nuxt-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Base64 from '~/assets/base64'

const INDEX_PATH = '/repos/pcovellite/problem/contents/index.json?ref=index'

export default {
  data () {
    return {
      problems: [],
      indexResponse: {
        sha: 'Fetching data...'
      }
    }
  },
  async mounted () {
    const fileInfo = await this.$axios.$get(INDEX_PATH)
    this.indexResponse = fileInfo
    this.problems = JSON.parse(Base64.decode(fileInfo.content))
  }
}
</script>
