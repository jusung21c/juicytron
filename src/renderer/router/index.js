import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome-view',
      component: require('@/components/WelcomeView').default,
    },
    {
      path: '/programmanager',
      name: 'programmanager',
      component: require('@/components/ProgramManager').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
