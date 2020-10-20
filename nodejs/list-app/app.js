// jsのサーバー起動させるためのfw
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json())
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const { Sequelize, QueryTypes } = require('sequelize');
// const { canTreatArrayAsAnd } = require('sequelize/types/lib/utils');
const name = "practice"
const user = "admin"
const password = "admin"
const host = "localhost"
const port = '5433'
const dialect = "postgres"
const database = new Sequelize(name, user, password, {
  host: host,
  port: port,
  dialect: dialect,
})

app.get('/', async(req, res) => {
  const sql = `
          SELECT 
            *
          FROM 
            todos
          ORDER BY
            id 
        `

const result = await sendData(sql);
res.status(200).send({todos: result[0]});
});

app.post('/create', async(req, res) => {
  console.log (req.body)

  const sql = `INSERT INTO public.todos(
    title, description, "isComplete")
    VALUES ($title, $description, false) `

  const params = {
    title: req.body.title,
    description: req.body.description
   };

  const result = await database.query(sql, {bind: params, type: Sequelize.QueryTypes.INSERT})
  res.status(200).send();
  }
);

app.post('/delete', async(req, res) => {
  const sql = `
            DELETE
            FROM
              todos
            WHERE
              id = $id
              `

  const params = {
    id: req.body.id
  }
  
  const result = await database.query(sql, {bind: params, type: Sequelize.QueryTypes.DELETE})
  res.status(200).send();
});

app.post('/update', async(req, res) => {

  const sql = `UPDATE 
                  todos 
              SET 
                  "isComplete" = true
              WHERE
                  id = $id
              `

  const params = {
    id: req.body.id
  }
  
  const result = await database.query(sql, {bind: params, type: Sequelize.QueryTypes.UPDATE})
  res.status(200).send();
});

app.post('/undo', async(req, res) => {

  const sql = `UPDATE 
                  todos 
              SET 
                  "isComplete" = false
              WHERE
                  id = $id
              `
              
  const params = {
    id: req.body.id
  }
  
  const result = await database.query(sql, {bind: params, type: Sequelize.QueryTypes.UPDATE})
  res.status(200).send();
});

const sendData = async(sql) => { 
const result = await database.query(sql)
  return result;
};

app.listen(3001);
