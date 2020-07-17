<template>
  <div class="container">
    <h1>Login</h1>
    <zi-button type="primary" shadow @click="login()">
      Login via GitHub
    </zi-button>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      this.$auth.loginWith('github')
      this.$axios.setToken(this.$auth.getToken('github'))
    }
  }
}
</script>
