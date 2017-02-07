<template>
  <div class="vueInfiniteTable">
    <div v-if="debug" class="debug">DataCount: {{data.length}}</div>

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
        <tr v-for="(row, i) in data">
          <td v-for="column in columns">
            <slot :name="'td-' + column.name" :column="column" :row="row" :value="row[column.name]" :index="i">
               {{row[column.name]}}
            </slot>
          </td>
        </tr>
      </tbody>

    </table>

    <scrollManager @pageEnd="onPageEnd" :scrollContainer="_options.scrollContainer" :pageEndMode="_options.pageEndMode" />
  </div>
</template>

<script>
  import ScrollManager from './ScrollManager';
  import _merge from 'lodash/merge';

  const defaultOptions = {
    initialPageSize: 20,
    itemsToLoadOnScroll: 5,
    pageEndMode: 'late',
    scrollContainer: 'body',
    defaultSortColumn: null,
    defaultSortDirection: 'ASC',
    header: {
      show: true
    },
    debug: false,
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
        sortDirection: null
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
    methods: {
      onPageEnd () {
        this.consumeOptions.page++;
        this.consumeOptions.offset += this._options.itemsToLoadOnScroll;
        this.consumeOptions.endIndex += this._options.itemsToLoadOnScroll;
        this.consumeData(this.consumeOptions);
      },
      consumeData (consumeOptions) {
        this.$emit('consumeData', consumeOptions);
      },
      init () {
        this.consumeOptions = {
          page: 0,
          offset: this._options.initialPageSize,
          pageSize: this._options.itemsToLoadOnScroll,
          endIndex: this._options.initialPageSize + this._options.itemsToLoadOnScroll,
          sortColumn: this.sortColumn,
          sortDirection: this.sortDirection
        }

        this.consumeData({
          page: 0,
          offset: 0,
          pageSize: this._options.initialPageSize,
          endIndex: this._options.initialPageSize,
          sortColumn: this.sortColumn,
          sortDirection: this.sortDirection
        });
      },
      pushData(data) {
        if (this.consumeOptions.page === 0) {
          this.data = data;
        } else {
          this.data.push.apply(this.data, data);
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
      }
    },
    components: {
      scrollManager: ScrollManager
    }
  }
</script>

<style lang="less">
  .vueInfiniteTable {
    position: relative;

    table {
      width: 100%;

      th {
        &.sortable {
          user-select: none;
          cursor: pointer;
        }
      }
    }

    .debug {
      background-color: tomato;
      padding: 0.5rem;
      color: #FFF;
      position: fixed;
      opacity: 0.4;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
