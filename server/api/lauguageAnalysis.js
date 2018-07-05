const router = require('express').Router();
const language = require('@google-cloud/language');
const defaultHandler = require('../../errorHandler');
const clientLanguage = new language.LanguageServiceClient({
  projectId: 'dime-app-208122',
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
      /\\n/g,
      '\n'
    ),
    client_email: process.env.GOOGLE_CLIENT_EMAIL
  }
});

router.post(
  '/',
  defaultHandler(async (req, res, next) => {

    let product = req.body.product;
    product = product.repeat(10)

    const document = {
      content: product,
      type: 'PLAIN_TEXT'
    };
    const textContent = await clientLanguage.classifyText({
      document: document
    });
    let classification = ''
    if (textContent[0].categories[0]) {
      classification = textContent[0].categories[0].name.slice(1);
    } else {
     classification = 'Could Not Retreive Category';
    }

    console.log(textContent[0].categories[0].name.slice(1))
    res.send(classification);
  })
);


module.exports = router
