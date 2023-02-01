const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello there this is localhost 3000!');
});

//Arrays (DataBase)
const genres = [
    {id:1, genre: 'pop'},
    {id:2, genre: 'hip hop'},
    {id:3, genre: 'rap'},
    {id:4, genre: 'classical'},
    {id:5, genre: 'rock'},
    {id:6, genre: 'jazz'},
    {id:7, genre: 'blues'},
    {id:8, genre: 'electronic'},
];
//a database for users to add songs to a genre using their genre (multiple of the same genre)
//Requirements would be genre, id(count), name, year, month (not implemented yet)
const songs = [
    {genre: 'pop', id: 1, name: "bruh"},
    {genre: 'rock', id:1, name: "hmmm"},
    {genre: 'pop', id:2, name:"We didn't start the Fire"},
    /*
    {id:5, name ="bruh"},
    {id:6, name ="huh"},
    {id:5, name ="oof"},
    {id:6, name ="wow"},
    */
];

//GET REQUESTS

//Gets the Home page (Welcome Screen!)
app.get("/api/home",(req,res)=>{
    res.send("Welcome to Music App")
});
//Gets the list of genres available
app.get("/api/home/genres",(req,res)=>{
    res.send(genres);
})

//Gets the all songs of a genre using genre name
app.get("/api/home/genres/:genre",(req,res)=>{
    //finds if the genre exists
    //console.log(genres.find(g=> g.genre === req.params.genre));
    const genreExist = genres.find(g=> g.genre === req.params.genre);
    //console.log(genreExist);
    if(!genreExist){
        res.send("Genre Does Not Exist");
    }
    else{
        //if the genre exits, find search it is empty or not
        if(!findGenreSongs(genres.find(g=> g.genre).id)){
            res.send("Your Genre is Empty! Go to POST to add some songs! :D");
        }
        else{
            //console.log("genre " + req.params.genre +" found")
            res.send(returnGenreSongs(genreExist.genre));
        }
    }
})

//will get a sorted list of songs
app.get("/api/home/songs",(req,res)=>{
    sortSongByGenre();
    res.send(songs);
})
/*

//Gets the songs of a genre using ID
//CONFLICTS WITH GETTING SONGS USING GENRE NAME
app.get("/api/home/genres/:id",(req,res)=>{
    //finds if the genre exists
    console.log(genres.find(g=> g.id));
    const genreExist = genres.find(g=> g.id === parseInt(req.params.id));
    //console.log(genreExist);
    if(!genreExist){
        res.send("Genre Does Not Exist");
    }
    else{
        //if the genre exits, find search it is empty or not
        if(!findGenreSongs(genres.find(g=> g.genre).id)){
            res.send("Your Genre is Empty! Go to POST to add some songs! :D");
        }
        else{
            console.log("genre " + req.params.id +" found")
            res.send(genres.find(g=> g.name));
        }
    }
})
*/

//POST REQUESTS

//posts new "songs" into songs 
//Has a req.params.genre and req.body.songName
app.post("/api/home/genres/:genre",(req,res)=>{
    //checks to see if the given genre exists
    const genreExist = genres.find(g=> g.genre === req.params.genre);
    if(!genreExist){
        res.send(req.params.genre + " genre does not exist");
    }
    else{
        //checks to see if the songs already exists in a SPECIFIC GENRE (that means multiples songs of same name but different genres)
        const songExist = songs.find(s=> s.name === req.body.songName && s.genre === genreExist.genre);
        if(songExist){
            res.send(req.body.songName + " song already exists for this genre");
        }
        //this means we will add songs
        else{
            const song ={
                //we assign an genre and a name property
                genre: genreExist.genre,
                id: songCounterGenre(genreExist.genre) + 1,
                name: req.body.songName,
            }
            songs.push(song);
            res.send(song);
            //res.send(returnGenreSongs(genreExist.genre));

        }
        
    }
    
});

//posts new "genres" into genres
//has a req.body.newGenre
app.post("/api/home/genres",(req,res)=>{
    //checks to see if the given genre exists
    const genreExist = genres.find(g=> g.genre === req.body.newGenre);
    if(!genreExist){
        var genreCount = genres.length;
        const genreToAdd = {
            id: genreCount + 1,
            genre: req.body.newGenre,
        };
        genres.push(genreToAdd);
        res.send(genreToAdd);
    }
    else{
        res.send(req.body.newGenre + " genre already exist");
    }
});

