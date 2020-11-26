// Codded By Mrityunjay

const express = require('express');
const bodyParser = require('body-parser'); //module used to get the input value in the server
const http = require('http');//module used for http request to the marvel api

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));//folder used to store the static files
app.set('view engine', 'html');//HTML View Engine for rendring to frontend
app.set('views', __dirname);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

app.post("/characterinfomation", (req, res) => {
  const cName = req.body.cName; //value of user input field
  const urlcName = cName.replace(" ", "%20"); //replaced space to %20 so that it can be used in the url

  //Marvel API Auth
  const apikey = "public_Key"; //here goes the public api key of the Marvel API
  const hash =  "md5_digest_hash_key"; //here goes the md5 digest hash of Marvel API
  //Marvel API URL
  const url  = `http://gateway.marvel.com/v1/public/characters?name=${urlcName}&ts=1&apikey=${apikey}&hash=${hash}`

  //https get request to fetch the data
  http.get(url, (response) => {
    var body = "";

    response.on("data", (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      var result = JSON.parse(body);


      if (result.code === 200 && typeof(result.data.results[0]) != "undefined") { //Checking for the status code to be OK or any incorrect input value

        // Data From the API
        const resCName = result.data.results[0].name;

        var resDes;
        //Checking if a description exist
        if(result.data.results[0].description == ""){
          resDes = "Sorry, description not found.";
        }else{
          resDes = result.data.results[0].description;
        }

        const resImg = result.data.results[0].thumbnail.path + "/portrait_xlarge.jpg";

        // Rendring HTML Document
        const resultPage = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- displays site properly based on user's device -->

            <link rel="icon" href="${resImg}">

            <title>${resCName} | Know Your Hero</title>

            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css"
            integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M"
            crossorigin="anonymous">

            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Bree+Serif&family=Noto+Sans&display=swap" rel="stylesheet">

            <link rel="stylesheet" href="characterInformation.css">

          </head>
          <body>

            <header>
              <h1>Know ${resCName}</h1>
            </header>

            <main>
              <section class="mainContainer">

                <div class="imgContainer">
                  <img src="${resImg}" alt="">
                </div>

                <div class="txtContainer">

                  <div class="cNameContainer">
                    ${resCName}
                  </div>

                  <div class="cDesContainer">
                    ${resDes}
                  </div>

                </div>

              </section>

              <form class="redirectForm" action="/redirect" method="post">
                <button type="submit" name="submit" class="bubbly-button">Go Back</button>
              </form>

            </main>

            <script type="text/javascript" src="animationCI.js"></script>
          </body>
        </html>
`;

        res.send(resultPage);

      }else{
        res.send("error");
      }


    });

  });


});

app.post("/redirect", (req, res) => {
  setTimeout( () => {
    res.redirect("/")
  }, 1200);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000")
});
