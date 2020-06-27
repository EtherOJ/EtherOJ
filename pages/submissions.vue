<template>
  <div class="container">
    <h1>Submissions</h1>
    <br>
    <table class="bg-gray-100 rounded-lg w-full">
      <tr class="bg-gray-200">
        <th>
          id
        </th>
        <th class="w-1/12">
          status
        </th>
        <th>name</th>
        <th>submitter</th>
      </tr>
      <tr v-for="d in prList" :key="d.number">
        <td>{{ d.number }}</td>
        <td>{{ d.state === 'open'? 'Judging' : "Judged" }}</td>
        <td>
          <nuxt-link :to="`/submission/${d.number}`">
            <b>{{ d.base.ref }}</b> {{ getProblemName(d.base.ref) }}
          </nuxt-link>
        </td>
        <td>
          <a :href="d.user.html_url">
            {{ d.user.login }}
          </a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
// import Base64 from '~/assets/base64'

const PR = '/repos/EtherOJ/submissions/pulls?state=all'

export default {
  data () {
    return {
      prList: []
    }
  },
  async mounted () {
    this.prList = await this.$axios.$get(PR)
    this.$store.dispatch('problems/fetch')
  },
  methods: {
    getProblemName (ref) {
      const o = this.$store.state.problems.problemObject[ref]
      return o ? o.name : 'Unknown Problem'
    }
  }
}

</script>
