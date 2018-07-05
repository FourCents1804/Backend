const router = require('express').Router();
const defaultHandler = require('../../errorHandler');
const Model = require('keras-js').Model;

router.get(
  '/',
  defaultHandler(async (req, res, next) => {
    const model = new Model({
      filepath:
        '/home/yacinus/Desktop/Backend/server/KerasModelDir/savedModel.bin',
      filesystem: true,
      gpu: false
    });
    await model.ready();
    const minConst = -0.00029065;
    const scaleConst = 0.00145323;
    //const last3DfromDb = //data from props;
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
