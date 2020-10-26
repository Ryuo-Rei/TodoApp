<template>
  <div>
    <v-content>
      <v-container fluid>
        <v-row>
          <template v-for="(todo, index) of completedTodos">
            <v-col :key="index" cols="4">
              <v-card v-show="completedTodos.length !== 0" class="mx-auto">
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">
                      <span class="title">{{ todo.title }}</span>
                      <v-divider></v-divider>
                    </div>
                    <v-list-item-subtitle>
                      {{ todo.updateDay }}</v-list-item-subtitle
                    >
                    <v-list-item-text>{{ todo.description }}</v-list-item-text>
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions>
                  <v-col class="text-right">
                    <v-btn icon>
                      <div @click="click_delete(todo)">
                        <v-icon color="red"> mdi-delete </v-icon>
                      </div>
                    </v-btn>
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import axios from 'axios'
const vListItemText = {
  /* ... */
}
export default {
  components: {
    'v-list-item-text': vListItemText,
  },
  data() {
    return {
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'UpdateDay', value: 'updateDay' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      todos: [],
    }
  },
  computed: {
    completedTodos() {
      return this.todos.filter((todo) => todo.isComplete === true)
    },
  },
  mounted() {
    // URL 最後にとってくるような名前を付ける
    axios
      .get('http://localhost:3001/select')
      .then((response) => (this.todos = response.data.todos))
  },
  methods: {
    async click_delete(todo) {
      await axios.post(`http://localhost:3001/delete`, todo)
      const res = await axios.get('http://localhost:3001/select')
      this.todos = res.data.todos
    },
  },
}
</script>
