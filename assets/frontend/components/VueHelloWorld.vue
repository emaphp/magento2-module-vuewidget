<template>
  <div class="widget block block-static-block">
    <h1 class="main-text">
      <span class="main-text__content">Hello {{name}}!</span>
    </h1>
  </div>
</template>

<script>
export default {
  props: [ 'name' ],

  data() {
    return {
    };
  }
};
</script>

<style>
  .main-text {
    text-align: center;
  }

  .main-text__content {
    font-weight: 700;
  }
</style>
