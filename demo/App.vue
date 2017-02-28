<template>
  <div class="page">
    <header>
      <div class="container">
        <h1>VUE-INFINITE-TABLE</h1>

        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/advanced">Advanced</router-link>
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
  html, body {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    height: 100%;
    width: 100%;
  }

  .page {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    flex-wrap: none;

    header {
      flex-shrink: 0;
      padding: 4rem;
      color: #FFF;
      background: linear-gradient(to left, #403B4A , #E7E9BB);

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

    nav {
      margin-top: 1rem;

      a {
        color: #FFF;
        border: 1px solid #d3d3d3;
        padding: 0.5rem;
        text-decoration: none;
        font-size: 2rem;
        transition: opacity 0.1s;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
</style>