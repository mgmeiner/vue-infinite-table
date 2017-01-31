<template>
  <div>
    <h1>Infinite Table DEMO</h1>

    <infiniteTable :columns="columns" :data="data" @consumeData="onConsumeData" />
  
  </div>
</template>

<script>
  import infiniteTable from '../lib/InfiniteTable';
  import sampleData from './data.json';

  export default {
    name: 'app',
    data () {
      return {
        data: [],
        columns: ['id', 'name', 'country']
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

<style lang="less"> 

</style>