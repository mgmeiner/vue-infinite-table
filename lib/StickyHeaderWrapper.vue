<template>
  <table v-show="show" class="vueInfiniteTable-stickyHeader" :style="{ top: positionTop + 'px', width: width + 'px'}">
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
    data () {
      return {
        positionTop: 0,
        width: 0
      }
    },
    mounted () {
    },
    methods: {
     justify () {
      const scrollContainerEl = document.querySelector(this.scrollContainer);  
      const scrollContainerElRect = scrollContainerEl.getBoundingClientRect();
      const theadEl = scrollContainerEl.querySelector('table:not(.vueInfiniteTable-stickyHeader) thead');
      const stickyHeaderItemsEl = scrollContainerEl.querySelectorAll('table.vueInfiniteTable-stickyHeader thead th');

      this.width = theadEl.clientWidth; 
      this.positionTop = scrollContainerElRect.top;

      theadEl.querySelectorAll('th').forEach((th, i) => {
        stickyHeaderItemsEl[i].style.width = th.clientWidth + 'px';
      });
     }
    },
    watch: {
      show () {
        this.justify();
      }
    } 
  }
</script>

<style lang="less">
  .vueInfiniteTable-stickyHeader {
    position: fixed;
  }
</style>