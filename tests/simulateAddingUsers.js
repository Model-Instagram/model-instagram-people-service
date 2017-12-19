const faker = require('faker');
const axios = require('axios');
const fs = require('fs');

const { followGenerator } = require('../helpers/followGenerator');

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

const startTime = Date.now();

// get last userId count
let lastUserId = fs.readFileSync('./tests/lastUserId.txt', 'utf8');
console.log('First user ID is ', lastUserId);

const maxUserId = Number(lastUserId) + 10000;
let newUsers = [];

// STRUCTURED AS A SYNCHRONOUS OPERATION
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

  // newUsers.push(user);
  lastUserId++;
  if (lastUserId < maxUserId) {
    generateNewUserAndSendToServer();
  } else {
    console.log('finished with ', lastUserId);
    console.log(Date.now() - startTime, ' ms to complete operation');
  }
};

generateNewUserAndSendToServer();

// INCLUDES PUT REQUEST
// axios.put('http://localhost:8080/user/add', user)
//   .then((data) => {
//     lastUserId++;
//     if (lastUserId < maxUserId) {
//       generateNewUserAndSendToServer();
//     } else {
//       fs.writeFile('./tests/lastUserId.txt', lastUserId, (err) => {
//         if (err) throw err;
//         console.log('lastUserId.txt file has been updated with ', lastUserId);
//         console.log(Date.now() - startTime, ' ms to complete operation');
//       });
//     }
//   })
//   .catch((error) => {
//     console.log('There was an error PUTTING to server ');
//     throw error;
//   });

// STRUCTURED AS A SYNCHRONOUS OPERATION
// const generateNewUser = () => {
//   const user = {
//     userId: lastUserId,
//     age: Math.floor(Math.random() * 70) + 18,
//     gender: Math.random() > 0.5 ? 'M' : 'F',
//     lastName: faker.fake('{{name.lastName}}'),
//     firstName: faker.fake('{{name.firstName}}'),
//     email: faker.fake('{{internet.email}}'),
//     userName: faker.fake('{{internet.userName}}'),
//     profilePicture: faker.fake('{{image.imageUrl}}'),
//     followers: followGenerator(),
//     followees: followGenerator(),
//   };
//   return user;
// };
//
// const batchSize = 100;
// const waitTime = 200;
//
// const bookmarkEnd = () => {
//   fs.writeFile('./tests/lastUserId.txt', lastUserId, (err) => {
//     if (err) throw err;
//     console.log('lastUserId.txt file has been updated with ', lastUserId);
//   });
//   console.log(Date.now() - startTime, ' ms to complete operation');
// };
//
// const addBatchOfUsers = () => {
//   console.log('beginning our addBatch ', lastUserId);
//   for (let i = 0; i < batchSize && lastUserId < maxUserId; i++) {
//     lastUserId++;
//     // console.log(lastUserId);
//     axios.put('http://localhost:8080/user/add', generateNewUser())
//       .catch((error) => {
//         console.log('There was an error PUTTING to server ');
//         throw error;
//       });
//   }
//   console.log('batch was added ', lastUserId);
// };
//
// const addUserBatches = () => {
//   addBatchOfUsers();
//   if (lastUserId < maxUserId) {
//     setTimeout(addUserBatches, waitTime);
//   } else if (lastUserId === maxUserId) {
//     bookmarkEnd();
//   }
// };
//
// addUserBatches();

// STRUCTURED AS A PORT FLOODING STRATEGY
// const sendToServer = () => {
//   const serverTestFlag = { test: true };
//   axios.put('http://localhost:8080/user/add', serverTestFlag)
//     .then(() => {
//       axios.put('http://localhost:8080/user/add', generateNewUser())
//         .then(() => {
//           lastUserId++;
//           if (lastUserId < maxUserId) {
//             sendToServer();
//           } else if (lastUserId === maxUserId) {
//             fs.writeFile('./tests/lastUserId.txt', lastUserId, (err) => {
//               if (err) throw err;
//               console.log('lastUserId.txt file has been updated with ', lastUserId);
//             });
//           }
//         })
//         .catch((error) => {
//           console.log('There was an error PUTTING to server ');
//           throw error;
//         });
//     })
//     .catch((err) => {
//       setTimeout(sendToServer, waitTime);
//     });
// };
//
// sendToServer();
