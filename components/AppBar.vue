<template>
  <div class="appbar">
    <a class="logo font-medium text-xl text-black">CovOJ</a>
    <div class="links inline mx-8">
      <nuxt-link to="/">
        Home
      </nuxt-link>
      <nuxt-link to="/problems">
        Problems
      </nuxt-link>
      <nuxt-link to="/submissions">
        Submissions
      </nuxt-link>
      <nuxt-link to="/help">
        Help
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
    .appbar {
        @apply bg-white fixed w-full py-4 px-8 border-b-2 text-lg;
        z-index: 100;
    }

    .links a {
      @apply mx-3;
    }
</style>

<script>
export default {

}
</script>
