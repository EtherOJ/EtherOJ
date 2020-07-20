<template>
  <zi-card class="card-outer">
    <zi-description :title="name" />
    <div class="card-inner">
      <slot />
    </div>
  </zi-card>
</template>

<style lang="postcss">

.card-outer {
  @apply my-2 !important;
}

.card-inner p {
  @apply leading-normal m-0;
}
</style>

<script>
export default {
  props: { name: { type: String, default: 'Tip' } }
}
</script>
