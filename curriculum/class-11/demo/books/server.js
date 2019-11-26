'use strict';

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.listen(PORT, () => console.log(`server up on port ${PORT}`));