'use strict';

const app = require('./server/server');
const PORT = process.env.PORT ;

app.listen(PORT, () =>
  console.log(`Server is listening to the port ${PORT}`));

