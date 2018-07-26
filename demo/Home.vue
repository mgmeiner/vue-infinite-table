<template>
  <div class="container">
    <div class="demoInfiniteTableContainer">

      <infiniteTable
        :columns="[{ name: 'full_name', displayName: 'Name' }, { name: 'stargazers_count', displayName: 'Stars', sortable: true }]"
        :data="data" 
        :consumeDataCallback="onConsumeData" 
        :options="{ itemsToLoadOnScroll: 25, scrollContainer: '.demoInfiniteTableContainer', defaultSortColumn: 'stargazers_count', defaultSortDirection: 'DESC' }">
      </infiniteTable>

    </div>
   </div>
</template>

<script>
  import infiniteTable from '../lib/InfiniteTable';
  import axios from 'axios';

  const githubApi = axios.create({
    headers: { 'Content-Type': 'application/vnd.github.v3+json' }
  })

  export default {
    name: 'home',
    data () {
      return {
        data: []
      }
    },
    methods: {
      async onConsumeData  (dataOptions) {
        const params = {
          q: 'vue in:name',
          page: dataOptions.page + 1,
          per_page: dataOptions.pageSize,
          sort: 'stars',
          order: dataOptions.sortDirection.toLowerCase()
        }

        const res = await githubApi.get('https://api.github.com/search/repositories', { params })
        return res.data.items
      }
    },
    components: {
      infiniteTable
    }
  }
</script>

<style lang="less">
  .demoInfiniteTableContainer {
    height: 50vh;
    overflow: auto;
  }
</style>