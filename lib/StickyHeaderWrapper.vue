<template>
  <table v-show="show" class="vueInfiniteTable-stickyHeader" :style="{ top: positionTop + 'px'}">
    <slot />
  </table>
</template>

<script>
  export default {
    name: 'vueInfiniteTable-stickyHeaderWrapper',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      scrollContainer: {
        type: String,
        required: true
      }
    },
    mounted () {
      const scrollContainerEl = document.querySelector(this.scrollContainer);
      this.positionTop = scrollContainerEl.offsetTop;
    },
    data () {
      return {
        positionTop: 0
      }
    }
  }
</script>

<style lang="less">

</style>