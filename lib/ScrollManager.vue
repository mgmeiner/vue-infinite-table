<template />

<script>
  import _debounce from 'lodash/debounce';

  export default {
    name: 'vueInfiniteTableScrollManager',
    props: {
      scrollContainer: {
        type: String,
        required: true
      },
      pageEndMode: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        scrollContainerEl: null,
        scrollPosition: 0
      }
    },
    mounted () {
      this.scrollContainerEl = document.querySelector(this.scrollContainer);

      this.scrollContainerEl.addEventListener('scroll', this.onScroll);
    },
    methods: {
      isPageEnd () {
        const scrollContainerInnerHeight = this.scrollContainerEl.scrollHeight;
        const scrollContainerHeight = this.scrollContainerEl.offsetHeight;

        let scrollPositionAddition = 0;
        if (this.pageEndMode === 'late') {
          scrollPositionAddition = 10;
        } else if (this.pageEndMode === 'early') {
          scrollPositionAddition = scrollContainerHeight / 2;
        }

        return (this.scrollPosition + scrollContainerHeight + scrollPositionAddition) >= scrollContainerInnerHeight;
      },
      onScroll: _debounce(function(e) {
        const scrollPosition = this.scrollContainerEl.scrollTop;
        const oldScrollPosition = this.scrollPosition;
        this.scrollPosition = scrollPosition;

        // only if user is scrolling downwards
        if (scrollPosition > oldScrollPosition) {
          if (this.isPageEnd()) {
            this.$emit('pageEnd');
          }
        }
      }, 50)
    },
    destroyed () {
      this.scrollContainerEl.removeEventListener('scroll', this.onScroll);
    }
  }

</script>
