<template>
  <div>
    <AppBar />
    <div class="page-box">
      <nuxt />
    </div>
  </div>
</template>

<script>
import AppBar from '~/components/AppBar'

export default {
  components: {
    AppBar
  },
  mounted () {
    this.$axios.setToken(this.$auth.getToken('github'))
  }
}
</script>

<style lang="postcss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.page-box {
  @apply my-0 py-20;
}

.container {
  @apply mx-auto min-h-screen;
}

h1 {
  @apply text-5xl;
}

a {
  @apply text-blue-600;
}
</style>
