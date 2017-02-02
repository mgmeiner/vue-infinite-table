<template>
  <div class="page">
    <header>
      <div class="container">
        <h1>VUE-INFINITE-TABLE</h1>

        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/advanced">Advcanced</router-link>
        </nav>
      </div>
    </header>

    <main>
      <router-view />
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
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: column;
    flex-wrap: none;

    header {
      flex-shrink: 0;
      padding: 4rem;
      color: #FFF;
      background: #00bf8f;  
      background: linear-gradient(to left, #00bf8f , #001510);  

      h1 {
        margin: 0;
      }
    }

    main {
      flex-grow: 1;
      display: flex;
      overflow: auto;
      padding-top: 1rem;
    }
  }
</style>