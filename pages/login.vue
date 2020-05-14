<template>
  <div class="container">
    <h1>Login</h1>
    <br>
    <div
      class="px-5 py-3 bg-gray-800 inline-block text-white cursor-pointer"
      @click="login()"
    >
      Login via GitHub
    </div>
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
