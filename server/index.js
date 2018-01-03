const nr = require('newrelic');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const {
  bulkAddUsersToDb,
  addUserToDbAsync,
  getUserData
} = require('../database/index');
const { getBatchOfUsers } = require('../helpers/getBatchOfUsers');
const { getUserProfile } = require('../helpers/getUserProfile');
const { getCommonElements } = require('../helpers/getCommonElements');
const fs = require('fs');

dotenv.config();
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
  const volOfUsersToAdd = 100000;
  const batchSize = 100;

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
  let volOfUsersToAdd = 10000;

  if (process.env.NODE_ENV === 'docker' || process.env.NODE_ENV === 'test') {
    volOfUsersToAdd = 100;
  }

  const startTime = Date.now();

  console.log('---- testing development on docker ----');
  console.log('environment variables ', process.env.NODE_ENV);

  let lastUserId = Number(fs.readFileSync('./simulator/lastUserId.txt', 'utf8'));
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'docker') {
    lastUserId = 0;
  }
  console.log('First user ID is ', lastUserId);
  const maxUserId = lastUserId + volOfUsersToAdd;

  const insertUserToDb = (userId) => {
    addUserToDbAsync(getUserProfile(userId))
      .then((success) => {
        // console.log(success);
        lastUserId++;
        if (lastUserId < maxUserId) {
          insertUserToDb(lastUserId);
        } else if (lastUserId === maxUserId) {
          if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'docker') {
            console.log(Date.now() - startTime, ' ms to complete operation');
            res.send('successful stream write');
          } else {
            fs.writeFile('./simulator/lastUserId.txt', lastUserId, (err) => {
              if (err) throw err;
              console.log('lastUserId.txt file has been updated with ', lastUserId);
              console.log(Date.now() - startTime, ' ms to complete operation');
              res.send('successful stream write');
            });
          }
        }
      })
      .catch(err => console.log('Problem adding to DB ', err));
  };

  insertUserToDb(lastUserId);
  // res.send('changed development');
});
