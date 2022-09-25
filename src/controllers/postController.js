const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require('fs').promises;
const path = require('path');

const handlePost = async (req, res) => {
  // const posts = [
  //     {
  //       username: 'Bob',
  //       title: 'Post One',
  //     },
  //     {
  //       username: 'Aaron',
  //       title: 'Post Two',
  //     },
  //   ];
  // app.get('/posts', authenticateToken, (req, res) => {
  //   res.json(posts.filter((post) => post.username === req.user.name));
  // });
};

module.exports = { handlePost };
