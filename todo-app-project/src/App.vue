<template>
  <div id="app">
    <h1>todoアプリを作ってみた</h1>
    <pre class="task">
完了：{{ completeTask }}    残り：{{ remainingTask }}</pre
    >
    <p class="level">
      Lv.{{ level }}（次のレベルまで {{ remainingExp }})
    </p>
    <p>
      <input
        type="text"
        v-model="title"
        class="title"
        placeholder="タイトル ※必須"
      />
    </p>
    <textarea
      v-model="description"
      class="description"
      placeholder="説明を入力"
    >
    </textarea>
    <p>
      <button
        class="createButton"
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
      level: 1,
      remainingExp: 1,
      title: "",
      description: "",
      maxId: 0,
      todos: []
    };
  },
  methods: {
    createTodo() {
      if (this.title === "") {
        alert("タイトルを入力してください。");
      } else {
        const todo = {
          id: this.id,
          title: this.title,
          description: this.description,
          isComplete: false
        };
        if(this.maxId === 0)  {
          this.todos.push(todo);
          this.title = "";
          this.description = "";
          return ;
        } 
        if(this.maxId < this.todos.reduce((a, b) => Math.max(a.id, b.id))) {
          this.maxId = this.id;
        }
        this.todos.push(todo);
      }
    },
    click_complete(index) {
      const todo = this.todos[index];
      todo.isComplete = true;
      this.todos.splice(index, 1, todo);
      this.completeTask++;
      this.remainingExp--;
      if (this.remainingExp === 0) {
        this.level++;
        this.remainingExp = this.level;
      }
    },
    click_undo(index) {
      const todo = this.todos[index];
      todo.isComplete = false;
      this.todos.splice(index, 1, todo);
      this.completeTask--;
      this.remainingExp++;
      if (this.remainingExp > this.level) {
        this.remainingExp = 1;
        this.level--;
      }
    },
    click_delete(index) {
      if(this.maxId < this.todos[index].id) {
        this.maxId = this.todos[index].id;
      }
      this.todos.splice(index, 1);
    }
  },
  computed: {
    remainingTask() {
      let remainingTask = 0;
      for (const todo of this.todos) {
        if (todo.isComplete === false) {
          remainingTask++;
        } 
      }
      return remainingTask;
    },
    id() {
      if(this.todos.length === 0) {
        return this.maxId;
      }
      console.log(this.todos);
      return this.todos.reduce((a, b) => Math.max(a.id, b.id)) + 1;
    },
    aaa() {
      return this.todos.length
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
  height:30px; 
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
