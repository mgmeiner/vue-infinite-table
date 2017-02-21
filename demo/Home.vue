<template>
  <div class="container">
    <div class="demoInfiniteTableContainer">

      <infiniteTable 
        :columns="[{ name: 'id', displayName: 'ID', sortable: true }, { name: 'name', displayName: 'Name', sortable: true }, { name: 'country', displayName: 'Country' }]" 
        :data="data" 
        :consumeDataCallback="onConsumeData" 
        :options="{ initialPageSize: 50, scrollContainer: '.demoInfiniteTableContainer' }">
      </infiniteTable>

    </div>
   </div>
</template>

<script>
  import infiniteTable from '../lib/InfiniteTable';
  import sampleData from './data.json';

  export default {
    name: 'home',
    data () {
      return {
        data: []
      }
    },
    components: {
      infiniteTable
    },
    methods: {
      onConsumeData (dataOptions) {
        return sampleData.companies.slice(dataOptions.offset, dataOptions.endIndex);
      }
    }
  }
</script>

<style lang="less">
  .demoInfiniteTableContainer {
    max-height: 50vh;
    overflow: auto;
  }
</style>