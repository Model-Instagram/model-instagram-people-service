const nr = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const { bulkAddUsersToDb,
        addUserToDbAsync,
        getUserData
      } = require('../database/index');
const { getBatchOfUsers } = require('../helpers/getBatchOfUsers');
const { getUserProfile } = require('../helpers/getUserProfile');
const { getCommonElements } = require('../helpers/getCommonElements');
const fs = require('fs');

const service = express();
const port = 8080;

service.listen(port, () => console.log('Server listening on port: ', port));

service.use(bodyParser.json());

// Return followers for a given userId
service.get('/users/:user_id/followers', (req, res) => {
  getUserData(req.params.user_id)
    .then((data) => {
      const userData = {
        userId: data[0].userId,
        userName: data[0].userName,
        followers: data[0].followers,
      };
      res.send(userData);
    })
    .catch(err => console.log(err));
});

// Return followees for a given userId
service.get('/users/:user_id/followees', (req, res) => {
  getUserData(req.params.user_id)
    .then((data) => {
      const userData = {
        userId: data[0].userId,
        userName: data[0].userName,
        followees: data[0].followees,
      };
      res.send(userData);
    })
    .catch(err => console.log(err));
});

// Return common followers for a poster and a liker
service.get('/users/:post_user_id/:like_user_id/followers', (req, res) => {
  getUserData(req.params.post_user_id)
    .then((posterData) => {
      getUserData(req.params.like_user_id)
        .then((likerData) => {
          const splicedUserData = {
            postUserId: posterData[0].userId,
            postUserName: posterData[0].userName,
            likeUserId: likerData[0].userId,
            likeUserName: likerData[0].userName,
            followers: getCommonElements(posterData[0].followers, likerData[0].followers),
          };
          res.send(splicedUserData);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

service.put('/user/add', (req, res) => {
  addUserToDbAsync(req.body)
    .then((success) => {
      console.log(success);
      res.send(success);
    })
    .catch(err => console.log('Problem adding to DB ', err));
});

service.put('/bulkuser/add', (req, res) => {
  const volOfUsersToAdd = 1000000;
  const batchSize = 20000;

  const startTime = Date.now();

  // get last userId count
  let lastUserId = Number(fs.readFileSync('./simulator/lastUserId.txt', 'utf8'));
  console.log('First user ID is ', lastUserId);
  let maxUserId = lastUserId + volOfUsersToAdd;
  console.log('lastUserId ', lastUserId, 'maxUserId ', maxUserId);

  let numUsersToAdd = 0;

  const bulkAdd = () => {
    numUsersToAdd = Math.min(batchSize, maxUserId - lastUserId);

    bulkAddUsersToDb(getBatchOfUsers(numUsersToAdd, lastUserId))
      .then((data) => {
        lastUserId += numUsersToAdd;
        console.log('lastUserId ', lastUserId, 'maxUserId ', maxUserId);
        if (lastUserId < maxUserId) {
          bulkAdd();
        } else if (lastUserId === maxUserId) {
          console.log('finished with ', lastUserId);
          console.log(Date.now() - startTime, ' ms to complete operation');
          fs.writeFile('./simulator/lastUserId.txt', lastUserId, (err) => {
            if (err) throw err;
            console.log('lastUserId.txt file has been updated with ', lastUserId);
          });
        }
      })
      .catch(err => console.log(err))
  };

  bulkAdd();

  res.send('successful bulk add operation');
});

service.put('/streamuser/add', (req, res) => {
  const volOfUsersToAdd = 10000;

  // get last userId count

  const startTime = Date.now();

  let lastUserId = fs.readFileSync('./simulator/lastUserId.txt', 'utf8');
  console.log('First user ID is ', lastUserId);
  const maxUserId = Number(lastUserId) + volOfUsersToAdd;

  const insertUserToDb = (userId) => {
    addUserToDbAsync(getUserProfile(userId))
      .then((success) => {
        // console.log(success);
        lastUserId++;
        if (lastUserId < maxUserId) {
          insertUserToDb(lastUserId);
        } else if (lastUserId === maxUserId) {
          fs.writeFile('./simulator/lastUserId.txt', lastUserId, (err) => {
            if (err) throw err;
            console.log('lastUserId.txt file has been updated with ', lastUserId);
            console.log(Date.now() - startTime, ' ms to complete operation');
          });
        }
      })
      .catch(err => console.log('Problem adding to DB ', err));
  };

  insertUserToDb(lastUserId);

  res.send('successful) stream write ');
});

/*

SAMPLE QUERY RESPONSE
{
    "userId": 1234,
    "userName": "Macey.Hoeger28",
    "followers": [
        2185868,
        9895630,
        8263507,
        1835027,
        720366,
        2823848,
        2511277,
        9749951,
        7139952,
        9422129,
        624949,
        6618418,
        7427622,
        5838031,
        5554265,
        491990,
        6809676,
        373390,
        1987577,
        8839741,
        4758910,
        3501539,
        2275510,
        5094677,
        1486193,
        3370771,
        2894865,
        3944667,
        9535450,
        7804824,
        4437582,
        7174790,
        5532766,
        227525,
        1726546,
        6119265,
        569344,
        2782954,
        1065206,
        1588289,
        7114033,
        7445160,
        7039419,
        322454,
        9772698,
        2695814,
        7245839,
        489375,
        6668101,
        6771003,
        3982810,
        1584709,
        4866750,
        9594631,
        9779615,
        4360989,
        171482,
        2915195,
        1920778,
        4258946,
        7167655,
        1564252,
        2876553,
        3067017,
        8971848,
        9151670,
        1236911,
        8715311,
        6130862,
        5995083,
        2752932,
        2989085,
        8907780,
        3856896,
        3204827,
        1501921,
        4820895,
        7424950,
        5898619,
        5083123,
        6184862,
        8671949,
        2138010,
        1891703,
        5611789,
        4772636,
        2125461,
        4709422,
        7646177,
        7238153,
        4108133,
        2869252,
        1782908,
        7809322,
        1509337,
        3769722,
        861453,
        1249900,
        3988843,
        3524964
    ]
}
*/
