<template>
  <div class="container">
    <h1>Problems</h1>
    <p>Index File SHA1: {{ sha }}</p>
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
export default {
  data () {
    return {
      problems: [],
      sha: 'Fetching data...'
    }
  },
  async mounted () {
    await this.$store.dispatch('problems/fetch')
    this.problems = this.$store.state.problems.problems
    this.sha = this.$store.state.problems.sha
  }
}
</script>
