import express from 'express';
import Cors from 'cors';
import pg from 'pg';

// app config
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(Cors());

// db config
const pool = new pg.Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "perntodo"
});

//api routes
app.get("/", (req, res) => {
    res.status(200).send("WORKING!!")
});

// post a task
app.post("/todos", async(req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});

// get all tasks
app.get("/todos", async (req, res) => {
    try {
      const allTodos = await pool.query(
        "SELECT * FROM todo"
      );

      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

// get a task
app.get("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const todo = await pool.query(
        "SELECT * FROM todo WHERE todo_id = $1", 
        [id]
      );
  
      res.json(todo.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
});
  

// update a task
app.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
      );
  
      res.json("Todo was updated!");
    } catch (err) {
      console.error(err.message);
    }
});

// delete a task
app.delete("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1", 
            [id]
        );
        
        res.json("Deleted!")
    } catch (err) {
        console.error(err.message);
    }
});

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));