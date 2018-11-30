const express = require('express');
const router = express.Router();

// Team Model
let Team = require('../models/team');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_team', {
    title:'Add Team'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_team', {
      title:'Add Team',
      errors:errors
    });
  } else {
    let team = new Team();
    team.title = req.body.title;
    team.member1 = req.body.member1;
    team.member2 = req.body.member2;
    team.author = req.user._id;
    team.body = req.body.body;

    team.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Team Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Team.findById(req.params.id, function(err, team){
    if(team.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_team', {
      title:'Edit Team',
      team:team
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let team = {};
  team.title = req.body.title;
  team.author = req.body.author;
  team.member1 = req.body.member1;
  team.member2 = req.body.member2;
  team.body = req.body.body;

  let query = {_id:req.params.id}

  Team.update(query, team, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Team Updated');
      res.redirect('/');
    }
  });
});

// Delete Team
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Team.findById(req.params.id, function(err, team){
    if(team.author != req.user._id){
      res.status(500).send();
    } else {
      Team.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Team
router.get('/:id', function(req, res){
  Team.findById(req.params.id, function(err, team){
    User.findById(team.author, function(err, user){
      res.render('team', {
        team:team,
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
