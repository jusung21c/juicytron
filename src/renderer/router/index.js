import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default,
    },
    {
      path: '/programmanager',
      name: 'programmanager',
      component: require('@/components/ProgramManager').default,
    },
    {
      path: '/variablesearcher',
      name: 'variablesearcher',
      component: require('@/components/VariableSearcher').default,
    },
    {
      path: '/literalsorter',
      name: 'literalsorter',
      component: require('@/components/LiteralSorter').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
