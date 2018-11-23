<template>
    <div class="text-xs-center">
        <v-dialog
                v-model="status"
                hide-overlay
                persistent
                width="700"
        >
            <v-card
                    v-bind:style="{backgroundColor: color}"
                    dark
            >
                <v-card-text>
                    <p v-for="me in message">
                        {{me}}
                    </p>
                    <v-progress-linear
                            v-if="progress"
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
  export default {
    props: ['status', 'progress', 'message', 'color', 'isBtn'],
    data() {
      return {
        dialog: false,
      };
    },
    watch: {
    },
  };
</script>