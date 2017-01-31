<template>
  <div class="vueInfiniteTable">
    <table>
      <tbody>
        <tr v-for="row in data">
          <td v-for="column in columns">{{row[column]}}</td>
        </tr>
      </tbody>
    </table>
    </div>
</template>

<script>
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
        type: Object,
        default: {
          pageSize: 10
        }
      }
    },
    data () {
      return {
        dataOptions: {
          offset: 0,
          pageSize: this.options.pageSize,
          endIndex: this.options.pageSize
        }
      }
    },
    created () {
      this.consumeData();
    },
    methods: {
      pageEnd () {
        this.dataOptions.offset += this.options.pageSize;
        this.dataOptions.endIndex += this.options.pageSize;
        this.consumeData();
      },
      consumeData () {
        this.$emit('consumeData', this.dataOptions);
      }
    }
  }
</script>

<style lang="less">
  .vueInfiniteTable {
    table {
      width: 100%;
    }
  }
</style>