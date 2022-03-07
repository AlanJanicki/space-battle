import express from 'express';
import 'dotenv/config';
import mongodb from 'mongodb';

import user from './api/user.route.js';
import UsersDAO from './dao/usersDAO.js';

const PORT = process.env.PORT || 4002;
const mongoClient = mongodb.MongoClient;

const app = express();
app.use(express.json());

app.use('/user', user);

mongoClient
  .connect(process.env.MONGO_URL)
  .catch((err) => {
    console.log(err);
    mongoClient.close();
    process.exit(1);
  })
  .then(async (client) => {
    await UsersDAO.injectDB(client);
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  });
