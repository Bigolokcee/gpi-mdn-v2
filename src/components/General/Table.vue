<template>
  <div>
    <table>
      <th>
        <input
          type="checkbox"
          ref="checkboxForSelectAllField"
          @click="selectAll($event)"
        />
      </th>
      <tr v-for="(head, i) in header" :key="i">
        <th>{{ head }}</th>
      </tr>
      <tr>
        <td v-for="d in data" :key="d._id"></td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      data: {},
    },
  };
</script>

<style></style>
