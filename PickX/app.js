var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var conf = require('./config.json');
var abi = require('../StewdentApplication/build/contracts/StewdentApplication.json');
var Web3 = require('web3');
var contract = require ('truffle-contract');
var BigNumber = require('bignumber.js');
var Url = require('url');
var http = require('http');

var request = require('request');

var provider = new Web3.providers.HttpProvider(conf.provider);
console.log("Provider: " + conf.provider);
var web3 = new Web3(provider);
var MyContract = contract(abi);
MyContract.setProvider(provider);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//Initialize user data
var userDataArray = [];

var user1 = {};
user1['attr1'] = '86';
user1['attr2'] = '79';
user1['attr3'] = '90';
user1['attr4'] = '70';
user1['attr5'] = '100';
user1['applied'] = false;
user1['gender'] = "Male";
user1['cgpa'] = 3.75;
user1['uid'] = 1001;
user1['firstName'] = "John";
user1['lastName'] = "Doe";
user1['email'] = "johndoe@mail.com"
user1['entryYear'] = 2019;
userDataArray.push(user1);

var user2 = {};	
user2['attr1'] = '60';
user2['attr2'] = '80';
user2['attr3'] = '74';
user2['attr4'] = '57';
user2['attr5'] = '100';
user2['applied'] = false;
user2['gender'] = "Female";
user2['cgpa'] = 3.85;
user2['uid'] = 1001;
user2['firstName'] = "Charlotte";
user2['lastName'] = "Dawkins";
user2['email'] = "dcharlotte@mail.com"
user2['entryYear'] = 2018;
userDataArray.push(user2);

var user3 = {};	
user3['attr1'] = '92';
user3['attr2'] = '88';
user3['attr3'] = '79';
user3['attr4'] = '85';
user3['attr5'] = '100';
user3['applied'] = false;
user3['gender'] = "Female";
user3['cgpa'] = 3.20;
user3['uid'] = 1002;
user3['firstName'] = "Susan";
user3['lastName'] = "Hopkins";
user3['email'] = "susanhop@mail.com"
user3['entryYear'] = 2020;
userDataArray.push(user3);

app.get('/', function(req, res, next){
	res.render('index',{ title : "Home" });
});

app.get('/listUniversity', function(req, res, next){
	res.render('portfolio',{ title : "Select a University"});
});

app.get('/apply', function(req, res, next){
	res.render('apply',{ title : "Apply for Placement"});
})

app.get('/applyUniversity', function(req, res, next){
	console.log("Option:" + req.query.option);
	if(req.query.option <= userDataArray.length){
		var uid = userDataArray[req.query.option -1]['uid'];
		var gender = userDataArray[req.query.option - 1]['gender'];
		var cpga = Math.floor(userDataArray[req.query.option - 1]['cgpa'] * 100);
		var targetUser = (userDataArray[req.query.option - 1]);
		var url = 'https://script.google.com/macros/s/AKfycbwkjRWRF9GXsnQJiBVyDWJyZk43ESDuAtUiRlsDn16FMRoMlD4/exec'
		request.post({url: url, followAllRedirects: true,
			form:
				{
					ID : 100,
					attr1 : targetUser['attr1'],
					attr2 : targetUser['attr2'],
					attr3 : targetUser['attr3'],
					attr4 : targetUser['attr4'],
					attr5 : targetUser['attr5']
				}
		},
		function(err, httpResponse, body){
			if(err){
				console.error(err);
				res.send("An Error Occured");
			}
			var rank = body;
			MyContract.deployed().then(function(stewdentApplication){
				var idCreated = stewdentApplication.apply(uid, gender, rank, cpga, {
					value: web3.toWei(0.02006903748896203,'ether'),
        			from: "0x54aeFDc5Beb413854c02fc0F29c8eba2542D9ceC",
					gas: 3000000
			})
			.then(function(result){
				console.log(result);
			});
				idCreated.then(function(result){
					console.log(result);
				});
			});	
			res.redirect("showApplications");
			}
		);
	}else{
		res.send("An Error Occured");
	}
});

app.get('/editProfile', function(req, res, next){
	console.log(req.body);
	var option = req.query.option;
	console.log("Option chosen: " + option);
	var user = userDataArray[option - 1];
	res.render('info', {
		option : option,
		firstName : user['firstName'],
		lastName : user['lastName'],
		gender : user['gender'],
		email : user['email'],
		entryYear : user['entryYear'],
		cgpa : user['cgpa'],
		attr1 : user['attr1'],
		attr2 : user['attr2'],
		attr3 : user['attr3'],
		attr4 : user['attr4']
	});
});

