const mongoose = require('mongoose');
const Promise = require('bluebird');

if (process.env.NODE_ENV === 'docker') {
  console.log('using this host: mongodb://database/people-service');
  mongoose.connect('mongodb://database/people-service');
} else {
  console.log('using this host: mongodb://localhost/people-service');
  mongoose.connect('mongodb://localhost/people-service');
}

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('We\'re connected'));

const userSchema = mongoose.Schema({
  userId: { type: Number, index: true },
  createdAt: { type: Date, default: Date.now },
  age: Number,
  gender: String,
  lastName: String,
  firstName: String,
  email: String,
  userName: String,
  profilePicture: String,
  followers: Array,
  followees: Array,
});

const User = mongoose.model('User', userSchema);

const addUserToDbAsync = (user) => {
  return new Promise((resolve, reject) => {
    let newUser = new User(user);
    newUser.save((err, newUser) => {
      if (err) return reject(err);
      let successMessage = newUser.firstName.concat(' ', newUser.lastName, ' added to DB');
      return resolve(successMessage);
    });
  });
};

const bulkAddUsersToDb = (users) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    console.log('   starting map operation');
    let newUsers = users.map((user) => {
      return new User(user);
    });
    const phase1Time = Date.now();
    console.log('   finished map.', phase1Time - startTime);
    console.log('   starting DB insert.');
    User.collection.insertMany(newUsers)
      .then(() => {
        const phase2Time = Date.now();
        console.log('   finished DB insert ', phase2Time - phase1Time);
        resolve('bulk insert was successful');
      })
      .catch(err => reject(err));
  });
};

const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    User.find({userId: userId})
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
};

module.exports.addUserToDbAsync = addUserToDbAsync;
module.exports.bulkAddUsersToDb = bulkAddUsersToDb;
module.exports.getUserData = getUserData;
