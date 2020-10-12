<template>
  <div id="app">
    <h1>todoアプリを作ってみた</h1>
    <pre style="color: white; font-size: 25px">
完了：{{ completeTask }}    残り：{{ remainingTask }}</pre
    >
    <p style="color: white; font-size: 20px">
      Lv.{{ level }}（次のレベルまで {{ remainingExp }})
    </p>
    <p>
      <input
        type="text"
        v-model="title"
        style="width: 230px; height: 30px; text-align: center; font-size: 20px"
        placeholder="タイトル ※必須"
      />
    </p>
    <textarea
      v-model="description"
      style="width: 230px; height: 80px; font-size: 16px;"
      placeholder="説明を入力"
    >
    </textarea>
    <p>
      <button
        style="width: 130px; height:30px; font-size: 20px"
        v-on:click="createTodo"
      >
        todoを作成
      </button>
    </p>
    <div v-for="(todo, index) in todos" :key="index">
      <p v-if="todo.isComplete">
        <span class="text-style2">
          {{ todo.id }}：{{ todo.title }}
        </span>
        <span class="bbb">
          <a class="underline" @click="click_undo(index)">元に戻す</a>
        </span>
        <span class="bbb">
          <a class="underline" @click="click_delete(index)">削除</a>
        </span>
      </p>
      <p class="background" v-else>
        <span class="text-style1">
          {{ todo.id }}：{{ todo.title }}
        </span>
        <span class="aaa">
          <a class="underline" @click="click_complete(index)">完了！</a>
        </span>
        <pre class="text-style1">{{ todo.description }}</pre>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      completeTask: 0,
      remainingTask: 0,
      level: 1,
      remainingExp: 1,
      title: "",
      description: "",
      id: 1,
      todos: [],
      beforeTodos: []
    };
  },
  methods: {
    createTodo() {
      if (this.title === "") {
        alert("test");
      } else {
        var todo = {
          id: this.id++,
          title: this.title,
          description: this.description,
          isComplete: false
        };
        this.todos.push(todo);
        this.remainingTask++;
        this.title = "";
        this.description = "";
      }
    },
    click_complete(index) {
      this.beforeTodos = this.todos[index];
      this.beforeTodos.isComplete = true;
      var afterTodos = this.beforeTodos;
      this.todos.splice(index, 1, afterTodos);
      this.remainingExp--;
      if (this.remainingExp === 0) {
        this.level++;
        this.remainingExp = this.level;
      }
      this.completeTask++;
      this.remainingTask--;
    },
    click_undo(index) {
      this.beforeTodos.isComplete = false;
      this.todos[index] = this.beforeTodos;
      this.remainingTask++;
      this.completeTask--;
      this.remainingExp++;
      if (this.remainingExp > this.level) {
        this.remainingExp = 1;
        this.level--;
      }
    },
    click_delete(index) {
      this.todos.splice(index, 1);
    }
  }
};
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

textbox {
  text-align: center;
}

.text-style1 {
  color: limegreen;
  font-size: 20px;
}

.text-style2 {
  color: white;
  font-size:20px;
}

.background {
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  width:500px;
  height: 70px;
}

.underline {
  text-decoration: underline;
  font-size:20px;
}

.aaa {
  margin-left: 40px;
}

.bbb {
  margin-left: 20px;
}
</style>
