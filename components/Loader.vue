<template>
  <zi-card>
    <span><slot /></span>
    <zi-spinner v-if="spin" />
  </zi-card>
</template>

<script>
export default {
  props: { spin: { type: Boolean, default: true } }
}
</script>
