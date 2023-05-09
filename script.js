const searchTerm = document.getElementById('searchTerm');
const searchBtn = document.getElementById('searchBtn');
const newsContainer = document.getElementById('news');

searchBtn.addEventListener('click', async () => {
    const query = searchTerm.value.trim();
    if (query) {
        const apiKey = '9e4fd61b934b415c903b204866ce8319';
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error('Error fetching news data:', error);
        }
    }
});

function displayNews(articles) {
    let html = '';

    articles.forEach(article => {
        html += `
            <div class="news-item">
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>${article.description}</p>
                <small>Published: ${new Date(article.publishedAt).toLocaleString()}</small>
                <small> | Author: ${article.author ? article.author : 'N/A'}</small>
                <small> | Source: ${article.source.name}</small>
            </div>
        `;
    });
    
    newsContainer.innerHTML = html;
}
