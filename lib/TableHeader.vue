<template>
  <thead :style="style">
    <tr>
      <th v-for="column in columns" :class="{sortable: column.sortable}" @click="sortBy(column)">
        <div>
          <slot :name="'th-' + column.name" :column="column">
            {{column.displayName}}
            <span v-if="column.sortable && column.name === sort.column">
              <span v-if="sort.direction === 'ASC'">▲</span><span v-else>▼</span>
            </span>
          </slot>
        </div>
      </th>
    </tr>
  </thead>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'vueInfiniteTable-header',
    props: {
      columns: {
        type: Array,
        required: true
      },
      sort: {
        type: Object,
        required: true
      },
      scrollContainer: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        style: { position: 'static', backgroundColor: '#FFF' },
        sticky: false
      }
    },
    mounted () {
      this.$table = this.$el.parentNode;
      this.createReferenceHeader();
    },
    methods: {
      sortBy (column) {
        this.$emit('sortBy', column);
      },
      createReferenceHeader () {
        this.$referenceHeader = this.$el.cloneNode(true);
        this.$referenceHeader.className += ' vueInfiniteTable-referenceHeader';
        this.$referenceHeader.style.display = 'none';
        this.$table.insertBefore(this.$referenceHeader, this.$el.nextSibling);
      },
      justify () {
        Vue.nextTick(() => {
          const scrollContainerEl = document.querySelector(this.scrollContainer);  
          const scrollContainerElRect = scrollContainerEl.getBoundingClientRect();

          this.style.width = this.$table.clientWidth + 'px';
          this.style.top = scrollContainerElRect.top + 'px';        
        });
      },
      stick () {
        if (!this.sticky) {
          this.sticky = true;
          this.style.position = 'fixed';
          this.$referenceHeader.style.display = null;

          Vue.nextTick(() => { 
            const stickyHeaders = this.$table.querySelectorAll('thead th');
            const referencedHeaders = this.$referenceHeader.querySelectorAll('th');

            referencedHeaders.forEach((th, i) => {
              stickyHeaders[i].style.minWidth = window.getComputedStyle(th).width;
              stickyHeaders[i].style.maxWidth = window.getComputedStyle(th).width;
            });
          });
        }
      },
      release () {
        if (this.sticky) {
          this.sticky = false;
          this.style.position = 'static';
          this.$referenceHeader.style.display = 'none';
        }
      }
    }
  }
</script>