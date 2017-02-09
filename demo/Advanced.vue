<template>
  <div class="container advancedDemo">
      <infiniteTable
        :columns="columns" 
        :data="data" 
        :consumeDataCallback="onConsumeData" 
        :options="{ initialPageSize: 15, itemsToLoadOnScroll: 10, scrollContainer: 'main' }">

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
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(sampleData.companies.slice(dataOptions.offset, dataOptions.endIndex));
          }, 1000); 
        });
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