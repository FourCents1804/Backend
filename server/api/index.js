'use strict';

const router = require('express').Router();

module.exports = router;

router.use('/receiptRecognition', require('./receiptRecognition'));
router.use('/contentClassification', require('./contentClassification'));
router.use('/loadKeras', require('./loadKeras'));

router.use((req, res, next) => {
  const err = new Error('API route not found!');
  err.status = 404;
  next(err);
});
