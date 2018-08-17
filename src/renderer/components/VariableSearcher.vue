<template>
    <v-flex>
        <v-toolbar
                dark
                color="teal"
        >
            <v-toolbar-title>Searcher</v-toolbar-title>
            <v-autocomplete
                    :loading="loading"
                    :items="items"
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
        <p>{{data.version}}</p>
    </v-flex>
</template>

<script>
  const request = require('request');

  export default {
    data() {
      return {
        loading: false,
        items: [],
        search: null,
        select: null,
        data: null,
      };
    },
    computed: {
      test() {
        const a = this.test;
        a.forEach((val) => {
          console.log(val);
        });
      },
    },
    created() {
      request.get(
        {
          url: 'https://spreadsheets.google.com/feeds/list/1Dnbk9uaHWISeOQsbSwjPNLV6QSKQYPWRb7iCnqyzQXQ/od6/public/values?alt=json',
          followAllRedirects: true,
        }, (error, response, body) => {
          console.log(body);
          if (!error && response.statusCode === 200) {
            this.data = body;
          }
        },
      );
    },
    watch: {
      search(val) {
        val && val !== this.select && this.querySelections(val);
      },
    },
    methods: {
      querySelections() {
        this.loading = true;
        // Simulated ajax query
        const a = [];

        setTimeout(() => {
          this.variable.forEach((val) => {
            a.push(`${val.name}\n${val.comment}\n${val.value}`);
          });
          this.items = a;
          this.loading = false;
        }, 50);
      },
    },
  }
  ;
</script>

<style scoped>

</style>





