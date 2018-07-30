<template>
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
</template>

<script>
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
      }
    },
    methods: {
      sortBy (column) {
        this.$emit('sortBy', column);
      }
    }
  }
</script>

<style lang="less">
  .vueInfiniteTable {
    table {
      thead th {
        position: sticky;
        top: 0;
        background-color: #FFF;

        &.sortable {
          user-select: none;
          cursor: pointer;
        }
      }
    }
  }
</style>
