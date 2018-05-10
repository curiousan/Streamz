// all the functions to do operation on video model

// imports
'use strict';
const Video = require('./../models/video');
const aws = require('./../config/aws');
const upload = require('./../config/aws').upload;

// common errors and validation handlers
const errHandler = (err) => {
    console.error('There was an error performing the operation');
    console.log(err);
    console.log(err.code);
    return console.error(err.message);
};

// get all available videos

module.exports.allVideos = (req, cb) => {
    return Video.find({}, (err, videos) => {
        if (err) {
            errHandler(err);
            return cb(err, null);
        }
        return cb(null, videos);
    });
};


// get a specific video with id
module.exports.singleVideo = (req, cb) => {
    return Video.findById(req.params.id, (err, data) => {
        if (err) {
            errHandler(err);
            return cb(err, null);
        }
        return cb(null, data);
    });
};


// add a new video
module.exports.addNewVideo = (req, res) => {
    upload.single('video')(req, res, (err) => {
        if (err) return res.send(err);
        aws.uploadfile(req, (err, msg) => {
            if (err) return res.send(err);
            return res.send(msg);
        });
    });
};

// render the update interface
module.exports.updateInterface = (req, res) => {
    return Video.findOne({_id: req.params.id}, (err, data) => {
        if (err) return errHandler(err);
        if (req.user) {
            const username = req.user.facebook? req.user.facebook.name: req.user.local.name;
            if (username === data.user) {
               return res.render('update', {currentUser: req.user, video: data});
            }
         }
         return res.status(401).send('ERR: Please make you sure you are the owner of video');
    });
};


// update the current video

module.exports.updateVideo = (req, res) =>{
    console.log('got request to update video '+ req.params.id);
    console.log(req.body);

    return Video.findOne({_id: req.params.id}, (err, video) => {
        if (err) return errHandler(err);
        if (req.user) {

            const username = req.user.facebook? req.user.facebook.name: req.user.local.name;
            if (username === video.user) {
              return Video.findByIdAndUpdate({_id: req.params.id}, req.body, {upsert: true}, (err, updatedVideo)=>{
                   if (err) {
                       errHandler(err);
                       return res.send(err);
                    }
                   return res.send(updatedVideo);
               });
            }
         }   
            res.status(401).send('Please authorize yourself');
         
         
    });
};


// delete the existing videos
module.exports.deleteVideo = (req, res) => {
    console.log(req.user);
    return Video.findById(req.params.id, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        if (req.user) {
            const username = req.user.facebook? req.user.facebook.name: req.user.local.name;
            if (username === data.user) {
                console.log('deleting  video with id: '+req.params.id);

                return Video.remove({_id: req.params.id}, (err, video) =>{
                    if (err) return errHandler(err);
                    return res.json(video);
                });
            }
    }

        res.status(401).send('ERR: Please make you sure you are the owner of video');
    });
};