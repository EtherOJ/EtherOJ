import Base64 from '~/assets/base64'

const INDEX_PATH = '/repos/EtherOJ/problems/contents/index.json?ref=index'

export default {
  state: () => ({
    problems: [],
    problemObject: {},
    sha: null
  }),
  mutations: {
    update (state, { problems, sha }) {
      state.problems = problems
      state.sha = sha
      const obj = {}
      problems.forEach((o) => { obj[o.id] = o })
      state.problemObject = obj
    }
  },
  actions: {
    async fetch (ctx) {
      const fileInfo = await this.$axios.$get(INDEX_PATH)
      if (fileInfo.sha === ctx.state.problems.sha) {
        return
      }
      ctx.commit('update', {
        sha: fileInfo.sha,
        problems: JSON.parse(Base64.decode(fileInfo.content))
      })
    }
  }
}
