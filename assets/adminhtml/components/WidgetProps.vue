<template>
<div class="vue-props-container">
  <table class="admin__control-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="( prop, idx ) in config">
        <td>
          <input type="text" v-model="prop.name" class="input-text" />
        </td>
        <td>
          <input type="text" v-model="prop.value" class="input-text" />
        </td>
        <td>
          <button class="action-delete" type="button" v-on:click="removeRow(idx)"><span>Delete</span></button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3">
          <button class="action-add" type="button" v-on:click="addRow">Add</button>
        </td>
      </tr>
    </tfoot>
  </table>
  <template v-for="prop in values">
    <input type="hidden" :name="getInputName(prop)" :value="prop.value" />
  </template>
</div>
</template>

<script>
export default {
  props: [ 'fieldid', 'fieldname' ], 
  
  data() {
    return {
      config: []
    }
  },
  
  mounted() {
    const props = this.$provider.get().props;
    this.config = Object.keys(props).map(name => {
      return {
        name,
        value: props[name]
      }
    });
  },

  methods: {
    getInputName: function (prop) {
      return `parameters[props][${prop.name}]`;
    },

    addRow: function () {
      this.config.push({
        name: '',
        value: ''
      });
    },

    removeRow: function (idx) {
      this.config.splice(idx, 1);
    }
  },

  computed: {
    values: function () {
      return this.config.filter(prop => prop.name.trim().length != 0);
    }
  }
};
</script>
