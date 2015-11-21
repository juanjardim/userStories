var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
    return jsonwebtoken.sign({
        userId: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        expiresInMinute: 1440
    });

}

module.exports = function (app, express) {
    var api = express.Router();

    api.post('/signup', function (req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        var token = createToken(user);
        user.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({
                success: true,
                message: "User has been created!",
                token: token
            });
        });
    });

    api.get('/users', function (req, res) {
        User.find(function (err, users) {
            if (err) {
                return res.send(err);
            }
            res.json({users: users});
        });
    });

    api.post('/login', function (req, res) {
        User.findOne({username: req.body.username}).select('name username password').exec(function (err, user) {
            if (err) {
                return res.status(500).json(err);
            }

            if (!user) {
                return res.status(403).json({message: "Invalid Username or password"});
            }

            var validaPassword = user.comparePassword(req.body.password);
            if (!validaPassword) {
                return res.status(403).json({message: "Invalid Username or password"});
            }
            var token = createToken(user);
            res.status(200).json({
                success: true,
                message: "Successfuly login!",
                token: token
            });

        });
    });

    api.use(function (req, res, next) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    return res.status(403).send({success: false, message: "Failed to authenticate user"});
                }

                req.decoded = decoded;
                next();
            });
        } else {
            return res.status(403).send({success: false, message: "No Token Provided"});
        }
    });

    api.route('/stories')
        .post(function (req, res) {
            var story = new Story({
                creator: req.decoded.userId,
                content: req.body.content
            });

            story.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                Story.find({creator: req.decoded.userId}).sort({created: 'desc'}).exec(function(err, stories){
                    if(err){
                        return res.send(err);
                    }
                    res.json({
                        message: "New Story Created",
                        stories: stories
                    });
                });
            });
        })
        .get(function (req, res) {
            Story.find({creator: req.decoded.userId}).sort({created: 'desc'}).exec(function (err, stories) {
                if (err) {
                    return res.send(err);
                }
                res.json({stories: stories});
            });
        });

    api.route('/me')
        .get(function (req, res) {
            res.json(req.decoded);
        });

    return api;
};