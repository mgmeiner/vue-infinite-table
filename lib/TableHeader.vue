<template>
  <thead>
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