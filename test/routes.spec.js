const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Adding User Profiles to DB', () => {
  it('should add randomly generated users to the database', (done) => {
    chai.request('http://localhost:8080')
      .put('/streamuser/add')
      .end((err, res) => {
        if (err) return done(err); // Not sure why, but this fixed my double callback problem on Travis
        console.log(res.text);
        res.text.should.equal('successful stream write');
        done();
      });
  });
});

describe('Testing Get Followers', () => {
  it('should return followers for a given userId', (done) => {
    chai.request('http://localhost:8080')
      .get('/users/5/followers')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('userId');
        res.body.userId.should.equal(5);
        res.body.should.have.property('userName');
        res.body.should.have.property('followers');
        res.body.followers.length.should.be.gte(0);
        done();
      });
  });
});

describe('Testing Get Followees', () => {
  it('should return followees for a given userId', (done) => {
    chai.request('http://localhost:8080')
      .get('/users/6/followees')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('userId');
        res.body.userId.should.equal(6);
        res.body.should.have.property('userName');
        res.body.should.have.property('followees');
        res.body.followees.length.should.be.gte(0);
        done();
      });
  });
});

describe('Testing Retrieving Common Followers ', () => {
  it('should return common followers for a given poster and a given liker', (done) => {
    chai.request('http://localhost:8080')
      .get('/users/6/3/followers')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('postUserId');
        res.body.postUserId.should.equal(6);
        res.body.should.have.property('likeUserId');
        res.body.likeUserId.should.equal(3);
        res.body.should.have.property('postUserName');
        res.body.should.have.property('likeUserName');
        res.body.should.have.property('followers');
        res.body.followers.should.be.an.instanceOf(Array);
        done();
      });
  });
});
