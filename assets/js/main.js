const languageButtons = document.querySelectorAll('[data-language]');
const currentLang = localStorage.getItem('stadioner-lang') || 'uk';
let activeLang = currentLang;

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const keys = element.dataset.i18n.split('.');
    let value = dict;
    for (const key of keys) {
      value = value?.[key];
      if (!value) break;
    }
    if (typeof value === 'string') {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-placeholder]').forEach((input) => {
    const keys = input.dataset.placeholder.split('.');
    let value = dict;
    for (const key of keys) {
      value = value?.[key];
      if (!value) break;
    }
    if (typeof value === 'string') {
      input.placeholder = value;
    }
  });

  document.querySelectorAll('[data-aria-label]').forEach((element) => {
    const keys = element.dataset.ariaLabel.split('.');
    let value = dict;
    for (const key of keys) {
      value = value?.[key];
      if (!value) break;
    }
    if (typeof value === 'string') {
      element.setAttribute('aria-label', value);
      element.setAttribute('title', value);
    }
  });

  const metaDescription = document.querySelector('meta[name="description"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', dict.seo?.description || '');
  }
  if (metaKeywords) {
    metaKeywords.setAttribute('content', dict.seo?.keywords || '');
  }

  if (typeof renderNews === 'function') {
    renderNews(lang);
  }

  languageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.language === lang);
  });

  localStorage.setItem('stadioner-lang', lang);
  activeLang = lang;
}

function formatDate(dateString, lang) {
  const date = new Date(dateString);
  return date.toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function renderNews(lang) {
  const newsContainer = document.querySelector('[data-news-list]');
  if (!newsContainer) return;
  newsContainer.innerHTML = '';

  newsItems.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.innerHTML = `
      <img src="${item.image}" alt="${item.title[lang]}" loading="lazy" />
      <div class="news-card-content">
        <span class="card-tag">${translations[lang].latestNews.published}</span>
        <h3 class="card-title">${item.title[lang]}</h3>
        <p class="card-description">${item.excerpt[lang]}</p>
        <div class="news-card-footer">
          <span>${formatDate(item.date, lang)}</span>
          <a class="button secondary" href="news-${item.slug}.html">${translations[lang].latestNews.readMore}</a>
        </div>
      </div>
    `;
    newsContainer.appendChild(article);
  });
}

function populateFeaturedNews(lang) {
  const featuredContainer = document.querySelector('[data-featured-news]');
  if (!featuredContainer) return;
  featuredContainer.innerHTML = '';
  newsItems.slice(0, 3).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-tag">${formatDate(item.date, lang)}</div>
      <h3 class="card-title">${item.title[lang]}</h3>
      <p class="card-description">${item.excerpt[lang]}</p>
      <div class="card-footer">
        <a href="news-${item.slug}.html" class="button secondary">${translations[lang].latestNews.readMore}</a>
      </div>
    `;
    featuredContainer.appendChild(card);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const lang = button.dataset.language;
    applyTranslations(lang);
    populateFeaturedNews(lang);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  populateFeaturedNews(activeLang);
  applyTranslations(activeLang);
});

window.addEventListener('storage', (event) => {
  if (event.key === 'stadioner-lang' && event.newValue && event.newValue !== activeLang) {
    applyTranslations(event.newValue);
    populateFeaturedNews(event.newValue);
  }
});
