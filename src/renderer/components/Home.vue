<template>
    <v-card>
        <v-container
                fluid
                grid-list-lg
        >
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card color="blue-grey darken-2" class="white--text">
                        <v-card-title primary-title>
                            <div class="headline">Team Google Drive</div>
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            NLP개발팀 구글 드라이브
                        </v-card-actions>
                    </v-card>
                </v-flex>

                <v-flex xs12>
                    <v-card color="cyan darken-2" class="white--text">
                        <v-layout>
                            <v-flex xs7>
                                <v-card-title primary-title>
                                    <div>
                                        <div class="headline">Supermodel</div>
                                        <div>Foster the People</div>
                                        <div>(2014)</div>
                                    </div>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                        <v-divider light></v-divider>
                        <v-card-actions class="pa-3">

                        </v-card-actions>
                    </v-card>
                </v-flex>

                <v-flex xs12>
                    <v-card color="purple" class="white--text">
                        <v-layout row>
                            <v-flex xs7>
                                <v-card-title primary-title>
                                    <div>
                                        <div class="headline">Halycon Days</div>
                                        <div>Ellie Goulding</div>
                                        <div>(2013)</div>
                                    </div>
                                </v-card-title>
                            </v-flex>
                            <v-flex xs5>
                                <v-img
                                        src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                                        height="125px"
                                        contain
                                ></v-img>
                            </v-flex>
                        </v-layout>
                        <v-divider light></v-divider>
                        <v-card-actions class="pa-3">
                            Rate this album
                            <v-spacer></v-spacer>
                            <v-icon>star_border</v-icon>
                            <v-icon>star_border</v-icon>
                            <v-icon>star_border</v-icon>
                            <v-icon>star_border</v-icon>
                            <v-icon>star_border</v-icon>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>

  export default {
    name: 'welcome',

    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style scoped>
</style>
