<template>
  <div id="iapp">
    <app-header></app-header>
    <main class="container my-5">
      <flash-message :position="'top-right'"></flash-message>
      <router-view></router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>


<script>
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}

</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.page-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  padding: 20px;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;

  &:hover, &:focus {
    background-color: #2980b9;
    border-color: #2980b9;
  }
}

.card {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
}
</style>