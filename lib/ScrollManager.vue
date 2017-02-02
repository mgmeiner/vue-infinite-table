<template />

<script>
  import _debounce from 'lodash/debounce';

  export default {
    name: 'scrollManager',
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

        let pageEnd = (scrollContainerInnerHeight - scrollContainerHeight);

        if (this.pageEndMode === 'late') {
          pageEnd -= pageEnd / 5;
        } else if (this.pageEndMode === 'early') {
          pageEnd -= pageEnd / 2;
        }

        return this.scrollPosition >= pageEnd;
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
      }, 100)
    },
    destroyed () {
      this.scrollContainerEl.removeEventListener('scroll', this.onScroll);
    }
  }

</script>