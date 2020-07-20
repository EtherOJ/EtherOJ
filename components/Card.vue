<template>
  <div class="bg-gray-100 rounded-sm p-3 my-3">
    <div class="-m-3 px-3 py-2 bg-gray-200 rounded-t-sm text-sm">
      <b>{{ name }}</b>
    </div>
    <div class="pt-6 card-inner">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
.card-inner p {
  @apply leading-normal m-0;
}
</style>

<script>
export default {
  props: { name: { type: String, default: 'Tip' } }
}
</script>
