<template />

<script>
  import _debounce from 'lodash/debounce';

  export default {
    name: 'scrollManager',
    props: {
      scrollContainer: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        scrollContainerEl: null
      }
    },
    mounted () {
      this.scrollContainerEl = document.querySelector(this.scrollContainer);

      this.scrollContainerEl.addEventListener('scroll', this.onScroll);
    },
    methods: {
      isPageEnd () {
        const scrollContainerInnerHeight = this.scrollContainerEl.scrollHeight;
        const scrollContainerOffset = this.scrollContainerEl.offsetHeight;
        const scrollPosition = this.scrollContainerEl.scrollTop;

        return scrollPosition >= (scrollContainerInnerHeight - scrollContainerOffset);
      },
      onScroll: _debounce(function(e) {
        if (this.isPageEnd()) {
          this.$emit('pageEnd');
        }
      }, 100)
    },
    destroyed () {
      this.scrollContainerEl.removeEventListener('scroll', this.onScroll);
    }
  }

</script>