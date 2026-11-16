/* AI-Ready University 观测台 · 主题板块
 * 在首页 hero 下方注入「三大主题板块」：
 * AI for Science（已上线，跳 AI4S 观测台）/ AI for Education（建设中）/ AI for 大学治理（建设中）
 * 不改动站点原有 bundle，纯 DOM 注入；样式复用站点卡片体系。
 */
(function () {
  'use strict';

  var CSS = [
    '.airu-theme-card{display:block;text-decoration:none}',
    '.airu-theme-card.is-soon{opacity:.55}',
    '.airu-theme-card.is-soon:hover{transform:none;box-shadow:none}',
    '.airu-theme-card .card-date{letter-spacing:.08em}'
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('airu-themes-css')) return;
    var st = document.createElement('style');
    st.id = 'airu-themes-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function isHome() {
    var h = location.hash;
    return h === '' || h === '#' || h === '#/';
  }

  function build() {
    var sec = document.createElement('section');
    sec.className = 'section shell airu-themes';
    sec.innerHTML =
      '<div class="section-head"><div>' +
      '<span class="eyebrow-dark">THEMES — 主题板块</span>' +
      '<h2>三大主题板块</h2>' +
      '<p>按大学使命的三个方向组织观测：科研、教学与治理。已上线的板块点击进入，建设中的板块先行占位。</p>' +
      '</div></div>' +
      '<div class="card-grid">' +
      '<a class="card airu-theme-card" href="https://ai4s.bestsi.org" style="--accent:#2f6be4">' +
        '<div class="card-kicker"><span class="card-no">T-01</span><span class="card-date">已上线</span></div>' +
        '<h3>AI for Science</h3>' +
        '<p>高校科学智能基础设施：校级智算与算力底座、面向师生的大模型与 Token 服务、科学数据与工具链、科研智能体与自主实验室。</p>' +
        '<div class="card-foot"><span class="chip"><i></i>进入 AI4S 观测台 →</span></div>' +
      '</a>' +
      '<div class="card airu-theme-card is-soon" style="--accent:#0fa389">' +
        '<div class="card-kicker"><span class="card-no">T-02</span><span class="card-date">建设中</span></div>' +
        '<h3>AI for Education</h3>' +
        '<p>AI 赋能教学：智慧课程与智能助教、个性化学习、教学评价与教师发展、AI 素养教育。</p>' +
        '<div class="card-foot"><span class="chip is-plain">敬请期待</span></div>' +
      '</div>' +
      '<div class="card airu-theme-card is-soon" style="--accent:#7d55cf">' +
        '<div class="card-kicker"><span class="card-no">T-03</span><span class="card-date">建设中</span></div>' +
        '<h3>AI for 大学治理</h3>' +
        '<p>数据驱动的大学治理：智慧校园与一网通办、管理决策支持、资源调配与流程智能化。</p>' +
        '<div class="card-foot"><span class="chip is-plain">敬请期待</span></div>' +
      '</div>' +
      '</div>';
    return sec;
  }

  function ensureThemes() {
    if (!isHome()) {
      var old = document.querySelector('.airu-themes');
      if (old) old.remove();
      return;
    }
    if (document.querySelector('.airu-themes')) return;
    var hero = document.querySelector('header.instrument');
    if (!hero || !hero.parentNode) return;
    hero.after(build());
  }

  injectCSS();
  var obs = new MutationObserver(function () { ensureThemes(); });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('hashchange', function () { setTimeout(ensureThemes, 60); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureThemes);
  } else { ensureThemes(); }
})();
