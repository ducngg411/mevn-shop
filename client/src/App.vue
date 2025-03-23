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


// body {
//   margin: 0;
//   padding: 0;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
//     'Helvetica Neue', Arial, sans-serif;
//   background-color: #f8f9fa;
//   color: #333;
// }

// #app {
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
// }

// main {
//   flex: 1;
// }

// .fade-enter-active, .fade-leave-active {
//   transition: opacity 0.3s;
// }
// .fade-enter, .fade-leave-to {
//   opacity: 0;
// }

// .page-content {
//   background-color: #fff;
//   border-radius: 8px;
//   box-shadow: 0 0 10px rgba(0,0,0,0.05);
//   padding: 20px;
// }

// .btn-primary {
//   background-color: #3498db;
//   border-color: #3498db;

//   &:hover, &:focus {
//     background-color: #2980b9;
//     border-color: #2980b9;
//   }
// }

// .card {
//   box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//   transition: all 0.3s ease;

//   &:hover {
//     box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//     transform: translateY(-2px);
//   }
// }

/* App.vue */
body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.7;
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
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.page-content {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 25px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.page-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.btn-primary {
  background-color: #4361ee;
  border-color: #4361ee;
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-primary:focus {
  background-color: #3a56d4;
  border-color: #3a56d4;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

.card {
  border: none;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.4s ease;
  border-radius: 12px;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: #2d3748;
}

.section-title {
  position: relative;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.section-title:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 50px;
  height: 4px;
  background: #4361ee;
  border-radius: 2px;
}

.section-title.text-center:after {
  left: 50%;
  transform: translateX(-50%);
}
</style>