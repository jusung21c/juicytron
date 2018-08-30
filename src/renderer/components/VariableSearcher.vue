<template>
    <v-container grid-list-xl text-xs-center>
        <v-layout row>
            <v-spacer></v-spacer>

        </v-layout>
        <v-flex xs8 offset-xs2 my-4>
            <v-card dark color="purple">
                <v-card-title>
                    <h1>Variable Searcher</h1>
                    <v-spacer></v-spacer>
                    <v-btn color="teal" large @click="open('https://docs.google.com/spreadsheets/d/1Dnbk9uaHWISeOQsbSwjPNLV6QSKQYPWRb7iCnqyzQXQ/edit#gid=0')">시트바로가기</v-btn>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-layout row>
            <v-flex xs8 offset-xs2 my-4>
                <v-toolbar
                        dark
                        color="teal"
                >
                    <v-toolbar-title>Searcher</v-toolbar-title>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            single-line
                            hide-details
                            class="mx-3"
                    ></v-text-field>
                </v-toolbar>
            </v-flex>
        </v-layout>
        <v-data-table
                :headers="headers"
                :items="data"
                :search="search"
                :loading="loading"
                hide-actions
                item-key="title"
        >
            <template slot="items" slot-scope="props" >
                <transition name="fade">
                    <tr @click="props.expanded = !props.expanded">
                        <td>{{ props.item.title }}</td>
                        <td>{{ props.item.description }}</td>
                        <td style="width: 30%">{{ props.item.value }}</td>
                    </tr>
                </transition>
            </template>

            <template slot="expand" slot-scope="props">
                <v-card flat>
                    <v-card-text>{{ props.item.value }}</v-card-text>
                </v-card>
            </template>
        </v-data-table>

    </v-container>
</template>

<script>
  const rp = require('request-promise-native');

  export default {
    data() {
      return {
        tableloading: true,
        loading: true,
        items: [],
        search: '',
        select: null,
        variable: null,
        data: [],
        searcheddata: null,
        headers: [
          {
            text: 'Vairalbe Name',
            value: 'title',
          },
          { text: 'Description', value: 'description' },
          { text: 'Value', value: 'value' },
        ],
      };
    },
    computed: {},
    beforeCreate() {
      rp('https://spreadsheets.google.com/feeds/list/1Dnbk9uaHWISeOQsbSwjPNLV6QSKQYPWRb7iCnqyzQXQ/od6/public/values?alt=json')
        .then(data => new Promise((resolve) => {
          resolve(JSON.parse(data).feed.entry);
        }))
        .then(entry => Promise.all(entry.map(val => (
          { title: val.gsx$name.$t,
            description: val.gsx$description.$t,
            value: val.gsx$value.$t }
        ))))
        .then((obj) => {
          this.data = obj;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    watch: {
    },
    methods: {
      getItems(arrdataobj) {
        const arr = [];
        arrdataobj.forEach((val) => {
          arr.push(val.title);
        });
        return arr;
      },
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  }
  ;
</script>

<style scoped>
.v-toolbar{
    z-index: 1;
}
table.v-table tbody td{
    text-align: left;
}
</style>





