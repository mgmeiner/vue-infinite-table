<template>
  <div class="demoInfiniteTableContainer">

      <infiniteTable 
        :columns="[{ name: 'id', displayName: 'ID' }, { name: 'name', displayName: 'Name' }, { name: 'country', displayName: 'Country' }]" 
        :data="data" 
        @consumeData="onConsumeData" 
        :options="{ initialPageSize: 50, scrollContainer: '.demoInfiniteTableContainer' }"
        :debug="false" />

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
        this.data.push.apply(this.data, sampleData.companies.slice(dataOptions.offset, dataOptions.endIndex));
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