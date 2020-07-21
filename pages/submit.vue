<template>
  <div class="container">
    <h1>Submit Code</h1>
    Submit problem
    <zi-input
      v-model.trim="repo"
      :disabled="!!fixedInput"
      placeholder="Repository"
      prefix-label="github.com/"
    />
    <zi-input v-model.trim="ref" :disabled="!!fixedInput" placeholder="Reference" />
    <zi-button
      v-if="!fixedInput"
      :loading="submitting"
      @click="onChoiceClick"
    >
      Select
    </zi-button>
    <template v-else>
      <zi-spacer />
      <zi-card>
        <b>Name:</b> {{ defEnt.name }};
        <b>Time Limit:</b> {{ defEnt.time_limit }} ms;
        <b>Space Limit:</b> {{ defEnt.space_limit }} MB;
      </zi-card>
      <zi-spacer />
      <client-only>
        <prism-editor
          language="cpp"
          :line-numbers="true"
          :code="code"
          :emit-events="true"
          :readonly="submitting"
          @change="e => code = e"
        />
      </client-only>
      <zi-spacer />
      <zi-button
        :type="noSubmit ? 'abort' : 'success'"
        :loading="submitting && !noSubmit"
        :disabled="repo === undefined || repo === '' || ref === ''"
        @click="onSubmitClick"
      >
        {{ noSubmit ? 'Error' : 'Submit' }}
      </zi-button>
    </template>
    <client-only>
      <v-dialog />
    </client-only>
  </div>
</template>

<script>
import YAML from 'yaml'

const placeholderCode = 'int main() \n{\n\n}\n'

export default {
  data () {
    return {
      repo: this.$route.params.repo,
      ref: this.$route.params.ref,
      code: placeholderCode,
      noSubmit: false,
      submitting: false,
      fixedInput: false,

      refEnt: null,
      defEnt: null
    }
  },
  mounted () {
    if (this.$route.params.repo && this.$route.params.ref) {
      this.onChoiceClick()
    }
  },
  methods: {
    dialog (title, message) {
      this.$modal.show('dialog', {
        title, text: message
      })
    },
    async option (title, text) {
      const userChoice = await new Promise(resolve =>
        this.$modal.show('dialog', {
          title,
          text,
          buttons: [
            {
              title: 'OK',
              handler: () => resolve(true)
            },
            {
              title: 'Cancel',
              handler: () => resolve(false),
              default: true
            }
          ]
        })
      )
      this.$modal.hide('dialog')
      return userChoice
    },
    async validateReference () {
      const ref = await this.$api.getRef(this.repo, this.ref)
      if (!ref) {
        this.dialog('Invalid Problem Reference',
          'The problem reference you requested to submit to does not exist.')
        return false
      }
      this.refEnt = ref

      const file = await this.$api.getFile(this.repo, 'problem.yml', this.ref)
      if (!file) {
        this.dialog('Invalid Problem Reference',
          'This reference seems not like a EtherOJ Problem')
        return false
      }

      try {
        this.defEnt = YAML.parse(file.text)
        if (([this.defEnt.name, this.defEnt.time_limit, this.defEnt.space_limit])
          .filter(e => e === undefined).length !== 0) {
          throw new Error('invalid def')
        }
      } catch (e) {
        this.dialog('Invalid Problem Reference',
          'Cannot read problem definition file')
        return false
      }
      return true
    },
    async getUserRepoFork () {
      const k = await this.$api.getUserRepo(this.$auth.user.login, 'submissions')
      if (k) {
        // do necessery checks to ensure it is not a same-name repo
        if (k.fork && k.parent.full_name === this.$api.submissionsSrcRepo) {
          return k
        } else {
          this.dialog('Repository Conflict',
            "It seems that there's a same-name repo 'submissions' in your account.<br>" +
            'Please consider rename or delete that repo to continue.'
          )
          return undefined
        }
      }

      // no existing repo, ask user to fork
      const choice = await this.option('Fork Repository',
        'To continue, we need to fork a repository in your GitHub Account first.')
      if (!choice) {
        return undefined
      }
      return await this.$api.forkRepo(this.$api.submissionsSrcRepo)
    },
    async submit () {
      const repoWork = await this.getUserRepoFork()
      if (!repoWork) {
        return false
      }
      const branchName = 'submit-' +
        Math.abs(Math.random() * 0x7FFFFFFFF | 0).toString(16).padStart(8, '0')

      await this.$api.pushFilesToRef(
        repoWork.full_name,
        [
          {
            path: 'solution.cpp',
            mode: '100644',
            content: this.code
          },
          {
            path: '.problem',
            mode: '100644',
            content: `https://github.com/${this.repo} ${this.ref}`
          }
        ],
        await this.$api.getBranchHeadSHA(this.$api.submissionsSrcRepo, 'judge'),
        `refs/heads/${branchName}`
      )

      const pull = await this.$api.createPullToSrc(
        `${repoWork.owner.login}:${branchName}`,
        'judge',
        `Submit ${this.repo}:${this.ref} ${this.defEnt.name}`
      )

      await this.$api.closePull(this.$api.submissionsSrcRepo, pull.number)
      await this.$api.deleteRef(repoWork.full_name, branchName)

      this.$router.push(`/submission/${pull.number}`)
      return true
    },
    async onChoiceClick () {
      this.submitting = true
      if (await this.validateReference()) {
        this.fixedInput = true
      }
      this.submitting = false
    },
    async onSubmitClick () {
      if (this.submitting || this.noSubmit) { return }
      this.submitting = true
      try {
        if (!await this.submit()) {
          this.noSubmit = true
        }
      } catch (e) {
        this.dialog('Uncaught exception while submitting', e.toString())
        this.noSubmit = true
      }
    }
  }
}
</script>
