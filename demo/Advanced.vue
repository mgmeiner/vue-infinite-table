<template>
  <div class="container advancedDemo">
      <infiniteTable
        :columns="columns" 
        :data="data" 
        :consumeDataCallback="onConsumeData" 
        :options="{ initialPageSize: 15, itemsToLoadOnScroll: 10, scrollContainer: 'main' }">

        <template slot="td-actions" scope="{row}">
          <button @click="onButtonClick(row)" type="button">+</button>
        </template>
        <template slot="td-daysPassed" scope="{value}">
          <span v-if="value === 0">Today</span>
          <span v-else>{{value}}</span>
        </template>
      </infiniteTable >
   </div>
</template>

<script>
  import infiniteTable from '../lib/InfiniteTable';
  import moment from 'moment';

  export default {
    name: 'advanced',
    data () {
      return {
        data: [],
        columns: [
          { name: 'date', displayName: 'Date' },
          { name: 'daysPassed', displayName: 'Days from now' },
          { name: 'actions', displayName: 'Date' }
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
            resolve(this.generateDateData(dataOptions.offset, dataOptions.endIndex));
          }, 500);
        });
      },
      generateDateData (start, end) {
        const now = moment();

        const data = [];

        console.log(start, end);

        for (let i = start; i < end; i++) {
          const then = moment().subtract(i, 'days');
          data.push({daysPassed: i, date: then.format('dddd, MMMM Do YYYY')});
        }

        return data;
      },
      onButtonClick (row) {
        alert('Clicked date: ' + row.date);
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