//PUT REQUESTS

//@returns all the genres with the replaced genre
//replaces a genre; has two req.body params (idOfOldGenre and newGenre)
app.put("/api/home/genres",(req,res)=>{
    //finds the id of the genres thats about to be replaced
    const genreExist = genres.find(g=> g.id === parseInt(req.body.idOfOldGenre));
    if(!genreExist){
        res.send(req.body.idOfOldGenre + " genre ID does not exist.");
    }
    else{
        var temp = genres[req.body.idOfOldGenre - 1].genre;
        genres[req.body.idOfOldGenre - 1].genre = req.body.newGenre;
        //now we have to sync up the new genre to old genre songs 
        for(song of songs){
            if(song.genre == temp){
                song.genre = req.body.newGenre;
            }
        }
        res.send(genres);
    }
});

//DELETE REQUESTS

//@returns all the genres without deleted genre (should move all genre ID's accordingly and delete songs connected to a genre)
//deletes a genre, has one req.body(genreID)
app.delete("/api/home/genres",(req,res)=>{
    const genreExist = genres.find(g=> g.id === parseInt(req.body.genreID));
    if(!genreExist){
        res.send(req.params.genreID + " does not Exist!");
    }
    else{
        res.send(genreExist);
        //removes the genre that makes with genreExist
        for(var i = 0; i < genres.length; i++){
            if(genres[i].genre == genreExist.genre){
                genres.splice(i,i+1);
                break;
            }
        }
        //removes all the songs connected to genreExist
        for(var i = 0; i < songs.length; i++){
            if(songs[i].genre == genreExist.genre){
                songs.splice(i,i+1);
            }
        }
        //changes all the ids back to numerical order.
        for(var i = 0; i < genres.length; i++){
            genres[i].id = i + 1;
        }

    }
})

//deletes a song from a genre
// have a req.params.genre and req.body.songName
app.delete("/api/home/genres/:genre",(req,res)=>{
    //searches if the genre exists
    const genreExist = genres.find(g=> g.id === parseInt(req.params.genre));
    if(!genreExist){
        res.send(req.params.genreID + " does not Exist!");
    }
    else{
        //searches if the song exists in the specific genre
        const songExist = songs.find(s=>s.name === req.body.songName && s.genre === req.params.genre);
        if(!songExist){
            res.send(req.body.songName + " does not Exist!");
        }
        else{
            //removes the specific song
            for(var i = 0; i < songs.length;i++){
                if(song[i].name == req.body.songName){
                    song.splice(i,i+1);
                    break;
                }
            }
            //reorganizes songIDs (numerical order)
            var count = 1;
            for(song of songs){
                if(song.genre === req.params.genre){
                    song.id = count;
                    count++;
                }
            }
            res.send(songs);
        }
    }
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

//FUNCTIONS 

//returns true if a genre has songs by looking at songs ID with genre ID
function findGenreSongs(id){
    const songsExist = songs.find(s=> s.id === parseInt(id));
    if(!songsExist){
        return false;
    }
    else{
        return true;
    }
}

//required that there are song in songs and genre exists (might have to change param to a string)
function returnGenreSongs(genreName){
    var songList = [];
    for(song of songs){
        if(song.genre == genreName){
            songList.push(song);
        }
    }
    return songList;
}

function sortSongByGenre(){
    //sorts the songs by genre
    songs.sort(function(a, b) {
        const songA = a.genre.toUpperCase(); // ignore upper and lowercase
        const songB = b.genre.toUpperCase(); // ignore upper and lowercase
          
      // sort in an ascending order
        if (songA < songB) {
          return -1;
        }
        if (songA > songB) {
          return 1;
        }
      
        // names must be equal
        return 0;
      });
}

//returns the number of songs in a genre
function songCounterGenre(genreName){
    var count = 0;
    for(song of songs){
        if(song.genre == genreName){
            count++;
        }
    }
    return count;
}

