<template>
  <div class="container">
    <h1>Problems</h1>
    <span>Problem Source: </span>
    <zi-select size="small" value="EtherOJ Central">
      <zi-option value="EtherOJ Central" />
    </zi-select>
    <p>Index File SHA1: {{ sha }}</p>
    <br>
    <table class="w-full">
      <tr>
        <th class="w-1/6">
          id
        </th>
        <th>name</th>
      </tr>
      <tr v-for="d in problems" :key="d.name">
        <td>{{ d.id }}</td>
        <td>
          <nuxt-link :to="`/problem/EtherOJ/problems/${d.id}`">
            {{ d.name }}
          </nuxt-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  auth: false,
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
