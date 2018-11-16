<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        fixed
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-model="drawer"
        app
      >
        <v-list>
          <v-list-tile 
            router
            :to="item.to"
            :key="i"
            v-for="(item, i) in items"
            exact
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed app :clipped-left="clipped">
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-btn 
          icon
          @click.native.stop="miniVariant = !miniVariant"
        >
          <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-btn
          icon
          @click.native.stop="clipped = !clipped"
        >
          <v-icon>web</v-icon>
        </v-btn>
        <v-btn
          icon
          @click.native.stop="fixed = !fixed"
        >
          <v-icon>remove</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title"></v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <v-footer :fixed="fixed" app>
        <v-spacer></v-spacer>
        <span>&copy; 2018 JuicYJusung</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'juicytron',
    data: () => ({
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Home', to: '/' },
        { icon: 'list_alt', title: 'Trello', to: '/trello' },
        { icon: 'insert_drive_file', title: 'Google Drive', to: '/googledrive' },
        { icon: 'calendar_today', title: 'Google Calendar', to: '/calendar' },
        { icon: 'search', title: 'Variable Searcher', to: '/variablesearcher' },
        { icon: 'bubble_chart', title: 'Program Manager', to: '/programmanager' },
        { icon: 'bubble_chart', title: '릴리즈 파일 생성 및 배포', to: '/comp4release' },
        { icon: 'text_rotate_vertical', title: 'Literal Sorter', to: '/literalsorter' },
        { icon: 'text_rotate_vertical', title: 'Adb Manager(경제형)', to: '/adbcompact' },

      ],
      miniVariant: false,
      title: 'JuicyTron',
    }),
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  /* Global CSS */
  .v-footer{
    z-index: 5;
  }
  .v-toolbar{
    z-index: 5;
  }
  .v-navigation-drawer{
    z-index:6;
  }
</style>
