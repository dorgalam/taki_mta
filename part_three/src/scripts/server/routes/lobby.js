module.exports = app => {
  let loggedInUsers = [];
  setInterval(() => {
    loggedInUsers = [];
  }, 5000);

  app.post('/_api/name', (req, res) => {
    const name = req.body.name;
    loggedInUsers.push(name);
    res.cookie('name', name);
    res.json({});
  });

  app.get('/_api/name', (req, res) => {
    if (req.cookies.name) {
      res.json({ name: req.cookies.name });
    } else {
      res.status(404).send('unregisterd');
    }
  });

  app.delete('/_api/name', (req, res) => {
    const name = req.body.name;
    loggedInUsers = loggedInUsers.filter(loggedInUser => loggedInUser !== name);
    res.json({});
  });

  app.get('/_api/users', (req, res) => {
    const name = req.cookies.name;
    if (!loggedInUsers.includes(name)) {
      loggedInUsers.push(req.cookies.name);
    }
    res.json(loggedInUsers);
  });
  return app;
};
