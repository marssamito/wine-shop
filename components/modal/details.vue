<template>
  <div id="details">
    <!-- image -->
    <div class="image mb-2 mr-4">
      <img :src="$config.imgBaseUrl + details[0].image" alt="" srcset="" />
    </div>
    <!-- content -->
    <div class="content">
      <h1 class="mb-0">{{ details[0].no }}</h1>
      <h2>{{ details[0].name }}</h2>
      <div class="d-flex">
        <div class="bottle mr-4">
          <b>Bottle</b> <br />Kshs {{ details[0].cost.bottle }}<br />
        </div>
        <div class="case">
          <b>Case</b> <br />Kshs {{ details[0].cost.case }}<br />
        </div>
      </div>
      <p class="mt-4">{{ details[0].details }}</p>
    </div>
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
