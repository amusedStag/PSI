var express = require('express');
var router = express.Router();
const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');
const websiteController = require('../controllers/websiteController');
const evalController = require('../controllers/evalController');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/init', async (req, res) => {
  try {
    // Clear the database
    await Website.deleteMany({});
    await WebsitePage.deleteMany({});

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);

    // Initialize collections with some values
    const websites = await Website.insertMany([
      {
        url: 'http://example.com',
        monitorState: 'Por avaliar',
        lastEvalDate: pastDate,
        registerDate: pastDate,
        webpages: [] // No webpages initially
      },
      {
        url: 'http://anotherexample.com',
        monitorState: 'Por avaliar',
        webpages: [] // No webpages initially
      }
    ]);

    const websitePages = await WebsitePage.insertMany([
      {
        website: websites[0]._id, // Reference the first website
        url: 'http://www.example.com/page1',
        pageState: 'Conforme'
      },
      {
        website: websites[0]._id, // Reference the first website
        url: 'http://www.example.com/page2',
        pageState: 'Não conforme'
      },
      {
        website: websites[1]._id, // Reference the second website
        url: 'http://www.anotherexample.com/page1',
        pageState: 'Conforme'
      }
    ]);

    res.json({ message: 'Database initialized', websites, websitePages });
  } catch (err) {
    console.error("Error resetting database:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/websites', websiteController.website_list);

router.get('/website/:id', websiteController.website_detail);

router.post('/website', websiteController.website_create_post);

router.put('/website/:id/addpage', websiteController.website_update_pages);

router.delete('/website/:id', websiteController.website_delete_post);

router.delete('/website/:websiteId/deletepage/:webpageId', websiteController.website_delete_page);

router.post('/website/:id/eval', evalController.website_evaluate);




module.exports = router;
