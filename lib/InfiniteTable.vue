<template>
  <div class="vueInfiniteTable">
    <div v-if="debug" class="debug">DataCount: {{data.length}}</div>

    <table>

      <thead v-if="_options.header.show">
        <tr>
          <th v-for="column in columns">
            <slot :name="'th-' + column.name" :column="column">
              {{column.displayName}}
            </slot>
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

    <scrollManager @pageEnd="onPageEnd" :scrollContainer="_options.scrollContainer" />
  </div>
</template>

<script>
  import ScrollManager from './ScrollManager';
  import _merge from 'lodash/merge';

  const defaultOptions = {
    initialPageSize: 20,
    itemsToLoadOnScroll: 5,
    scrollContainer: 'body',
    header: {
      show: true
    }
  }

  export default {
    name: 'vueInfiniteTable',
    props: {
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      },
      options: {
        type: Object
      },
      debug: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dataOptions: { },
        _options: null
      }
    },
    created () {
      this._options = _merge(defaultOptions, this.options);

      this.dataOptions = {
        offset: this._options.initialPageSize,
        pageSize: this._options.itemsToLoadOnScroll,
        endIndex: this._options.initialPageSize + this._options.itemsToLoadOnScroll
      }

      this.consumeData({
        offset: 0,
        pageSize: this._options.initialPageSize,
        endIndex: this._options.initialPageSize
      });
    },
    methods: {
      onPageEnd () {
        this.dataOptions.offset += this._options.itemsToLoadOnScroll;
        this.dataOptions.endIndex += this._options.itemsToLoadOnScroll;
        this.consumeData(this.dataOptions);
      },
      consumeData (dataOptions) {
        this.$emit('consumeData', dataOptions);
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