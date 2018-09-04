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
      path: '/trello',
      name: 'trello',
      component: require('@/components/WebView/Trello').default,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: require('@/components/WebView/Calendar').default,
    },
    {
      path: '/googledrive',
      name: 'googledrive',
      component: require('@/components/WebView/GoogleDrive').default,
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
