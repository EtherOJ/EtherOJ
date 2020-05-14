<template>
  <div class="bg-gray-100 rounded-sm p-3 my-3">
    <div class="-m-3 px-3 py-2 bg-gray-200 rounded-t-sm text-sm">
      <b>{{ name }}</b>
    </div>
    <div class="pt-6">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: { name: { type: String, default: 'Tip' } }
}
</script>
