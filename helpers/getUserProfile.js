const faker = require('faker');
const fs = require('fs');
const { followGenerator } = require('./followGenerator');

const getUserProfile = (userId) => {
  const user = {
    userId: userId,
    age: Math.floor(Math.random() * 70) + 18,
    gender: Math.random() > 0.5 ? 'M' : 'F',
    lastName: faker.fake('{{name.lastName}}'),
    firstName: faker.fake('{{name.firstName}}'),
    email: faker.internet.email(),
    userName: faker.internet.userName(),
    profilePicture: faker.fake('{{image.imageUrl}}'),
    followers: followGenerator(),
    followees: followGenerator(),
  };

  return user;
};

module.exports.getUserProfile = getUserProfile;
