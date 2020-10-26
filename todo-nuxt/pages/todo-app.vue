<template>
  <div>
    <v-row justify="end">
      <v-col cols="2">
        <v-form>
          <v-text-field v-model="keyward" type="text" placeholder="検索">
          </v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <h1>Todoアプリ</h1>
    <pre class="task">
完了：{{ completedTodos.length }}   残り：{{ remainingTodos.length }}</pre
    >
    <p class="level">
      Lv.{{ levelInfo.level }}（次のレベルまで {{ levelInfo.remainingExp }})
    </p>
    <p>
      {{ todos.isComplete }}
    </p>
    <p>
      <v-text-field
        v-model="title"
        type="text"
        class="title"
        placeholder="タイトル ※必須"
        clearable
      >
      </v-text-field>
    </p>
    <p>
      <v-textarea
        v-model="description"
        class="description"
        placeholder="説明を入力"
      >
      </v-textarea>
    </p>
    <div>
      <v-btn @click="createTodo">todoを作成 </v-btn>
    </div>
    <v-main>
      <v-container fluid>
        <v-row>
          <template v-for="(todo, index) of filteredTodos">
            <v-col :key="index" cols="4">
              <v-card v-show="remainingTodos.length !== 0" class="mx-auto">
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">
                      <span v-show="!todo.isEditMode" class="title">{{
                        todo.title
                      }}</span>
                      <span v-show="todo.isEditMode">
                        <v-text-field
                          v-model="todo.editing.title"
                          type="text"
                          placeholder="タイトル ※必須"
                          clearable
                        >
                        </v-text-field>
                      </span>
                      <v-divider></v-divider>
                    </div>
                    <v-list-item-subtitle>
                      {{ todo.updateDay }}</v-list-item-subtitle
                    >
                    <div v-show="!todo.isEditMode">
                      {{ todo.description }}
                    </div>
                    <div v-show="todo.isEditMode">
                      <v-textarea
                        v-model="todo.editing.description"
                        placeholder="説明を入力"
                        clearable
                      >
                      </v-textarea>
                    </div>
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                  <v-col class="text-right">
                    <span v-show="todo.isEditMode">
                      <v-btn @click="ok(todo)">OK</v-btn>
                    </span>
                    <v-btn icon>
                      <div @click="complete(todo)">
                        <v-icon color="green"> mdi-check-circle </v-icon>
                      </div>
                    </v-btn>
                    <v-btn icon>
                      <div @click="edit(todo)">
                        <v-icon color="blue"> mdi-pencil </v-icon>
                      </div>
                    </v-btn>
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
    </v-main>
  </div>
</template>
<script>
import axios from 'axios'
const url = 'http://localhost:3001/'

export default {
  name: 'TodoAppVue',
  data() {
    return {
      todos: [],
      title: '',
      description: '',
      keyward: '',
    }
  },
  computed: {
    header() {
      return [
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'UpdateDay', value: 'updateDay' },
        { text: 'Actions', value: 'actions', sortable: false },
      ]
    },
    completedTodos() {
      return this.todos.filter((todo) => todo.isComplete === true)
    },
    remainingTodos() {
      return this.todos.filter((todo) => todo.isComplete === false)
    },
    filteredTodos() {
      return this.remainingTodos.filter((todo) =>
        todo.title.includes(this.keyward)
      )
    },
    levelInfo() {
      let exp = this.completedTodos.length
      let initLv = 1
      // TODO: 処理
      while (exp >= 0) {
        exp -= initLv
        initLv++
      }

      return {
        level: initLv - 1,
        remainingExp: Math.abs(exp),
      }
    },
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async createTodo() {
      if (this.title === '') {
        alert('タイトルを入力してください。')
      } else {
        const data = {
          title: this.title,
          description: this.description,
        }
        await axios.post(`${url}create`, data)
        await this.fetch()
        this.clearTexts()
      }
    },
    async fetch() {
      const res = await axios.get(`${url}select`)
      const data = res.data.todos
      this.todos = data.map((todo) => {
        return {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          updateDay: todo.updateDay,
          isEditMode: todo.isEditMode,
          isComplete: todo.isComplete,
          editing: {
            title: todo.title,
            description: todo.description,
          },
        }
      })
    },
    async complete(todo) {
      await axios.post(`${url}update`, todo)
      await this.fetch()
    },
    async click_undo(todo) {
      await axios.post(`${url}undo`, todo)
      await this.fetch()
    },
    async click_delete(todo) {
      await axios.post(`${url}delete`, todo)
      await this.fetch()
    },
    edit(todo) {
      todo.isEditMode = !todo.isEditMode
      if (!todo.isEditMode) {
        todo.editing = {
          title: todo.title,
          description: todo.description,
        }
      }
    },
    async ok(todo) {
      if (todo.editing.title === '' || todo.editing.title === null) {
        alert('タイトルを入力してください。')
      } else {
        todo.isEditMode = false
        const data = {
          id: todo.id,
          title: todo.editing.title,
          description: todo.editing.description,
        }
        await axios.post(`${url}edit`, data)
        await this.fetch()
      }
    },
    clearTexts() {
      this.title = ''
      this.description = ''
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  font-size: 36px;
  color: aqua;
  margin-bottom: 40px;
}

.task {
  color: red;
  font-size: 25px;
  margin: 10px;
}

.level {
  color: red;
  font-size: 20px;
  margin: 5px;
}

.title {
  width: 230px;
  height: 30px;
  text-align: center;
  font-size: 20px;
  margin: auto;
}

.description {
  width: 230px;
  height: 80px;
  font-size: 16px;
  margin: auto;
  margin-bottom: 100px;
}

.createButton {
  width: 130px;
  height: 30px;
  font-size: 20px;
  border: 2px solid rgb(0, 0, 0);
  background: snow;
  margin-bottom: 50px;
}

textbox {
  text-align: center;
  color: limegreen;
  font-size: 20px;
}

.text-style2 {
  color: white;
  font-size: 20px;
}

.background {
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  width: 500px;
  height: 70px;
}

.aaa {
  margin-left: 40px;
}

.bbb {
  margin-left: 20px;
}

.table {
  margin: 30px;
}

.complete {
  color: green;
}

.delete {
  color: red;
}
</style>
