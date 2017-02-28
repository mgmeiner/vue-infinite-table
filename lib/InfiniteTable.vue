<template>
  <div class="vueInfiniteTable">
    <table :class="_options.style.tableClass">

      <thead v-if="_options.header.show">
        <tr>
          <th v-for="column in columns" :class="{sortable: column.sortable}" @click="sort(column)">
            <div>
              <slot :name="'th-' + column.name" :column="column">
                {{column.displayName}}
                <span v-if="column.sortable && column.name === sortColumn">
                  <span v-if="sortDirection === 'ASC'">▲</span><span v-else>▼</span>
                </span>
              </slot>
            </div>
          </th>
        </tr>
      </thead>

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

    <table 
      v-if="_options.header.show && _options.header.sticky" 
      v-show="stickyHeader.show"
      class="vueInfiniteTable-stickyHeader" :style="{ top: stickyHeader.positionTop + 'px'}">

      <thead>
        <tr>
          <th v-for="column in columns" :class="{sortable: column.sortable}" @click="sort(column)">
            <div>
              <slot :name="'th-' + column.name" :column="column">
                {{column.displayName}}
                <span v-if="column.sortable && column.name === sortColumn">
                  <span v-if="sortDirection === 'ASC'">▲</span><span v-else>▼</span>
                </span>
              </slot>
            </div>
          </th>
        </tr>
      </thead>
    </table>

    <template v-if="_options.loadingIndicator">
      <slot name="loading-full" v-if="loading.full">
        <loadingIndicator full />
      </slot>
    </template>

    <scrollManager @hideHeader="hideHeader" @showHeader="showHeader" @pageEnd="onPageEnd" :scrollContainer="_options.scrollContainer" :pageEndMode="_options.pageEndMode" />
  </div>
</template>

<script>
  import ScrollManager from './ScrollManager';
  import LoadingIndicator from './LoadingIndicator';
  import _merge from 'lodash/merge';

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
        sortColumn: null,
        sortDirection: null,
        showStickyHeader: false,
        stickyHeader: {
          show: false,
          positionTop: 0
        },
        loading: {
          full: false,
          partial: false
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

      this.sortDirection = this._options.defaultSortDirection;
      if (this._options.defaultSortColumn) {
        this.sortColumn = this._options.defaultSortColumn;
      }

      this.init();
    },
    mounted () {
      const scrollContainerEl = document.querySelector(this._options.scrollContainer);
      scrollContainerEl.className += ' vueInfiniteTable-container';

      this.stickyHeader.positionTop = scrollContainerEl.offsetTop;

      console.log(scrollContainerEl);
    },
    methods: {
      onPageEnd: async function () {
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
      init: async function () {
        this.consumeOptions = {
          page: 0,
          offset: this._options.initialPageSize,
          pageSize: this._options.itemsToLoadOnScroll,
          endIndex: this._options.initialPageSize,
          sortColumn: this.sortColumn,
          sortDirection: this.sortDirection
        }

        this.loading.full = true;
        try {
          this.data = await this.consumeDataCallback({
            page: 0,
            offset: 0,
            pageSize: this._options.initialPageSize,
            endIndex: this._options.initialPageSize,
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection
          });
        } finally {
          this.loading.full = false;
        }
      },
      refresh () {
        this.init();
      },
      sort (column) {
        if (column.sortable) {
          this.sortDirection = this.sortDirection === 'DESC' ? 'ASC' : 'DESC';
          this.sortColumn = column.name;
          this.refresh();
        }
      },
      rowClick (row, index) {
        this.$emit('rowClick', row, index);
      },
      hideHeader () {
        this.stickyHeader.show = false;
      },
      showHeader () {
        this.stickyHeader.show = true;
      }
    },
    components: {
      scrollManager: ScrollManager,
      loadingIndicator: LoadingIndicator
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

    table.vueInfiniteTable-stickyHeader {
      position: fixed;
    }
  }
</style>
