<template>
  <div class="page">
    <header>
      <div class="container">
        <h1>VUE-INFINITE-TABLE</h1>
      </div>
    </header>

    <main>
      <div class="container">
        <home />
      </div>
    </main>
  </div>
</template>

<script>
  import Home from './Home';

  export default {
    name: 'app',
    components: {
      home: Home
    }
  };
</script>

<style lang="less"> 
  .page {
    header {
      padding: 4rem;
      color: #FFF;
      background: #00bf8f;  
      background: linear-gradient(to left, #00bf8f , #001510);  

      h1 {
        margin: 0;
      }
    }

    main {
      padding-top: 1rem;
    }
  }
</style>