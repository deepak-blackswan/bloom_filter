var app 		= require('./app'),
	should 		= require('should'),
	supertest 	= require('supertest')
;

describe('bloomfilter', function(){

	it('should return 200', 
	function(app) {
		supertest(app)
		.get('/')
		.expect(200)
		.end(function (err, res) {
			res.status.should.equal('Hello Sir! What can i do for you today?');
			done();
		});
		
	});

	it('should return item found: deepak', 
	function(app) {
		supertest(app)
		.get('/check-item/deepak')
		.expect(200)
		.end(function (err, res) {
			res.status.should.equal(200);
			res.body.actualArrive
			.should.not.equal(undefined);
			done();
		});
		
	});	

});