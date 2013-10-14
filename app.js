
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Factual = require('factual-api');
/**
 * Module dependencies.
 */


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
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/restaurantFinder', function(req, res){
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    var resJSON;
   var factual = new Factual('uQS3leKgmggjsYBVQeiTGaOp8VcIcZzRjnAzi2rZ', 'P3kbXUe19xcMwYtpNmomGzjb851HfceurUrZbYdc');
   search_form = req.body;  
   console.log(search_form.cuisine);
   cuisineList = (search_form.cuisine).split(" ");
    console.log(cuisineList.length);
    // <-- search items
    if(cuisineList.length==1)
        var url='/t/restaurants-us?filters={"$and":[{"cuisine":{"$eq":"'+cuisineList[0]+'"}},{"locality":"'+search_form.locality+'"}]}';
    if(cuisineList.length==2)
        var url='/t/restaurants-us?filters={"$and":[{"cuisine":{"$eq":"'+cuisineList[0]+'"}},{"cuisine":{"$eq":"'+cuisineList[1]+'"}},{"locality":"'+search_form.locality+'"}]}';
    if(cuisineList.length==3)
        var url='/t/restaurants-us?filters={"$and":[{"cuisine":{"$eq":"'+cuisineList[0]+'"}},{"cuisine":{"$eq":"'+cuisineList[1]+'"}},{"cuisine":{"$eq":"'+cuisineList[2]+'"}},{"locality":"'+search_form.locality+'"}]}';
    if(cuisineList.length==4)
        var url='/t/restaurants-us?filters={"$and":[{"cuisine":{"$eq":"'+cuisineList[0]+'"}},{"cuisine":{"$eq":"'+cuisineList[1]+'"}},{"cuisine":{"$eq":"'+cuisineList[2]+'"}},{"cuisine":{"$eq":"'+cuisineList[3]+'"}},{"locality":"'+search_form.locality+'"}]}';
    if(cuisineList.length==5)
       var url='/t/restaurants-us?filters={"$and":[{"cuisine":{"$eq":"'+cuisineList[0]+'"}},{"cuisine":{"$eq":"'+cuisineList[1]+'"}},{"cuisine":{"$eq":"'+cuisineList[2]+'"}},{"cuisine":{"$eq":"'+cuisineList[3]+'"}},{"cuisine":{"$eq":"'+cuisineList[4]+'"}},{"locality":"'+search_form.locality+'"}]}';
      console.log(url);
       factual.get(url, function (error, items) {
  console.log(items.data);
  console.log(items.included_rows);
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
