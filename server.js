require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const cors = require('cors');
const Pusher = require('pusher');
const NewsAPI = require('newsapi');

const app = express();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const fetchNews = (searchTerm, pageNum) =>
  newsapi.v2.everything({
    q: searchTerm,
    language: 'en',
    page: pageNum,
    pageSize: 5
  });

app.use(cors());

function updateFeed(topic) {
  let counter = 2;
  setInterval(async () => {
    try {
      const response = await fetchNews(topic, counter);
      // console.log(response);
      pusher.trigger('news-channel', 'update-news', {
        articles: response.articles
      });
      counter += 1;
    } catch (error) {
      console.log(error);
    }
  }, 5000);
}

app.get('/live', async (req, res) => {
  const topic = 'trump';
  try {
    const response = await fetchNews(topic, 1);
    // console.log(response);
    res.json(response.articles);
    updateFeed(topic);
  } catch (error) {
    console.log(error);
  }
});

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
