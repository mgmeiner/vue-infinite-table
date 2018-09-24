<template>
  <div class="vueInfiniteTable">
    <table :class="opts.style.tableClass">
      <thead>
        <tr>
          <th v-for="column in columns" :class="{sortable: column.sortable}" @click="sortBy(column)" :key="'infiniteTable-th-' + column.name">
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

      <tbody>
        <tr v-for="(row, i) in data" @click="rowClick(row, i)" :key="'infiniteTable-tr-' + i">
          <td v-for="column in columns" :key="'infiniteTable-td-' + column.name">
            <slot :name="'td-' + column.name" :column="column" :row="row" :value="row[column.name]" :index="i">
               {{row[column.name]}}
            </slot>
          </td>
        </tr>
      </tbody>

      <transition name="loadingIndicator-fade">
        <tfoot v-if="opts.loadingIndicator && loading.partial">
          <tr>
            <td :colspan="columns.length">
              <slot name="loading-partial">
                <loadingIndicator />
              </slot>
            </td>
          </tr>
        </tfoot>
      </transition>

    </table>

    <transition name="loadingIndicator-fade" appear>
      <slot name="loading-full" v-if="opts.loadingIndicator && loading.full" >
        <loadingIndicator full />
      </slot>
    </transition>

  </div>
</template>

<script>
  import Vue from 'vue';
  import ScrollManager from './ScrollManager';
  import LoadingIndicator from './LoadingIndicator';
  import _merge  from 'lodash/merge';

  const defaultOptions = {
    itemsToLoadOnScroll: 20,
    pageEndOffset: 10, // px
    scrollContainer: 'body',
    defaultSortColumn: null,
    defaultSortDirection: 'ASC',
    loadingIndicator: true,
    showHeader: true,
    style: {
      tableClass: null
    }
  }

  export default {
    name: 'vueInfiniteTable',
    props: {
      columns: {
        type: Array,
        required: true
      },
      consumeDataCallback: {
        required: true,
        type: Function
      },
      options: {
        type: Object
      }
    },
    data () {
      return {
        data: [],
        consumeOptions: {},
        opts: null,
        loading: {
          full: false,
          partial: false
        },
        sort: {
          column: null,
          direction: null
        }
      }
    },
    computed: {
      isLoading: function () {
        return this.loading.full || this.loading.partial;
      }
    },
    created () {
      this.opts = _merge({}, defaultOptions, this.options);

      this.scrollManager = new ScrollManager(this.opts.pageEndOffset, {
        reachedEnd: this.consume
      });

      this.sort.direction = this.opts.defaultSortDirection;
      if (this.opts.defaultSortColumn) {
        this.sort.column = this.opts.defaultSortColumn;
      }

      this.initialConsume();
    },
    mounted () {
      const scrollContainerEl = document.querySelector(this.opts.scrollContainer);
      scrollContainerEl.className += ' vueInfiniteTable-container';

      this.scrollManager.init(scrollContainerEl);
    },
    destroyed () {
      this.scrollManager.destroy();
    },
    methods: {
      consume: async function () {
        if (!this.isLoading) {
          this.consumeOptions.page++;
          this.consumeOptions.endIndex += this.opts.itemsToLoadOnScroll;
          this.consumeOptions.offset += this.opts.itemsToLoadOnScroll;

          this.loading.partial = true;

          Vue.nextTick(() => {
            this.scrollManager.scrollToEnd();
          });

          try {
            const consumedData = await this.consumeDataCallback(this.consumeOptions);
            this.data.push.apply(this.data, consumedData);   
          } finally {
            this.loading.partial = false;
          }
        }
      },
      initialConsume: async function () {
        this.consumeOptions = {
          page: 0,
          offset: 0,
          pageSize: this.opts.itemsToLoadOnScroll,
          endIndex: this.opts.itemsToLoadOnScroll,
          sortColumn: this.sort.column,
          sortDirection: this.sort.direction
        };

        this.loading.full = true;
        try {
          this.data = await this.consumeDataCallback(this.consumeOptions);
        } finally {
          this.loading.full = false;
        }
      },
      refresh () {
        this.scrollManager.scrollToTop();
        this.initialConsume();
      },
      sortBy (column) {
        if (column.sortable) {
          this.sort.direction = this.sort.direction === 'DESC' ? 'ASC' : 'DESC';
          this.sort.column = column.name;
          this.refresh();
        }
      },
      rowClick (row, index) {
        this.$emit('rowClick', row, index);
      }
    },
    components: {
      LoadingIndicator
    }
  }
</script>

<style lang="less">
  .vueInfiniteTable-container {
    position: relative;
  }

  .vueInfiniteTable {
    table {
      width: 100%;

      thead th {
        position: sticky;
        top: 0;
        background-color: #FFF;

        &.sortable {
          user-select: none;
          cursor: pointer;
        }
      }

      tfoot {
        td {
          position: relative;
          height: 80px;
        }
      }
    }

    .loadingIndicator-fade {
      &-enter-active,
      &-leave-active {
        transition: 500ms;
      }

      &-leave-to,
      &-enter {
        opacity: 0;
      }

      &-enter-to,
      &-leave {
        opacity: 1;
      }
    }
  }
</style>
