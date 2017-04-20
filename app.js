//Movie Network App

$(document).ready(function(){
  
  var moviesURL = 'https://api.themoviedb.org/3/search/person?api_key=c523ca485fcd8c30e9105dd1f691321f';

  //Firstfunction called to start the app.  
  
  filterResults();

  //Event handler receives input and gets matching results.
  function filterResults() {
    $('.js-search-form').submit(function(event) {
      event.preventDefault();
      var userInput = $(this).find('.js-query').val();
      console.log(userInput);
      getNamesFromApi(userInput);
    });

  }

  //Makes the query using the user input.

  function getNamesFromApi(userInput) {
    var query = {
      query: userInput,
    }

    $.getJSON(moviesURL, query, displayOptions);
  }

  //Displays initial clickable results for a further filtering by the user.

  function displayOptions(data) {
    
    var resultNames = '';
    
    var namesOptionsHeader = `<h2>The following are results for your search:</h2>
                              <h3>Please narrow your search by choosing one of the following names:</h3>`

    $('.landing-page').remove();

    var resultPageSetup = `<div id="background2">
                           <img src="http://kingofwallpapers.com/film/film-015.jpg">
                           </div>`

    $('.results').prepend(resultPageSetup);                         
    $('.js-search-results-headings').html(namesOptionsHeader);
    
    //For each matching object--Name and actor ID is shown
    if (data.results) {
      
      data.results.forEach(function(searchNames){
        var nameOf = (searchNames.name);
        var actorId =(searchNames.id); 
               
        resultNames += `<li actorId='${actorId}' class="selection"><p class="name">${nameOf}</p></li>`;
      });
    }
    
    else {
      resultNames += '<p>No results</p>';
    }

    $('.js-search-results').html(resultNames);


    //Makes each <li> tag clickable and redirects to the final display to include a filmography
    //with summary info and a list of all cast and crew that selected person has been credited with.

  finalDisplaySetup();
  };

  //------------------------------------------------------------------- 

  function finalDisplaySetup() {
    $('.selection').click(function() {
      var selPerson= this.innerText
      console.log(selPerson);
      var selActorId = ($(this).attr("actorid"));
      console.log(selActorId);
      
                          
      var filmographyURL ='https://api.themoviedb.org/3/person/'+selActorId+'/movie_credits?api_key=c523ca485fcd8c30e9105dd1f691321f&language=en-US';
  
      //Makes the call to the api to get movie credits based on the actor id.
      //data passed into the function includes titles, film id, job/role for cast and crew. 
     
      $.getJSON(filmographyURL).done(function displayFilms(data) {
        var resultFilms = '';
        var filmographyHeader = `<h1>${selPerson}</h1>
                             <h2>Known For:</h2>`

        $('.js-search-results-headings').html(filmographyHeader);
        

        //This will be an array of films the actor or crew member has been involved in.

        var filmIds=[]
   

        if (data.crew||data.cast)  {
      
          data.crew.forEach(function(films){
            var titleOf = (films.title);
            var job =(films.job);
            var filmId =(films.id);
            var poster = (films.poster_path);

            console.log(poster);
            console.log(titleOf);
            console.log(job);
            console.log(filmId);
               
            resultFilms += `<div class="film-boxes">
                            <li class="poster"><img src=https://image.tmdb.org/t/p/w500`+poster+ `></li>
                            <li class="movie">${titleOf}</li>
                            <li class="job">(${job})</li>
                            </div>`;
            
            filmIds.push({filmId:filmId});

          

          });

          data.cast.forEach(function(films){
            var titleOf = (films.title);
            var filmId =(films.id);
            var role=(films.character);
            var poster = (films.poster_path);

            console.log(poster);
            console.log(titleOf);
            console.log (role);
            console.log(filmId);
               
            resultFilms += `<div class="film-boxes">
                            <li class="poster"><img src=https://image.tmdb.org/t/p/w500`+poster+ `></li>
                            <li class ="movie">${titleOf}</li>
                            <li class="role">(${role})</li>
                            </div>`;
            
            filmIds.push({filmId:filmId});

          });

          //Ends this section which builds the filmIds array of films the person has been involved in.

          console.log(filmIds);

          //based on film ids we iterate to get the credits and the subsequent cast and crew list

          
//============================================================================
          var castAndCrewColleagues = [];

          Promise.all(filmIds.map(function(objects){
            console.log(data);
            var filmId = objects.filmId;
            var castsAndCrewsURL= 'https://api.themoviedb.org/3/movie/'+filmId+'/credits?api_key=c523ca485fcd8c30e9105dd1f691321f';

              return $.getJSON(castsAndCrewsURL);

          })).then(function(data){   
                console.log(data);

//This function will get specific values from properties in the array of objects

                function getFields(input, field) {
                  
                  for (var i=0; i < input.length ; ++i)
                  castAndCrewColleagues.push(input[i][field]);
                  return castAndCrewColleagues;
                }
//------------------------------------------------------------------------------------
                
                for (var i=0; i < data.length; ++i){
                  getFields(data[i].cast,"name");
                  getFields(data[i].crew,"name");
                  }

              console.log(castAndCrewColleagues); 

              function sortByFrequencyAndRemoveDuplicates(array) {
                var frequency = {}, value;

                // compute frequencies of each value
                for(var i = 0; i < array.length; i++) { 
                    value = array[i];
                    if(value in frequency) {
                        frequency[value]++;
                    }
                    else {
                        frequency[value] = 1;
                    }
                }

                // make array from the frequency object to de-duplicate
                var uniques = [];
                for(value in frequency) {
                    uniques.push(value);
                }

                // sort the uniques array in descending order by frequency
                function compareFrequency(a, b) {
                    return frequency[b] - frequency[a];
                }

                return uniques.sort(compareFrequency);
              }

              sortedListFreq = sortByFrequencyAndRemoveDuplicates(castAndCrewColleagues);
              console.log(sortedListFreq  );


              $('.cast-crew-final-result-title').append('The person you have selected has worked with the following people:');
            
                sortedListFreq.forEach(function(persons) {
              
                  var resultPeople = '';
                  resultPeople += `<li class="person">${persons},`+" "+`</li>`;
                
                  $('.cast-crew-final-result').append(resultPeople);
                });
              }); 
              
//=====================================================================================
        };

        $('.js-search-results').html(resultFilms);
      });        
          
    });      
  }; 
});

//=====================================================================================  

  