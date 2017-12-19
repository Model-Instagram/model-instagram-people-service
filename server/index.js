const apm = require('elastic-apm-node').start({
  appName: 'model-instagram-people-service',
  secretToken: '',
  serverUrl: '',
});
const express = require('express');
const bodyParser = require('body-parser');
const { bulkAddUsersToDb, addUserToDbAsync } = require('../database/index');
const { getBatchOfUsers } = require('../helpers/getBatchOfUsers');
const { getUserProfile } = require('../helpers/getUserProfile');
const fs = require('fs');

const app = express();
const port = 8080;

app.listen(port, () => console.log('Server listening on port: ', port));

app.use(bodyParser.json());

app.put('/user/add', (req, res) => {
  addUserToDbAsync(req.body)
    .then((success) => {
      console.log(success);
      res.send(success);
    })
    .catch(err => console.log('Problem adding to DB ', err));
});

app.put('/bulkuser/add', (req, res) => {
  const volOfUsersToAdd = 1700000;
  const batchSize = 20000;

  const startTime = Date.now();

  // get last userId count
  let lastUserId = Number(fs.readFileSync('./tests/lastUserId.txt', 'utf8'));
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
          fs.writeFile('./tests/lastUserId.txt', lastUserId, (err) => {
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

app.put('/streamuser/add', (req, res) => {
  const volOfUsersToAdd = 10000;

  // get last userId count

  const startTime = Date.now();

  let lastUserId = fs.readFileSync('./tests/lastUserId.txt', 'utf8');
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
          fs.writeFile('./tests/lastUserId.txt', lastUserId, (err) => {
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
