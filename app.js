const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello there this is localhost 3000!');
});

//Arrays (DataBase)
const genres = [
    {id:1, name: 'pop'},
    {id:2, name: 'hip hop'},
    {id:3, name: 'rap'},
    {id:4, name: 'classical'},
    {id:5, name: 'rock'},
    {id:6, name: 'jazz'},
    {id:7, name: 'blues'},
    {id:8, name: 'electronic'},
];

const songs =[
    {id:1, name: 'pop'},
    {id:2, name: 'hip hop'},
    {id:3, name: 'rap'},
    {id:4, name: 'classical'},
    {id:5, name: 'rock'},
    {id:6, name: 'jazz'},
    {id:7, name: 'blues'},
    {id:8, name: 'electronic'},
]

app.get("/api/home",(req,res)=>{
    res.send("Welcome to Music App")
});

app.get("/api/home/genres",(req,res)=>{
    res.send(genres);
})



/*
app.get('/api/courses', (req,res)=>{
    res.send(courses);
});
//HTTP GET requests
app.get('/api/courses/:id',(req, res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("The course with the given ID was not found");
    }
    res.send(course);
})

//HTTP POST requests
app.post('/api/courses', (req,res) => {
    let name = req.body.name;
    // you write the if code here
    //add an if statement so that the name of the course you post is .min(3) characters 
    //res.send("the length of name" + req.body.name);
    if(name.length <= 3){
        res.status(404).send("Must be more than 3 characters");
    }
    else{
        const course ={
            //we assign an ID and a name property
            id: courses.length +1,
            name: req.body.name
        }
        //res.send(course);
        //YOU WRITE THE NEXT LINES OF code
        //next step: push it to the array
        //next step: the server should return the new resource to the client in the body of the response
        courses.push(course);
        res.send(courses);
    }
});
  
//HTTP PUT requests
//The request id has to be equal to json request id.
app.put('/api/courses/:id', (req,res)=>{
    //req.params.id is equal to the id of localhost:3000/api/courses/:id.
    //req.body.id is equal to the id provided in the JSON.
    const courseExist = courses.find(c=> c.id === parseInt(req.params.id));
    if(!courseExist){
        res.status(404).send("The course with the given ID was not found");
    }
    else{
        if(req.body.id != req.params.id){
            res.send("Request ID is not equal to JSON ID!")
        }
        else{
        //var previous = courses[req.body.id - 1].name;
        courses[req.body.id - 1].name = req.body.name;
        //finds the specific course
        var selectedCourse = "Empty";
        for(course of courses){
            if(course.id == req.params.id){
                selectedCourse = course;
            }
        }
        res.send(courses);
        //console.log("changed " + previous + " to " + req.body.name);   
        }
    }          
});
//HTTP DELETE requests
app.delete('/api/courses/:id', (req,res)=>{
    //code the following logic
    //look up the course by id
    //return 404 if does not exist
    //delete the course by index HINT: use the indexOf() and splice() methods
    // return the response to the client the course that was deleted

    //finds if course id exists
    const courseExist = courses.find(c=> c.id === parseInt(req.params.id));
    if(!courseExist){
        res.status(404).send("The course with the given ID was not found");
    }
    else{
        if(req.body.id != req.params.id){
            res.send("Request ID is not equal to JSON ID!")
        }
        else{
            //finds the index of the course that matches the ID and then splices the index (removes)
            var removedCourse = courses.find(c => c.id == req.params.id)
            console.log(courses.indexOf(removedCourse));
            console.log(courses.splice(courses.indexOf(removedCourse),1));
            res.send(courses);
        }
    }  


});
*/

app.listen(3000,()=>{
    console.log("Listening on port 3000 ... ");
})
