
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var Factual = require('factual-api');
/**
 * Module dependencies.
 */
var email   = require("emailjs/email");
var server  = email.server.connect({
   user:    "programcse@gmail.com", 
   password:"Irons1234", 
   host:    "smtp.gmail.com", 
   ssl:     true

});

// send the message and get a callback with an error or details of the message that was sent


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
    var nameSchema= mongoose.Schema({ 'gid': String, 'eventname': String, 'description': String,'location': String});
app.post('/createGroup', function(req, res){
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
        mongoose.disconnect();

    mongoose.connect('mongodb://nodejitsu_ashwin:feoabslm45a25skg4og08p20cn@ds047008.mongolab.com:47008/nodejitsu_ashwin_nodejitsudb671361030');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
    console.log("Connected");
    search_form = req.body;  
    console.log(search_form.gid);
    var Name = mongoose.model('groups',nameSchema);
    valueId=search_form.gid;
    var query = Name.find('{gid:valueId}');
    query.execFind(function(err,user)
    { 
      if(err)
      console.log("error");
    else
      console.log(user);
    });
    var row1=new Name({'gid':search_form.gid,'eventname':search_form.eventName,'description':search_form.description,'location': search_form.location});
    message={};
     row1.save(function(err,random)
    { 
    if (err) 
    console.log("failed");
    else
    {
      console.log("saved");
      //emailList = (search_form.email).split(",");
    server.send({
   text:    search_form.description+" Use the link below to join your group\nUrl link: http://groupdine.site44.com/group.html?gid="+search_form.gid, 
   from:    "programcse@gmail.com", 
   to:      search_form.email,
   cc:      "",
   subject: "Group Dine invitation"
}, function(err, message) { console.log(err || message); });
  }
    });
     
     res.send(message);
 //res.send(restaurantJSON);
  });
    });

app.post('/groupDetails', function(req, res){
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
        mongoose.disconnect();

    mongoose.connect('mongodb://nodejitsu_ashwin:feoabslm45a25skg4og08p20cn@ds047008.mongolab.com:47008/nodejitsu_ashwin_nodejitsudb671361030');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
    console.log("Connected");
    search_form = req.body;  
    var Name = mongoose.model('groups',nameSchema);
    valueId=search_form.gid;
    console.log(valueId);
    var query = Name.find().where('gid').equals(valueId);
    query.execFind(function(err,user)
    { 
      if(err)
      console.log("error");
    else
      console.log(user);
     res.send(user);

    });
     
     //res.send(message);
  });
    });
var peopleSchema= mongoose.Schema({ 'gid': String, 'name': String, 'preference': []});
var Name = mongoose.model('persons',peopleSchema);


app.post('/addPeople', function(req, res){
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
        mongoose.disconnect();

    mongoose.connect('mongodb://nodejitsu_ashwin:feoabslm45a25skg4og08p20cn@ds047008.mongolab.com:47008/nodejitsu_ashwin_nodejitsudb671361030');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
    console.log("Connected");
    search_form = req.body;  
    valueId=search_form.gid;
    console.log(valueId);
    console.log(search_form.fname);
        var row1=new Name({'gid':search_form.gid,'name':search_form.fname,'preference':search_form.preference});
    message={};
     row1.save(function(err,random)
    { 
    if (err) 
    console.log("failed");
    else
    {
      console.log("saved");
      console.log(random);
    }
    });
     
     res.send(message);
  });
    });

app.post('/peopleinGroup', function(req, res){
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
        mongoose.disconnect();

    mongoose.connect('mongodb://nodejitsu_ashwin:feoabslm45a25skg4og08p20cn@ds047008.mongolab.com:47008/nodejitsu_ashwin_nodejitsudb671361030');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
    console.log("Connected");
    search_form = req.body;  
    //var Name = mongoose.model('persons',nameSchema);
    valueId=search_form.gid;
    console.log(valueId);
    var query = Name.find().where('gid').equals(valueId);
    query.execFind(function(err,user)
    { 
      if(err)
      console.log("error");
    else
      console.log(user);
     res.send(user);

    });
     
     //res.send(message);
  });
    });
app.listen(3000);
