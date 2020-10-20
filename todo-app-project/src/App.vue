<template>
  <div id="app">
    <h1>todoアプリを作ってみた</h1>
    <pre class="task">
完了：{{ completeTask }}    残り：{{ remainingTask }}</pre
    >
    <p class="level">
      Lv.{{ level }}（次のレベルまで {{ remainingExp }})
    </p>
    <p class="task">
      {{ todos.isComplete }}
    </p>
    <p>
      <input
        type="text"
        v-model="title"
        class="title"
        placeholder="タイトル ※必須"
      />
    </p>
    <p>
      <textarea
        v-model="description"
        class="description"
        placeholder="説明を入力"
      >
      </textarea>
    </p>
    <button class="createButton" @click="createTodo">
      todoを作成
    </button>
    <div v-for="(todo, index) in todos" :key="index">
      <p class="background" v-show="!todo.isComplete">
        <span class="text-style1">
          {{ todo.id }}：{{ todo.title }}
        </span>
        <span class="bbb">
          <a class="underline" @click="complete(index)">完了！</a>
        </span>
        <span class="bbb">
          <a class="underline" @click="click_delete(index)">削除</a>
        </span>
        <pre class="text-style1">{{ todo.description }}</pre>
      </p>
    </div>
    <div class ="upper">
    <table border="2">
      <tr>
        <th>id</th>
        <th>title</th>
        <th>description</th>
      </tr>
      <tr v-for="(todo, index) in completeTasks" :key="index">
        <td> {{ todo.id }} </td>
        <td> {{ todo.title }} </td>
        <td> {{ todo.description }} </td>
      </tr>
    </table>
    </div>
      
      <!-- <p v-if="todo.isComplete">
        <span class="text-style2">
          {{ todo.id }}：{{ todo.title }}
        </span>
        <span class="bbb">
          <a class="underline" @click="click_undo(index)">元に戻す</a>
        </span>
      </p> -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data: function() {
    return {
      completeTask: 0,
      level: 1,
      remainingExp: 1,
      todos: [],
      title: "",
      description: ""
    };
  },
  methods: {
    async createTodo() {
      if (this.title === "") {
        alert("タイトルを入力してください。");
      }
      else {
        const data = {
          title: this.title,
          description: this.description
        };
        await axios.post(`http://localhost:3001/create`, data);
        const res = await axios.get("http://localhost:3001/");
        this.todos = res.data.todos;
        this.title = "";
        this.description = "";
      }
    },
    async complete(index) {
      const data = this.todos[index];
      await axios.post(`http://localhost:3001/update`, data);
      const res = await axios.get("http://localhost:3001/");
      this.todos = res.data.todos;
      this.completeTask++;
      this.remainingExp--;
      if (this.remainingExp === 0) {
        this.level++;
        this.remainingExp = this.level;
      }
    },
    async click_undo(index) {
      const data = this.todos[index];
      await axios.post(`http://localhost:3001/undo`, data);
      const res = await axios.get("http://localhost:3001/");
      this.todos = res.data.todos;
      //this.completeTask--;
      this.remainingExp++;
      if (this.remainingExp > this.level) {
        this.level--;
        this.remainingExp = 1;
      }
    },
    async click_delete(index) {
      const data = this.todos[index];
      await axios.post(`http://localhost:3001/delete`, data);
      const res = await axios.get("http://localhost:3001/");
      this.todos = res.data.todos;
    }
  },
  computed: {
    remainingTask() {
      return this.todos.filter(todo => todo.isComplete === false).length
    },
    completeTasks() {
      return this.todos.filter(todo => todo.isComplete === true)
    }
  },
  mounted() {
    axios
      .get("http://localhost:3001/")
      .then(response => (this.todos = response.data.todos));

    // if(localStorage.completeTask) {
      // this.completeTask = localStorage.completeTask
    //}
  }
}
</script>

<style>
html {
  background-color: springgreen;
}

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
  color: white;
}

.task {
  color: white;
  font-size: 25px;
}

.level {
  color: white;
  font-size: 20px;
}

.title {
  width: 230px;
  height: 30px;
  text-align: center;
  font-size: 20px;
}

.description {
  width: 230px;
  height: 80px;
  font-size: 16px;
}

.createButton {
  width: 130px;
  height: 30px;
  font-size: 20px;
}

textbox {
  text-align: center;
}

.text-style1 {
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

.underline {
  text-decoration: underline;
  font-size: 20px;
} 

.aaa {
  margin-left: 40px;
}

.bbb {
  margin-left: 20px;
}

.upper {
  position:fixed;
  right:50px;
  top:50px;
  transition:1s;
  opacity:0.7;
}
table {
  width: 300px;
}
</style>
