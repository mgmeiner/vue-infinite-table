<template>
  <div class="container advancedDemo">
      <infiniteTable
        :columns="columns" 
        :data="data" 
        @consumeData="onConsumeData" 
        :options="{ initialPageSize: 50, scrollContainer: 'main' }"
        :debug="false">

        <template slot="td-actions" scope="scope">
          <button @click="onButtonClick(scope.row.id)" type="button">+</button>
        </template>
      </infiniteTable >
   </div>
</template>

<script>
  import infiniteTable from '../lib/InfiniteTable';
  import sampleData from './data.json';

  export default {
    name: 'advanced',
    data () {
      return {
        data: [],
        columns: [
          { name: 'id', displayName: 'ID' }, 
          { name: 'name', displayName: 'Name' }, 
          { name: 'country', displayName: 'Country' }, 
          { name: 'actions', displayName: 'Actions' }
        ]
      }
    },
    components: {
      infiniteTable
    },
    methods: {
      onConsumeData (dataOptions) {
        this.data.push.apply(this.data, sampleData.companies.slice(dataOptions.offset, dataOptions.endIndex));
      },
      onButtonClick (id) {
        alert('Clicked company with id' + id);
      }
    }
  }
</script>

<style lang="less">
  .advancedDemo {
    button {
      margin: 0;
    }
  }
</style>