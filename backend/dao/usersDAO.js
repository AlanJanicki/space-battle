import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

let users;

export default class UsersDAO {
  static async injectDB(client) {
    if (users) {
      return;
    }
    try {
      users = await client.db(process.env.MONGO_DB_NAME).collection('users');
      console.log('MongoDB connected');
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteUser(userId) {
    const errors = [];

    try {
      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        errors.push({
          login: 'Nie odnaleziono użytkownika o podanym ID',
        });
        return errors;
      }

      await users.deleteOne(user);
    } catch (err) {
      errors.push({
        uncategorizedErrors: 'Nie udało usunąć użytkownika. Spróbuj ponownie.',
      });
      return errors;
    }
  }

  static async login({ login, password }) {
    const errors = [];

    try {
      const user = await users.findOne({ login });
      if (!user) {
        errors.push({
          login: 'Nie odnaleziono użytkownika o podanym loginie',
        });
        return errors;
      }

      const matchingPassword = await bcrypt.compare(password, user.password);
      if (!matchingPassword) {
        errors.push({
          login: 'Nieprawidłowe hasło',
        });
        return errors;
      }

      return user;
    } catch (err) {
      errors.push({
        uncategorizedErrors: 'Nie udało się zalogować. Spróbuj ponownie.',
      });
      return errors;
    }
  }

  static async register(userData) {
    const errors = [];

    try {
      const user = await users.findOne({ login: userData.login });
      if (user) {
        errors.push({
          login: 'Ten login jest już zajęty. Wybierz inny.',
        });
        return errors;
      }

      await users.insertOne(userData);
    } catch (err) {
      errors.push({
        uncategorizedErrors: 'Nie udało się utworzyć użytkownika. Spróbuj ponownie.',
      });
      return errors;
    }
  }

  static async updateGameLevel(userId, gameLevel) {
    const errors = [];

    try {
      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        errors.push({
          login: 'Nie odnaleziono użytkownika o podanym ID',
        });
        return errors;
      }

      const updatedUser = await users.findOneAndUpdate(
        user,
        { $set: { gameLevel } },
        { returnDocument: 'after' }
      );
      return updatedUser.value;
    } catch (err) {
      errors.push({
        uncategorizedErrors: 'Nie udało się zaktualizować poziomu gry. Spróbuj ponownie.',
      });
      return errors;
    }
  }
}
