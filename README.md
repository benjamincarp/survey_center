# survey_center

This is a simple survey tool built to give potential employers a look at some code I've written.
It will present the user with a quesiton and some possible answers, once the user has selected an answer they can submit and see the results of that quesiton so far. 

##Unusual Stuff
Based on the timeframe and purpose of this project I did do a couple of things differently than I normally would:
- I would ususally use bower for my client side components and add the js.lib folder ot my .gitignore but, today bower and require were not being friends so I just got rid of bower all together and put the needed .js files in my repo for easy start up
- I would probably use a client side framework for most web apps, but since the requirement only called for one page with a couple of ajax calls I decided to just do it with a couple of helpers and jQuery
- I would definitely put more error handling in the front end in a real application but since that isn't really the focus here, I just log them to the console.

##Setup
You should be able to clone this repo, install and start mongoDB, run npm install, and be good to go. You will need to populate a question and some answers before the site is ver useful though. The easiest way to do that is to use your favorite REST client (I use Postman) to:
- send a quesiton to http://localhost:3000/api/quesitons with the quesiton itself in the 'text' field of an x-www-form-encoded POST request. 
- get your ID from the returned JSON 
- now send a series of POST requests to http://localhost:3000/api/quesitons/[questionID]/answers with the answer in the 'text' field and optionally a number used for quesiton sorting in the 'sort_order' field

##Use
At this point you are ready to run the client and answer the question to see what the results are so far. Note that if you create more than one quesiton in the database the client will just show you one of them. Having it randomize which question it shows would be a fun little addition but I haven't done that yet.

You could also play around more with the API if you like to get/edit/delete questions and answers or get/create/delete responses to the answers at http://localhost:3000/api/quesitons/[questionID]/answers/[answerID]/responses. The api is possibly a little overbuilt for this example but I built it with the idea that it would be the basis for something bigger than the current client.

Any feedback on this project is welcome. Thanks for checking it out.
 

