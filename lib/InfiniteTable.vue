<template>
  <div class="vueInfiniteTable">
    <table :class="_options.style.tableClass">
      <tableHeader
        ref="tableHeader"
        v-if="_options.showHeader"
        :columns="columns"
        :sort="sort"
        :scrollContainer="_options.scrollContainer"
        @sortBy="sortBy" />

      <tbody>
        <tr v-for="(row, i) in data" @click="rowClick(row, i)">
          <td v-for="column in columns">
            <slot :name="'td-' + column.name" :column="column" :row="row" :value="row[column.name]" :index="i">
               {{row[column.name]}}
            </slot>
          </td>
        </tr>
      </tbody>

      <tfoot v-if="_options.loadingIndicator && loading.partial">
        <tr>
          <td :colspan="columns.length">
            <slot name="loading-partial">
              <loadingIndicator />
            </slot>
          </td>
        </tr>
      </tfoot>

    </table>

    <template v-if="_options.loadingIndicator">
      <slot name="loading-full" v-if="loading.full">
        <loadingIndicator full />
      </slot>
    </template>

  </div>
</template>

<script>
  import ScrollManager from './ScrollManager';
  import TableHeader from './TableHeader';
  import LoadingIndicator from './LoadingIndicator';
  import _merge  from 'lodash/merge';
  import _debounce from 'lodash/debounce';

  const defaultOptions = {
    itemsToLoadOnScroll: 20,
    pageEndMode: 'late',
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
        _options: null,
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
      this._options = _merge(defaultOptions, this.options);

      const scrollManagerCallbacks = {
        reachedEnd: _debounce(this.consume, 100)
      };

      if (this._options.showHeader) {
        Object.assign(scrollManagerCallbacks, {
          reachedStart: () => this.$refs.tableHeader.release(),
          inside: () => this.$refs.tableHeader.stick()
        });
      }

      this.scrollManager = new ScrollManager(this._options.pageEndMode, scrollManagerCallbacks);

      this.sort.direction = this._options.defaultSortDirection;
      if (this._options.defaultSortColumn) {
        this.sort.column = this._options.defaultSortColumn;
      }

      this.initialConsume();
    },
    mounted () {
      const scrollContainerEl = document.querySelector(this._options.scrollContainer);
      scrollContainerEl.className += ' vueInfiniteTable-container';

      this.scrollManager.init(scrollContainerEl);
    },
    destroyed () {
      this.scrollManager.destroy();
    },
    methods: {
      consume: async function () {
        // only if not already loading
        if (!this.isLoading) {
          this.consumeOptions.page++;
          this.consumeOptions.endIndex += this._options.itemsToLoadOnScroll;
          this.consumeOptions.offset += this._options.itemsToLoadOnScroll;

          this.loading.partial = true;
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
          pageSize: this._options.itemsToLoadOnScroll,
          endIndex: this._options.itemsToLoadOnScroll,
          sortColumn: this.sort.column,
          sortDirection: this.sort.direction
        };

        this.loading.full = true;
        try {
          this.data = await this.consumeDataCallback(this.consumeOptions);
        } finally {
          this.loading.full = false;
          if (this._options.showHeader) {
            this.$refs.tableHeader.justify();
          }
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
      LoadingIndicator, TableHeader
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
      background-color: #FFF;

      thead th {
        &.sortable {
          user-select: none;
          cursor: pointer;
        }
      }

      tfoot td {
        position: relative;
        height: 80px;
      }
    }
  }
</style>
