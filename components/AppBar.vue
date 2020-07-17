<template>
  <div class="appbar">
    <zi-row>
      <zi-col class="flex items-center" span="4">
        <a class="logo font-medium text-xl text-black">EtherOJ</a>
      </zi-col>
      <zi-col class="links flex items-center">
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
      </zi-col>
      <zi-col span="4">
        <zi-user name="Devil Placeholder" />
      </zi-col>
    </zi-row>
  </div>
</template>

<style lang="postcss" scoped>
    .appbar {
      @apply bg-white fixed w-full py-3 px-8 border-b-2 text-lg;
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
