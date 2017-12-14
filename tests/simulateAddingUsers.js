const faker = require('faker');
const axios = require('axios');
const fs = require('fs');

/*
userId
age
gender
lastName
firstName
email
username
profilePicture
followers: [ userIds ]
following: [ userIds ]
*/

const followGenerator = () => {
  // generate a random list of integers ranging from 0 - 10,000,000
  // there will be a random number of these generated, ranging from 0 - 4,000
  // these will represent either followers or followees
  const maxFollow = 10000000;
  const maxNum = 400;
  let num = Math.round(Math.random() * maxNum);
  let friends = [];
  let newFriend;

  for (let i = 0; i < num; i++) {
    newFriend = Math.round(Math.random() * maxFollow);
    if (!friends.includes(newFriend)) {
      friends.push(newFriend);
    }
  }
  return friends;
};

// get last userId count
let lastUserId = fs.readFileSync('./tests/lastUserId.txt', 'utf8');
console.log('First user ID is ', lastUserId);

const maxUserId = Number(lastUserId) + 8000;

const generateNewUserAndSendToServer = () => {
  const user = {
    userId: lastUserId,
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

  axios.put('http://localhost:8080/user/add', user)
    .then((data) => {
      lastUserId++;
      if (lastUserId < maxUserId) {
        generateNewUserAndSendToServer();
      } else {
        fs.writeFile('./tests/lastUserId.txt', lastUserId, (err) => {
          if (err) throw err;
          console.log('lastUserId.txt file has been updated with ', lastUserId);
        });
      }
    })
    .catch((error) => {
      console.log('There was an error PUTTING to server ');
      throw error;
    });
};

generateNewUserAndSendToServer();