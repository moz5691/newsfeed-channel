import React, { Component } from 'react';
import Pusher from 'pusher-js';
import pushid from 'pushid';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from './config/config';
import Input from './components/Input';

import './App.css';

class App extends Component {
  state = {
    newsItems: [],
    topic: ''
  };

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:5000/live');
      const articles = await response.json();
      this.setState({
        newsItems: [...this.state.newsItems, ...articles]
      });
    } catch (error) {
      console.log(error);
    }
    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      encrypted: true
    });
    const channel = pusher.subscribe('news-channel');
    channel.bind('update-news', data => {
      // console.log(data);
      this.setState({ newsItem: [...data.articles, ...this.state.newsItems] });
    });
  }

  handleInput = topic => {
    this.setState({ topic });
  };

  render() {
    const NewsItem = (article, id) => (
      <li key={id}>
        <a href={`${article.url}`}>{article.title}</a>
      </li>
    );
    const newsItems = this.state.newsItems.map(e => NewsItem(e, pushid()));
    return (
      <div className="App">
        <h3 className="App-title">Live Feed</h3>
        <Input className="input-field" onSubmit={this.handleInput} />
        <ul className="news-items">{newsItems}</ul>
      </div>
    );
  }
}

export default App;
