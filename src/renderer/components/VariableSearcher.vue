<template>
    <v-flex>
        <v-toolbar
                dark
                color="teal"
        >
            <v-toolbar-title>Searcher</v-toolbar-title>
            <v-autocomplete
                    :loading="loading"
                    :search-input.sync="search"
                    v-model="select"
                    cache-items
                    class="mx-3"
                    flat
                    hide-no-data
                    hide-details
                    label="무엇을 검색하시겠습니까?"
                    solo-inverted
            ></v-autocomplete>
        </v-toolbar>
        <v-data-table
                :headers="headers"
                :items="data"
                hide-actions
                item-key="title"
        >
            <template slot="items" slot-scope="props" v-if="isExist(props.item.title)">
                <transition name="fade">
                <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.title }}</td>
                    <td>{{ props.item.description }}</td>
                </tr>
                </transition>
            </template>

            <template slot="expand" slot-scope="props">
                <v-card flat>
                    <v-card-text>{{ props.item.value }}</v-card-text>
                </v-card>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
  const request = require('request');

  export default {
    data() {
      return {
        tableloading: true,
        loading: false,
        items: [],
        search: null,
        select: null,
        variable: null,
        data: null,
        searcheddata: null,
        headers: [
          {
            text: 'Vairalbe Name',
            align: 'left',
            value: 'title',
          },
          { text: 'Description', value: 'description' },
        ],
      };
    },
    computed: {},
    created() {
      request.get(
        {
          url: 'https://spreadsheets.google.com/feeds/list/1Dnbk9uaHWISeOQsbSwjPNLV6QSKQYPWRb7iCnqyzQXQ/od6/public/values?alt=json',
          followAllRedirects: true,
        }, (error, response, body) => {
          const arr = [];
          if (!error && response.statusCode === 200) {
            const jsondata = JSON.parse(body).feed.entry;
            jsondata.forEach((val) => {
              const dataobj = {
                title: val.gsx$name.$t,
                description: val.gsx$description.$t,
                value: val.gsx$value.$t,
              };
              arr.push(dataobj);
            });
            this.data = arr;
            this.items = this.getItems(arr);
          }
        },
      );
    },
    watch: {
      search(val) {
        val && val !== this.select && this.checkData(val);
      },
    },
    methods: {
      getItems(arrdataobj) {
        const arr = [];
        arrdataobj.forEach((val) => {
          arr.push(val.title);
        });
        return arr;
      },
      checkData(string) {
        const arr = [];
        this.data.forEach((val) => {
          if (val.title.includes(string.toUpperCase()) === true
              || val.description.includes(string) === true
              || val.value.includes(string) === true) {
            arr.push(val);
          }
        },
        );
        this.searcheddata = arr;
      },
      isExist(string) {
        const arr = [];
        if (this.searcheddata !== null) {
          this.searcheddata.forEach((val) => {
            arr.push(val.title);
          });
          return arr.indexOf(string) !== -1;
        }
        return false;
      },
    },
  }
  ;
</script>

<style scoped>

</style>





