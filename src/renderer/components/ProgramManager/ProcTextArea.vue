<template>
<v-flex>
        <v-textarea
                box
                :label="label"
                auto-grow
                v-model = "propText"
        ></v-textarea>
</v-flex>
</template>

<script>
  export default {
    name: 'TextArea',
    props: ['text', 'label'],
    data() {
      return {
        content: '',
        selproc: 'asdsaads',
      };
    },
    computed: {
      propText: {
        get() { return this.text; },
        set(value) { this.$emit('modifiedText', value); },
      },
    },
    methods: {
    },

  };
</script>

<style scoped>

</style>