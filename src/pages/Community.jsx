import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Community.css';
import StockSidebar from './StockSidebar';

const categories = ['general', 'sports', 'business', 'technology', 'health', 'entertainment', 'science'];

const Community = () => {
  const [newsData, setNewsData] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = 'd1c3f42daf094b1d8001356061954c6b'; // 🔑 Replace with your NewsAPI key
      const country = 'us';
      const fetchedData = {};

      for (let category of categories) {
        try {
          const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=6&apiKey=${apiKey}`
          );
          fetchedData[category] = response.data.articles;
        } catch (error) {
          console.error(`Error fetching ${category} news:`, error);
        }
      }

      setNewsData(fetchedData);
    };

    fetchNews();
  }, []);

  return (
    <div className="community-page">
      <header className="community-header">
        <button onClick={() => window.history.back()}>← Back</button>
        <h1>📰 Community News</h1>
      </header>

      <div className="community-content">
        <main className="news-sections">
          {categories.map((category) => (
            <div key={category} className="news-section">
              <h2 className="section-title">
                {category.charAt(0).toUpperCase() + category.slice(1)} News
              </h2>
              <div className="articles">
                {newsData[category] && newsData[category].length > 0 ? (
                  newsData[category].map((article, index) => (
                    <div key={index} className="article-card">
                      {article.urlToImage && (
                        <img src={article.urlToImage} alt={article.title} className="article-image" />
                      )}
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-description">{article.description}</p>
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                        Read more →
                      </a>
                    </div>
                  ))
                ) : (
                  <p>Loading {category} news...</p>
                )}
              </div>
            </div>
          ))}
        </main>

        <aside className="sidebar">
          <StockSidebar />
        </aside>
      </div>
    </div>
  );
};

export default Community;
