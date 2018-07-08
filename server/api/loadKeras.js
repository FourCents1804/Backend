const router = require('express').Router();
const defaultHandler = require('../../errorHandler');
const Model = require('keras-js').Model;
const path = require('path');

router.get(
  '/',
  defaultHandler(async (req, res, next) => {
    console.log('In server');
    const model = new Model({
      filepath: path.join(__dirname, '..', 'KerasModelDir/savedModel.bin'),
      filesystem: true,
      gpu: false
    });
    await model.ready();
    const minConst = -0.00029065;
    const scaleConst = 0.00145323;
    const last3DfromDb = JSON.parse(req.query.lastThreeDays);

    //MinMax scaler tranfsorm
    let scaled = last3DfromDb.map(x => x * scaleConst + minConst);
    const inputData = {
      input: new Float32Array(scaled)
    };
    const outputData = await model.predict(inputData);

    //MinMax scaler inverse_transform
    const finalPred = (
      (Array.from(outputData.output)[0] + minConst) /
      scaleConst
    ).toFixed(2);
    res.status(200).send(finalPred);
  })
);

module.exports = router;
