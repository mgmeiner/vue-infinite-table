<template>
  <div class="vueInfiniteTable">
    <table :class="_options.style.tableClass">

      <tableHeader :columns="columns" :sort="sort" @sortBy="sortBy" />

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

    <stickyHeaderWrapper :show="showStickyHeader" :scrollContainer="_options.scrollContainer" v-if="_options.header.show && _options.header.sticky" >    
      <tableHeader :columns="columns" :sort="sort" @sortBy="sortBy" />
    </stickyHeaderWrapper>

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
  import StickyHeaderWrapper from './StickyHeaderWrapper';
  import LoadingIndicator from './LoadingIndicator';
  import _merge  from 'lodash/merge';
  import _debounce from 'lodash/debounce';

  const defaultOptions = {
    initialPageSize: 20,
    itemsToLoadOnScroll: 5,
    pageEndMode: 'late',
    scrollContainer: 'body',
    defaultSortColumn: null,
    defaultSortDirection: 'ASC',
    loadingIndicator: true,
    header: {
      show: true,
      sticky: true
    },
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
        showStickyHeader: false,
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

      this.scrollManager = new ScrollManager(this._options.pageEndMode, {
        reachedEnd: _debounce(this.consume, 100),
        reachedStart: this.hideHeader,
        inside: this.showHeader
      });

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

          this.loading.partial = true;
          try {
            const consumedData = await this.consumeDataCallback(this.consumeOptions);
            this.data.push.apply(this.data, consumedData);
          } finally {
            this.loading.partial = false;
          }

          this.consumeOptions.offset += this._options.itemsToLoadOnScroll;
        }
      },
      initialConsume: async function () {
        this.consumeOptions = {
          page: 0,
          offset: this._options.initialPageSize,
          pageSize: this._options.itemsToLoadOnScroll,
          endIndex: this._options.initialPageSize,
          sortColumn: this.sort.column,
          sortDirection: this.sort.direction
        }

        this.loading.full = true;
        try {
          this.data = await this.consumeDataCallback({
            page: 0,
            offset: 0,
            pageSize: this._options.initialPageSize,
            endIndex: this._options.initialPageSize,
            sortColumn: this.sort.column,
            sortDirection: this.sort.direction
          });
        } finally {
          this.loading.full = false;
        }
      },
      refresh () {
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
      },
      hideHeader () {
        this.showStickyHeader = false;
      },
      showHeader () {
        this.showStickyHeader = true;
      }
    },
    components: {
      loadingIndicator: LoadingIndicator,
      stickyHeaderWrapper: StickyHeaderWrapper,
      tableHeader: TableHeader
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
