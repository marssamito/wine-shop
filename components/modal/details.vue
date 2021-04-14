<template>
  <div>
    <p>{{ details }}</p>
  </div>
</template>
<script>
export default {
  props: {
    details: {
      type: [Array],
      required: true,
    },
  },
}
</script>
