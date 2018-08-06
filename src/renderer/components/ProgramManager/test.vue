<template>
    <v-card>
        <v-card-title class="headline font-weight-regular blue-grey white--text">프로시져 선택</v-card-title>
        <v-card-text>

            <v-autocomplete
                    v-model="model"
                    :items="proclist"
                    :readonly="!isEditing"
                    :label="`Proc`"
                    persistent-hint
                    prepend-icon="mdi-city"
            >
                <v-slide-x-reverse-transition
                        slot="append-outer"
                        mode="out-in"
                >
                </v-slide-x-reverse-transition>
            </v-autocomplete>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
      name: 'test',
      props: ['proclist'],
      data() {
        return {
          isEditing: true,
          model: null,
        };
      },
    };
</script>

<style scoped>

</style>