<template>
  <div class="container">
    <h1>Submit Code</h1>
    <p><b>Problem:</b> {{ id }} - {{ getProblemName(id) }}</p>
    <br>
    <client-only>
      <prism-editor
        language="clike"
        :line-numbers="true"
        :code="code"
      />
      <v-dialog />
    </client-only>
    <div
      :class="['submitButton', isSubmitting? 'submitting' : '']"
      @click="onSubmitClick"
    >
      {{ submitStatus }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.submitButton {
  @apply my-5 px-5 py-3 bg-gray-800 inline-block text-white cursor-pointer;
}

.submitting {
  @apply bg-gray-400 cursor-not-allowed !important;
}
</style>

<script>

const placeholderCode =
`int main() {
  return 0;  
}

`

export default {
  data () {
    return {
      id: this.$route.params.id,
      code: placeholderCode,
      isSubmitting: false,
      userCancel: false
    }
  },
  computed: {
    submitStatus () {
      if (this.isSubmitting) {
        return this.userCancel ? 'Cancelled' : 'Submitting'
      }
      return 'Submit'
    }
  },
  methods: {
    async tryGetRepo () {
      const k = await this.$api.getUserRepo(this.$auth.user.login, 'submissions')
      if (k) {
        // do necessery checks to ensure it is not a same-name repo
        if (k.fork && k.parent.full_name === this.$api.submissionsSrcRepo) {
          return k
        } else {
          this.$modal.show('dialog', {
            title: 'Repository Conflict',
            text: "It seems that there's a same-name repo in your account. " +
              'Please consider rename or delete that repo to continue.'
          })
          this.userCancel = true
          return null
        }
      }
      const userChoice = await new Promise(resolve =>
        this.$modal.show('dialog', {
          title: 'Fork Repository',
          text: 'To continue, we need to fork a repository in your GitHub Account first.',
          buttons: [
            {
              title: 'Accept',
              handler: () => resolve('accept')
            },
            {
              title: 'Cancel',
              handler: () => resolve('cancel'),
              default: true
            }
          ]
        })
      )
      this.$modal.hide('dialog')
      if (userChoice === 'accept') {
        return await this.$api.forkRepo(this.$api.submissionsSrcRepo)
      } else {
        this.userCancel = true
        return null
      }
    },
    async submitCode () {
      const workRepo = await this.tryGetRepo()
      if (!workRepo) { return false }
      const tempBranch = await this.$api.createTempBranch(this.$auth.user.login)
      /* const fileInfo = */ await this.$api.createFile(
        this.$auth.user.login,
        'submissions',
        tempBranch,
        'solution.cpp',
        this.code)
      const pullInfo = await this.$api.createPullToSrc(
       `${this.$auth.user.login}:${tempBranch}`,
       `${this.id}`,
       `Submit ${this.id}`
      )
      // Have no clue why this is not working
      // const deleteRef = await this.$api.deleteRef(
      // this.$auth.user.login, tempBranch
      // )
      this.$router.push(`/submission/${pullInfo.number}`)
      return true
    },
    async onSubmitClick () {
      if (!this.isSubmitting) {
        this.isSubmitting = true
        try {
          if (await this.submitCode()) {
            // Shall never set submitting to false
            // But redirect user to submission page
            return
          }
        } catch (e) {
          this.$modal.show('dialog', {
            title: 'Failed to submit',
            message: e.toString()
          })
          throw e
        }
      }
    },
    getProblemName (ref) {
      const o = this.$store.state.problems.problemObject[ref]
      return o ? o.name : 'Unknown Problem'
    }
  }
}
</script>
