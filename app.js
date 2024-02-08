const express = require('express');
const fs = require('fs')
const validator = require("./validator")
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/tasks', (req, res) => {
    fs.readFile('./task.json', {encoding: "utf8", flag: "r"}, (err, data)=>{
        if(err) {
            res.status(500).send(err)
        } else {
            const tasks = JSON.parse(data)
            res.status(200).json(tasks.tasks)
        }
    })
})

app.get('/tasks/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./task.json', {encoding: "utf8", flag: "r"}, (err, data)=>{
        if(err) {
            res.status(500).send(err)
        } else {
            const tasks = JSON.parse(data)
            const task = tasks.tasks.find((task) => task.id == id)
            if(!task){
                res.status(404).send(`No task has been assigned with id ${id}`)
            }
            res.status(200).json(task)
        }
    })
})

app.post('/tasks', validator, (req, res)=> {
    const task = req.body
    task.id = 16
    fs.readFile('./task.json', {encoding: "utf8", flag: "r"}, (err, data)=>{
        if(err) {
            res.status(500).send(err)
        } else {
            const tasks = JSON.parse(data)
            tasks.tasks.push(task)
            fs.writeFile('./task.json', JSON.stringify(tasks), {encoding: "utf-8", flag: "w"}, (err, data) => {
                if(err) {
                    res.send(err)
                } else {
                    res.status(201).json({message: "Task Created", data})
                }
            })
        }
    })
})

app.put('/tasks/:id', validator, (req, res) => {
    const id = req.params.id
    const newTask = req.body
    newTask.id = id
    fs.readFile('./task.json', {encoding: "utf8", flag: "r"}, (err, data)=>{
        if(err) {
            res.status(500).send(err)
        } else {
            const tasks = JSON.parse(data)
            const index = tasks.tasks.findIndex(obj => obj.id == id)
            if(index !== -1) {
                tasks.tasks[index] = newTask
                fs.writeFile('./task.json', JSON.stringify(tasks), {encoding: "utf-8", flag: "w"}, (err) => {
                    if(err) {
                        res.send(err)
                    } else {
                        res.status(200).send("Task updated")
                    }
                })
            } else {
                res.status(404).json({message: "Task not found"})
            }
        }
    })
})

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./task.json', {encoding: "utf8", flag: "r"}, (err, data)=>{
        if(err) {
            res.status(500).send(err)
        } else {
            const tasks = JSON.parse(data)
            const index = tasks.tasks.findIndex(obj => obj.id == id)
            if(index !== -1) {
                tasks.tasks.splice(index, 1)
                fs.writeFile('./task.json', JSON.stringify(tasks), {encoding: "utf-8", flag: "w"}, (err) => {
                    if(err) {
                        res.send(err)
                    } else {
                        res.status(200).send("Task deleted")
                    }
                })
            } else {
                res.status(404).json({message: "Task not found"})
            }
        }
    })
    
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;