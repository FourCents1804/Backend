const router = require('express').Router();
const defaultHandler = require('../../errorHandler');
const Model = require('keras-js').Model;
const path = require('path')

router.post(
  '/',
  defaultHandler(async (req, res, next) => {
    console.log('In server')
    const model = new Model({
      filepath:
      path.join(__dirname, '..', 'KerasModelDir/savedModel.bin'),
      filesystem: true,
      gpu: false
    });
    console.log('filepath worked!')
    await model.ready();
    const minConst = -0.00029065;
    const scaleConst = 0.00145323;
    const last3DfromDb = req.body.lastThreeDays;
    let scaled = last3DfromDb * scaleConst + minConst;

    const inputData = {
      input: new Float32Array(scaled)
    };
    const outputData = await model.predict(inputData);
    console.log('arrFrom', Array.from(outputData.output)[0]);
    //MinMAx scaler inverse_transform
    const finalPred =
      (Array.from(outputData.output)[0] + minConst) / scaleConst;
    console.log('prediction here', finalPred);
    res.status(200).send(finalPred);
  })
);

module.exports = router;