app.get('/saveProfile', function(req, res, next){
	var option = req.query.option;
	var firstName = req.query.Firstname;
	var lastName = req.query.Lastname;
	var gender = req.query.gender;
	var email = req.query.Email;
	var entryYear = req.query.entry_year;
	var cgpa = req.query.cgpa;
	var attr1 = req.query.attr1;
	var attr2 = req.query.attr2;
	var attr3 = req.query.attr3;
	var attr4 = req.query.attr4;

	console.log(option);
	console.log(firstName);
	console.log(lastName);
	console.log(gender);
	console.log(email);
	console.log(entryYear);
	console.log(cgpa);
	console.log(attr1);
	console.log(attr2);
	console.log(attr3);
	console.log(attr4);

	userDataArray[option - 1]['firstName'] = firstName;
	userDataArray[option - 1]['lastName'] = lastName;
	userDataArray[option - 1]['gender'] = gender;
	userDataArray[option - 1]['email'] = email;
	userDataArray[option - 1]['entryYear'] = entryYear;
	userDataArray[option - 1]['cgpa'] = cgpa;
	userDataArray[option - 1]['attr1'] = attr1;
	userDataArray[option - 1]['attr2'] = attr2;
	userDataArray[option - 1]['attr3'] = attr3;
	userDataArray[option - 1]['attr4'] = attr4;

	res.redirect('apply');
})

app.get('/countApplicant', function(req, res, next){
	MyContract.deployed().then(function(stewdentApplication){
		var applicantCount = stewdentApplication.getApplicantCount();
		applicantCount.then(function(result){
			console.log(result.toNumber());
			res.send("Result: " + result.toNumber());
		});
	});
});

app.get('/getApplicant', function(req, res, next){
	var index = req.query.index;
	MyContract.deployed().then(function(stewdentApplication){
		var results = stewdentApplication.getApplicant(index);
		results.then(function(result){
			res.send(result [0] + " - " + result[1] + " - " + result[2] + " - " + result[3]);
		})
	})
});

app.get('/showApplications', function(req, res, next){
	var applicationList = [];
	MyContract.deployed().then(function(stewdentApplication){
		var totalCount = stewdentApplication.getApplicantCount();
		totalCount.then(function(resultCount){
			console.log("Total Count: " + resultCount);
			for(var i = 0; i < resultCount ; i++){
				console.log("loop " + i);
				var applicationDetails = stewdentApplication.getApplicant(i);
				var seq = 0;
				applicationDetails.then(function(result){
					var curApplication = {};
					console.log(result[0]);
					if(result[0].toNumber() == 1001){
						curApplication['uid'] = result[0];
						curApplication['id'] = result[1];
						curApplication['gender'] = result[2];
						curApplication['rank'] = result[3]
						curApplication['cgpa'] = (result[4] * 1.0) / 100.0;
						applicationList.push(curApplication);
						console.log(seq + "/" + (resultCount -1));
					}
					if( seq == (resultCount - 1) ){
							console.log("App List Length Inside" + applicationList.length);			
							console.log(applicationList);
							res.render('result', {data : applicationList});
						}
					seq++;
				});
			}
			if(resultCount == 0){
				res.render('result', {data : applicationList});
			}
		});
	});
});

app.get("/update", function(req, res, next){
	var url = Url.parse(req.url, true);
	console.log(url.query);
	res.send(url.query);
	MyContract.deployed().then(function(stewdentApplication){
		stewdentApplication.update("Sample String",{
                    value: web3.toWei(0.02006903748896203,'ether'),
                    from: "0x54aeFDc5Beb413854c02fc0F29c8eba2542D9ceC",
					gas: 3000000
                })
		.then(function(result){
			console.log(result);
			res.send("Done");
		}).catch(function(err){
			console.log(err);
			res.end(err);
		});
	});
});

app.get("/getUrl", function(req, res, next){
	MyContract.deployed().then(function(stewdentApplication){
		var url = stewdentApplication.getUrl();
		url.then(function(result){
			console.log(result);
			res.send("URL: " + result);
		});
	});
});

app.get("/contractBalance", function(req, res, next){
	MyContract.deployed().then(function(stewdentApplication){
		var bal = stewdentApplication.contractBalance();
		bal.then(function(result){
			res.send("Contract Balance : " + web3.fromWei(result.toNumber(),"ether"));
		});
	});
});

app.get('/calc', function(req, res, next){
	var targetUser = (userDataArray[0]);
	var url = 'https://script.google.com/macros/s/AKfycbwkjRWRF9GXsnQJiBVyDWJyZk43ESDuAtUiRlsDn16FMRoMlD4/exec'
	request.post({url: url, followAllRedirects: true,
		form:
			{
				ID : 100,
				attr1 : targetUser['attr1'],
				attr2 : targetUser['attr2'],
				attr3 : targetUser['attr3'],
				attr4 : targetUser['attr4'],
				attr5 : targetUser['attr5']
			}
		},
		function(err, httpResponse, body){
			if(err){
				console.error(err);
				res.send("An Error Occured");
			}
			console.log(body);
			res.send("Score: " + body);
		}
	);
});

app.get('/redirect', function(req, res, next){
	res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
