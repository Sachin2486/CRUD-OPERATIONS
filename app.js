const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());  //middleware to parse JSON requests

mongoose.connect('mongodb://localhost:27017/CRUD');

const Todo = mongoose.model('Todo', {
    title: String,
    description: String,
});

app.listen(port, () => {
    console.log('Server is running on port: ${port}')
})

app.post('/todos', async(req,res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/todos', async(req,res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (error) {
      res.status(500).send(error);
    }
});

app.put('/todos/:id',async(req,res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!todo){
          return res.status(404).send();
        }
        res.send(todo);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/todos/:id',async(req,res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if(!todo){
            return res.status(404).send();
        }
        res.send(todo);
    } catch (error) {
        res.status(500).send(error);
    }
});