class ScrollManager {
  constructor(pageEndOffset, callbacks) {
    this.pageEndOffset = pageEndOffset;
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

    let scrollPositionAddition = this.pageEndOffset || 10;

    return (this.scrollPosition + scrollContainerHeight + scrollPositionAddition) >= scrollContainerInnerHeight;
  }

  scrollToTop() {
    this.scrollContainerEl.scrollTop = 0;
  }

  scrollToEnd() {
    this.scrollContainerEl.scrollTop = this.scrollContainerEl.scrollHeight;
  }

  destroy() {
    this.scrollContainerEl.removeEventListener('scroll', this.onScroll);
  }
}

export default ScrollManager;