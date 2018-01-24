const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
   



//setup template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//serving static files
app.use(express.static(__dirname + '/public'));


//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// connecting to mongodb

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/OEKS';
const objectId= require('mongodb').ObjectId;


MongoClient.connect(mongoURL, function(err, db){
	
	if (err){
		console.log(err);
	} else {
		console.log("Conected successfully");
	}	
	data = db.collection('data');
});

app.get('/', function(req, res){
		res.render('index');
});





app.get('/add', function(req, res){
	data.find({}).toArray(function(err, docs){
		if(err){
			console.log(err);
		}
		res.render('add', {docs: docs});
	});
	
	
});




app.get('/data/:id', function(req, res){
	var id = objectId(req.params.id);
	data.findOne({_id: id}, function(err, doc){
		if(err){
			console.log(err);
		}
		res.render('show',{ doc : doc });
	});
	
});

app.post('/data/add', function(req, res){
		var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	
		data.insert({title: req.body.title, author: req.body.author, description: req.body.description, source: req.body.images, date: utc}, function (err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/view');
	});
	
});

app.get('/data/edit/:id', function(req, res){
	var id = objectId(req.params.id);
	data.findOne({_id: id}, function(err, doc){
		if(err){
			console.log(err);
		}
		res.render('edit', {doc: doc});
	
	});
	
});
//updaten ne input te titles
app.post('/data/update/:id', function(req, res){
	var id = objectId(req.params.id);
	var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	data.updateOne({_id: id}, {$set: {title: req.body.title, author: req.body.author, description: req.body.description, source: req.body.images, date: utc}}, function(err, result){
		if(err){
			console.log(err);
		}else{
		res.redirect('/view');
		}
	});
	
});

app.get('/data/delete/:id', function(req, res){
	var id = objectId(req.params.id);
	data.deleteOne({_id: id}, function(err, result) {
		if(err){
			console.log(err);
		}else{
		res.redirect('/view');
		}
		
	});
	
	
	
});


app.post('/addArticle', function(req, res, next){
	var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');

		data.insert({title: req.body.title, author: req.body.author, description: req.body.description, source: req.body.images, date: utc}, function (err, result){
		
		if(err){
			console.log(err);
		}
		res.redirect('/view');
	});
	
	
	
});

app.get('/view', function(req, res){
	data.find({}).toArray(function(err, docs){
		if(err){
			console.log(err);
		}
		res.render('view', {docs: docs});
	});
	
	
});



app.get('/contact', function(req, res){
	
	res.render('contact');
});

app.post('/contactus', function(req, res){
	var fname = req.body.firstname;
	var lname =	req.body.lastname;
	var state =  req.body.country;
	var subject = req.body.subject;
	
	console.log(fname +  " ; " + lname + " ; "+ state + "; " +subject );
	res.redirect('/');
});



app.listen(3000,function(){
	console.log(" Running at http://localhost:3000");
});