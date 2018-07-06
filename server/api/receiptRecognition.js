const router = require('express').Router();
const defaultHandler = require('../../errorHandler');
const vision = require('@google-cloud/vision');
const clientVision = new vision.ImageAnnotatorClient({
  projectId: 'dime-app-208122',
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
      /\\n/g,
      '\n'
    ),
    client_email:  process.env.GOOGLE_CLIENT_EMAIL
  }
});
const language = require('@google-cloud/language');
const clientLanguage = new language.LanguageServiceClient({
  projectId: 'dime-app-208122',
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
      /\\n/g,
      '\n'
    ),
    client_email:  process.env.GOOGLE_CLIENT_EMAIL
  }
});

router.get(
  '/',
  defaultHandler(async (req, res, next) => {
    console.log('In server');
    const textOnReceipt = await clientVision.textDetection(
      'https://firebasestorage.googleapis.com/v0/b/dime-d9d45.appspot.com/o/imagessend-to-google?alt=media&token=2876f23e-0f64-405e-bb1b-b2ab9333e425'
    );
    const allElements = textOnReceipt[0].textAnnotations[0].description.split(
      '\n'
    );
    let theIndex
    for (let j = 0; j < allElements.length ; j++) {
      // console.log(allElements[j])
      if ((allElements[j]).includes('Total')) {
        theIndex = j
        break
      }
    }
    const elements = allElements.slice(0, theIndex);
    console.log(elements)
    const items = [];
    const prices = [];

    elements.forEach(el => {
      if (
        el === el.toUpperCase() &&
        !el.includes('$') &&
        el !== '' &&
        isNaN(el) &&
        el

      ) {
        items.push(el);
      } else if (
        (el.includes('$') && el.length < 9) ||
        (el.includes('.') && el.length < 9 && !el.includes('b'))
      ) {
        prices.push(el);
      }
    });

    const document = {
      content: items.join(' ').repeat(10),
      type: 'PLAIN_TEXT'
    };
    const textContent = await clientLanguage.classifyText({
      document: document
    });
    let summary = {};
    let total = prices[prices.length - 1];
    let purchasedItems = {};
    let count = -1;
    items.forEach(item => {
      count++;
      purchasedItems[count] = [item, prices[count]];
    });
    summary.purchasedItems = purchasedItems;
    summary.amount = total;
    summary.date = Date.now()
    if (textContent[0].categories[0]) {
      summary.category = textContent[0].categories[0].name.slice(1);
    } else {
      summary.category = 'Could Not Retreive Category';
    }
    console.log(summary);
    res.send(summary);
  })
);

module.exports = router;

