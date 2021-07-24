const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError, validPasswordOrError } = app.api.validation; // not calling

  const encryptPassword = password => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  }

  const save = async (req, res) => {
    const user = { ...req.body };

    if (req.params.id) user.id = req.params.id

    try {
      existsOrError(user.name, 'Name not entered')
      existsOrError(user.age, 'Age not entered')
      existsOrError(user.email, 'Email not entered')
      validPasswordOrError(user.password, 'Email not well formated, it needs to be at least 6 characters')
      existsOrError(user.password, 'Password not entered')
      existsOrError(user.confirmPassword, 'Confirmation of password not entered')
      equalsOrError(user.password, user.confirmPassword, 'Passwords donnot match')

      const userFromDB = await app.db('users')
        .where({ email: user.email }).first()
        if (!user.id) {
          notExistsOrError(userFromDB, 'User already registered')
        }
    } catch (msg) {
      res.status(400).send(msg)
    }

    user.password = encryptPassword(user.password)
    delete user.confirmPassword

    if (user.id) {
      app.db('users')
        .update(user)
        .where({ id: user.id })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    } else {
      app.db('users')
        .insert(user)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }
  };

  const get = (req, res) => {
    app.db('users') 
      .select('id', 'name', 'age', 'email') 
      .then(users => res.json(users))
      .catch(err => res.status(500).send(err))
  } 

  return { save, get };
}
// HAS TO INCLUDE CITY  UP ON GET
