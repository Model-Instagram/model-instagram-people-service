const faker = require('faker');
const fs = require('fs');

const { followGenerator } = require('./followGenerator');

const getBatchOfUsers = (popSize, userId) => {
  let newUsers = [];

  const generateNewUserAndPush = (currentUserId) => {
    const user = {
      userId: currentUserId,
      age: Math.floor(Math.random() * 70) + 18,
      gender: Math.random() > 0.5 ? 'M' : 'F',
      lastName: faker.fake('{{name.lastName}}'),
      firstName: faker.fake('{{name.firstName}}'),
      email: faker.fake('{{internet.email}}'),
      userName: faker.fake('{{internet.userName}}'),
      profilePicture: faker.fake('{{image.imageUrl}}'),
      followers: followGenerator(),
      followees: followGenerator(),
    };

    newUsers.push(user);
  };

  for (let i = 0; i < popSize; i++) {
    generateNewUserAndPush(Number(userId) + i);
  }

  return newUsers;
};

module.exports.getBatchOfUsers = getBatchOfUsers;
