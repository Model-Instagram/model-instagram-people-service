const followGenerator = () => {
  // generate a random list of integers ranging from 0 - 10,000,000
  // there will be a random number of these generated, ranging from 0 - 4,000
  // these will represent either followers or followees
  const maxFollow = 10000000;
  const maxNum = 400;
  let num = Math.round(Math.random() * maxNum);
  let friendsObj = {};
  let friends = [];
  let newFriend;

  for (let i = 0; i < num; i++) {
    newFriend = Math.round(Math.random() * maxFollow);
    friendsObj[newFriend] = 1;
  }
  friends = Object.keys(friendsObj);
  return friends;
};

module.exports.followGenerator = followGenerator;
