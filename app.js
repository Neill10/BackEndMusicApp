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
        res.send(req.body.genreID + " does not Exist!");
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

/*
short reflection as a JS comment in which you explain 
(1) how programs communicate in what order to each other for a given purpose, 
(2) what you learned in this project and 
(3) how can this project be further extended.

    1.Programs communicate to each other by listening for requests. 
    When they receive a request, they focus on the params and then determine what to send back using backend code.
    2.I learned how write GET POST PUT DELETE requests. 
    I also learned the small nuances that are handy when writing HTTP relevant code like req.body or req.params
    3.This project can be further extended by adding more/better filters when searching for songs. I can also make the HTTP requests more intuitive
*/