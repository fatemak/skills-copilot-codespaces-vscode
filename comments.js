//Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

//Get all comments
router.get('/', function(req, res){
	Comment.find(function(err, comments){
		if(err){
			res.send(err);
		}
		res.json(comments);
	});
});

//Get all comments for a specific post
router.get('/post/:id', function(req, res){
	Comment.find({'post': req.params.id}, function(err, comments){
		if(err){
			res.send(err);
		}
		res.json(comments);
	});
});

//Get all comments for a specific user
router.get('/user/:id', function(req, res){
	Comment.find({'user': req.params.id}, function(err, comments){
		if(err){
			res.send(err);
		}
		res.json(comments);
	});
});

//Get a specific comment
router.get('/:id', function(req, res){
	Comment.findById(req.params.id, function(err, comment){
		if(err){
			res.send(err);
		}
		res.json(comment);
	});
});

//Create a new comment
router.post('/', function(req, res){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		jwt.verify(token, config.secret, function(err, decoded){
			if(err){
				return res.json({success: false, message: 'Failed to authenticate token'});
			}
			else{
				var comment = new Comment();
				comment.post = req.body.post;
				comment.user = decoded._id;
				comment.text = req.body.text;
				comment.save(function(err){
					if(err){
						res.send(err);
					}
					res.json({success: true, message: 'Comment created'});
				});
			}
		});
	}
	else{
		return res.status(403).send({success: false, message: 'No token provided'});
	}
});

//Update a specific comment
router.put('/:id', function(req, res){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		jwt.verify(token, config.secret, function(err, decoded){
			if(err){