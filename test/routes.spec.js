const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Adding User Profiles to DB', () => {
  it('should add randomly generated users to the database', (done) => {
    chai.request('http://localhost:8080')
      .put('/streamuser/add')
      .end((err, res) => {
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
