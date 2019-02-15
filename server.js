const express = require( "express" );
const hbs = require( "hbs" );
const fs = require( "fs" );

// Allows heroku to set the port
const port = process.env.PORT || 3000;

var app = express();

app.set( "view engine", "hbs" );

// Register the folder location where "partial" snippets are stored
hbs.registerPartials( __dirname + "/views/partials" );

// Middleware
app.use( ( request, response, next ) => {
  var now = new Date().toString();

  var log = `${now}: ${request.method} ${request.url}`;
  console.log( log );

  fs.appendFileSync( "server.log", `${log}\n`, ( error ) => {
    console.log( "There was an error when loggging the transaction." );
  } );

  next();
} );

// app.use( ( request, response, next ) => {
//   response.render( "maintenance.hbs" );
// } );

// __dirname is provided by node's wrapper function
// This is for all public, static pages, so /public
// is not actually included in the URL. To access the
// help.html file in this directory, use an URL like:
// http://localhost:3000/help.html
app.use( express.static( __dirname + "/public") );

hbs.registerHelper( "getCurrentYear", () => new Date().getFullYear() );
hbs.registerHelper( "screamIt", ( text ) => {
  return text.toUpperCase();
} );

app.get( "/", ( request, response ) => {
  response.render( "home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome in, y'all! Set yerself right down and have some vittles!",
  } );
} );

app.get( "/about", ( request, response ) => {
  // .render passes the page first through a parser to populate it per our template
  response.render( "about.hbs", {
    pageTitle: "About Page",
  } );
} );

app.get( "/projects", ( request, response ) => {
  response.render( "projects.hbs", {
    pageTitle: "Projects Page",
  } );
} );

app.get( "/bad", ( request, response ) => {
  response.send({
    errorMessage: "Unable to fulfill this request",
  } );
} );

app.listen( port, () => {
  console.log( `Server is up on port ${port}` );
} );
