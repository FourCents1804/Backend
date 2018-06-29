'use strict';

const app = require('./server/server');
const PORT = 19004 ;

app.listen(PORT, () =>
  console.log(`Server is listening to the port ${PORT}`));

