<template>
  <div class="container">
    <div>
      <h1 class="text-6xl">
        Welcome to EtherOJ
      </h1>
      <h2 class="text-3xl">
        A GitHub-Based concept OJ
      </h2>
      <br>
      <p>
        We are still under development now, this project
        will render unstable for a long time.
      </p>
      <p>
        If you are interested in this project, please join in the development
        and make it better together!
      </p>
      <p>
        <zi-link href="https://github.com/EtherOJ" target="_blank" color>
          GitHub Project Page
        </zi-link>
      </p>
      <br>
      <template v-if="this.$auth.loggedIn">
        <p>
          Welcome,
          <a :href="this.$auth.user.html_url">
            {{ this.$auth.user.name }}
          </a>
        </p>
        <p>
          <a @click="logout()">Log out</a> or
          <zi-link
            color
            href="https://github.com/settings/connections/applications"
          >
            Manage your authorization
          </zi-link>
        </p>
      </template>
      <p v-else>
        To start, please
        <nuxt-link to="/login">
          login with your GitHub Account
        </nuxt-link>
        to continue.
      </p>
    </div>
  </div>
</template>

<script>

export default {
  auth: false,
  components: {
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$axios.setToken(null)
    }
  }
}
</script>

<style lang="postcss">

</style>
