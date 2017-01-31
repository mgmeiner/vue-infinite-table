<template>
  <div>
    <h1>Infinite Table DEMO</h1>

    <div class="demoInfiniteTableContainer">

      <infiniteTable 
        :columns="['id', 'name', 'country']" 
        :data="data" 
        @consumeData="onConsumeData" 
        :options="{ initialPageSize: 50, scrollContainer: '.demoInfiniteTableContainer' }"
        :debug="true" />

    </div>
  
  </div>
</template>

<script>
  import infiniteTable from '../lib/InfiniteTable';
  import sampleData from './data.json';

  export default {
    name: 'app',
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
  };
</script>

<style lang="less" scoped> 
  .demoInfiniteTableContainer {
    max-height: 50vh;
    overflow: auto;
  }
</style>