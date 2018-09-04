<template>


        <v-container
                fluid
                grid-list-xl
                text-xs-center
        >
            <v-layout row wrap>
                <v-flex xs8 offset-xs2 v-for="item in items">
                    <v-card :color="item.color" class="white--text" @click.native="open(item.to)">
                        <v-card-title primary-title >
                            <div class="headline">{{item.title}}</div>
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            {{item.description}}
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
</template>

<script>
  export default {
    name: 'welcome',
    data: () => ({
      items: [
        { title: 'Team Google Drive', description: 'NLP개발팀 구글 드라이브', color: 'blue', to: 'https://drive.google.com/drive/folders/16ylgC5pCWVyQIowfwjLDVfZPbSPzYvks?usp=sharing' },
        { title: 'Manual', description: '메뉴얼', color: 'green', to: 'https://sites.google.com/view/mediazen' },
        { title: 'Git Server', description: 'gitea server for LP', color: 'purple', to: 'http://58.225.115.230:63000/' },

      ],
    }),
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style scoped>
</style>
