class ScrollManager {
  constructor(pageEndMode, callbacks) {
    this.pageEndMode = pageEndMode;
    this.callbacks = callbacks;

    this.scrollContainerEl = null;
    this.scrollPosition = null;
  }

  init(scrollContainerEl) {
    this.scrollContainerEl = scrollContainerEl;
    this.scrollContainerEl.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    const scrollPosition = this.scrollContainerEl.scrollTop;
    const theadHeight = this.scrollContainerEl.querySelector('thead').offsetHeight;
    const oldScrollPosition = this.scrollPosition;
    this.scrollPosition = scrollPosition;

    // only if user is scrolling downwards
    if (scrollPosition > oldScrollPosition && this.isScrollContainerEnd()) {
      this.callbacks.reachedEnd();
    }

    if (this.scrollPosition > 0) {
      this.callbacks.inside();
    } else {
      this.callbacks.reachedStart();
    }
  }

  isScrollContainerEnd() {
    const scrollContainerInnerHeight = this.scrollContainerEl.scrollHeight;
    const scrollContainerHeight = this.scrollContainerEl.offsetHeight;

    let scrollPositionAddition = 0;
    if (this.pageEndMode === 'late') {
      scrollPositionAddition = 10;
    } else if (this.pageEndMode === 'early') {
      scrollPositionAddition = scrollContainerHeight / 2;
    }

    return (this.scrollPosition + scrollContainerHeight + scrollPositionAddition) >= scrollContainerInnerHeight;
  }

  destroy() {
    this.scrollContainerEl.removeEventListener('scroll', this.onScroll);
  }
}

export default ScrollManager;