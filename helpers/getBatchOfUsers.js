const { getUserProfile } = require('./getUserProfile');
const { followGenerator } = require('./followGenerator');

const getBatchOfUsers = (popSize, userId) => {
  const startTime = Date.now();
  console.log('     starting userBatch generation');
  let newUsers = [];

  const generateNewUserAndPush = (currentUserId) => {
    const user = getUserProfile(currentUserId);
    newUsers.push(user);
  };

  for (let i = 0; i < popSize; i++) {
    generateNewUserAndPush(Number(userId) + i);
  }

  console.log('     finished userBatch generation ', Date.now() - startTime);
  return newUsers;
};

module.exports.getBatchOfUsers = getBatchOfUsers;
