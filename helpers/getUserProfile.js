const faker = require('faker');
const fs = require('fs');
const { followGenerator } = require('./followGenerator');

const getUserProfile = (userId) => {
  const user = {
    userId: userId,
    age: Math.floor(Math.random() * 70) + 18,
    gender: Math.random() > 0.5 ? 'M' : 'F',
    lastName: faker.name.lastName(),
    firstName: faker.name.firstName(),
    email: faker.internet.email(),
    userName: faker.internet.userName(),
    profilePicture: faker.image.imageUrl(),
    followers: followGenerator(),
    followees: followGenerator(),
  };

  return user;
};

const startTime = Date.now();

console.log('start');
for (let i = 0; i < 20000; i++) {
  getUserProfile();
}
console.log('done');
console.log('elapsed time ', Date.now() - startTime);

module.exports.getUserProfile = getUserProfile;


// NEW FAKER DATA GENERATION FORMAT
// const user = {
//   userId: userId,
//   age: Math.floor(Math.random() * 70) + 18,
//   gender: Math.random() > 0.5 ? 'M' : 'F',
//   lastName: faker.name.lastName(),
//   firstName: faker.name.firstName(),
//   email: faker.internet.email(),
//   userName: faker.internet.userName(),
//   profilePicture: faker.image.imageUrl(),
//   followers: followGenerator(),
//   followees: followGenerator(),
// };

// OLD FAKER DATA GENERATION FORMAT
// const user = {
//   userId: userId,
//   age: Math.floor(Math.random() * 70) + 18,
//   gender: Math.random() > 0.5 ? 'M' : 'F',
//   lastName: faker.fake('{{name.lastName}}'),
//   firstName: faker.fake('{{name.firstName}}'),
//   email: faker.internet.email(),
//   userName: faker.internet.userName(),
//   profilePicture: faker.fake('{{image.imageUrl}}'),
//   followers: followGenerator(),
//   followees: followGenerator(),
// };
