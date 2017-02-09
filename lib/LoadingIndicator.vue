<template>
  <div class="vueInfiniteTableLoadingIndicator">
    <div></div>
  </div>
</template>

<script>
  export default {
    name: 'vueInfiniteTableLoadingIndicator',
    props: {
      full: {
        type: Boolean
      }
    }
  }
</script>

<style lang="less">
  .vueInfiniteTableLoadingIndicator {
    position: absolute;
    z-index: 100;
    user-select: none;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;

    background-color: rgba(0,0,0,0.7);

    div {
      background-image: url('./assets/loading.svg');
      background-repeat: no-repeat;

      svg {
        width: 50px;
        height: 50px;
      }
    }
  }
</style>
