var Hapi = require('hapi');
var handlebar = require('handlebars');
var vision = require('vision');
var inert = require('inert');
var server = new Hapi.Server();
var Joi = require('joi');
var Obj = { message: '', color: '' };
server.connection({
    port: 3001,
    host: 'localhost'
});
server.register([
    { register: vision },
    { register: inert }
]);
server.views({
    engines: {
        hbs: handlebar
    },
    path: __dirname + '/views'
});
server.route([{
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply.view('index');
        }
    },
    {
        method: 'GET',
        path: '/login',
        handler: function(request, reply) {
            reply.view('login', Obj);
        }
    },
    {
        method: 'POST',
        path: '/validate',
        handler: function(request, reply) {
            var id = request.payload.txtname;
            var pwd = request.payload.txtpwd;
            var schema = {
                id: Joi.string().max(6).required(),
                pwd: Joi.string().max(6).required()
            };
            if (id != "" && pwd != "") {
                Joi.validate({ id: id, pwd: pwd }, schema, function(err, value) {
                    if (err) {
                        Obj.message = 'Please Enter the name and Text Area as String';
                        Obj.color = 'red';
                    } else {
                        Obj.message = 'You have done the correct Job';
                        Obj.color = 'green';
                    }
                });
            }
            reply.view('login', Obj);
        }
    }
]);
server.start(function(err) {
    console.log('server running at: ' + server.info.uri);
});