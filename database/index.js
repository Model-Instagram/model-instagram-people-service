const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.connect('mongodb://localhost/people-service');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('We\'re connected'));

const userSchema = mongoose.Schema({
  userId: Number,
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
    let newUsers = users.map((user) => {
      return new User(user);
    });
    User.collection.insertMany(newUsers)
      .then(() => resolve('bulk insert was successful'))
      .catch(err => reject(err));
  });
};

module.exports.addUserToDbAsync = addUserToDbAsync;
module.exports.bulkAddUsersToDb = bulkAddUsersToDb;
