/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var email = require('./routes/email');

var Factual = require('factual-api');

var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
 if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
app.post('/sendEmail/:data', email.sendEmail);
app.post('/restaurantFinder', function(req, res){
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    var resJSON;
   search_form = req.body;  
   console.log(search_form.cuisine);
   myList = (search_form.cuisine).split(" ");
    console.log(myList[0]);
    console.log(typeof(myList[0]));// <-- search items
   var factual = new Factual('uQS3leKgmggjsYBVQeiTGaOp8VcIcZzRjnAzi2rZ', 'P3kbXUe19xcMwYtpNmomGzjb851HfceurUrZbYdc');
       factual.get('/t/restaurants-us?filters={"$and":[{"cuisine":{"$eq":"American"}},{"cuisine":{"$eq":"Italian"}},{"locality":"Evanston"}]}', function (error, items) {
  console.log(items.data);
  console.log("\n");
  console.log("Recommended Restaurants");
  console.log("-----------------------\n")
  restaurantJSON= {"details":[]};
  for(i=0; i<items.included_rows;i++)
  { 
    console.log((i+1)+") "+items.data[i].name+"\nAddress: "+items.data[i].address+"\nCuisines served: "+ items.data[i].cuisine+"\nPrice range: "+items.data[i].price+"\nRating: "+items.data[i].rating+"\nTelephone Number: "+items.data[i].tel+"\nWebsite: "+ items.data[i].website);
    restaurantJSON.details[i]={"name":items.data[i].name,"address":items.data[i].address,"cuisine":items.data[i].cuisine,"price":items.data[i].price,"rating":items.data[i].rating,"telephone": items.data[i].tel,"website":items.data[i].website};
    console.log(restaurantJSON.details[i].cuisine);
    console.log("\n");     

  }
  console.log(restaurantJSON);
  //var restaurantJSON= JSON.stringify(restaurant);
  //console.log(restaurantJSON);
  //res.send(restaurant);
  res.send(restaurantJSON); 
});
  
});
app.listen(3000);