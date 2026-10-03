document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navbar nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Set the correct active navigation item on every page.
  const page = location.pathname.split('/').pop() || 'index.html';
  if (nav) {
    nav.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href.split('#')[0] === page || (page === '' && href === 'index.html'));
    });
  }

  // Player photo repair: try Wikimedia first, then Wikipedia's thumbnail API, then a guaranteed initials fallback.
  document.querySelectorAll('.player-photo').forEach(box => {
    const img = box.querySelector('img');
    const fallback = box.querySelector('.photo-fallback');
    if (!img) return;
    const name = (img.alt || fallback?.textContent || 'Player').trim();
    let triedWiki = false;

    const showFallback = () => {
      img.classList.add('broken');
      if (fallback) fallback.style.display = 'grid';
    };

    const loadWikipediaThumbnail = async () => {
      if (triedWiki) return;
      triedWiki = true;
      try {
        const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/\s+/g, '_'))}`;
        const response = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('Wikipedia image unavailable');
        const data = await response.json();
        const thumb = data?.thumbnail?.source;
        if (!thumb) throw new Error('No thumbnail');
        img.classList.remove('broken');
        img.src = thumb;
      } catch (_) {
        showFallback();
      }
    };

    img.addEventListener('error', loadWikipediaThumbnail);
    img.addEventListener('load', () => {
      img.classList.remove('broken');
      if (fallback) fallback.style.display = 'none';
    });
    // Give failed/empty image elements a chance to use the API immediately.
    if (!img.getAttribute('src')) loadWikipediaThumbnail();
  });


  // Player profile routing
  const playerData = [{"name": "Erling Haaland", "position": "FW", "club": "Manchester City", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Erling_Haaland_2023_(cropped).jpg", "initials": "EH", "slug": "erling-haaland"}, {"name": "Phil Foden", "position": "MF", "club": "Manchester City", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Phil_Foden_2022.jpg", "initials": "PF", "slug": "phil-foden"}, {"name": "Rúben Dias", "position": "DF", "club": "Manchester City", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rúben_Dias_2021.jpg", "initials": "RD", "slug": "r-ben-dias"}, {"name": "Bruno Fernandes", "position": "MF", "club": "Manchester United", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bruno_Fernandes_2022.jpg", "initials": "BF", "slug": "bruno-fernandes"}, {"name": "Benjamin Šeško", "position": "FW", "club": "Manchester United", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Benjamin_Šeško_2025.jpg", "initials": "BS", "slug": "benjamin-e-ko"}, {"name": "Bryan Mbeumo", "position": "FW", "club": "Manchester United", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bryan_Mbeumo_2022.jpg", "initials": "BM", "slug": "bryan-mbeumo"}, {"name": "Bukayo Saka", "position": "FW", "club": "Arsenal", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bukayo_Saka_2022.jpg", "initials": "BS", "slug": "bukayo-saka"}, {"name": "Martin Ødegaard", "position": "MF", "club": "Arsenal", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Martin_Odegaard_2022.jpg", "initials": "MO", "slug": "martin-degaard"}, {"name": "Declan Rice", "position": "MF", "club": "Arsenal", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Declan_Rice_2022.jpg", "initials": "DR", "slug": "declan-rice"}, {"name": "Alexander Isak", "position": "FW", "club": "Liverpool", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Alexander_Isak_2024.jpg", "initials": "AI", "slug": "alexander-isak"}, {"name": "Florian Wirtz", "position": "MF", "club": "Liverpool", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Florian_Wirtz_2024.jpg", "initials": "FW", "slug": "florian-wirtz"}, {"name": "Virgil van Dijk", "position": "DF", "club": "Liverpool", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Virgil_van_Dijk_2019.jpg", "initials": "VD", "slug": "virgil-van-dijk"}, {"name": "Cole Palmer", "position": "MF", "club": "Chelsea", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cole_Palmer_2023.jpg", "initials": "CP", "slug": "cole-palmer"}, {"name": "Pedro Neto", "position": "FW", "club": "Chelsea", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pedro_Neto_2022.jpg", "initials": "PN", "slug": "pedro-neto"}, {"name": "Reece James", "position": "DF", "club": "Chelsea", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Reece_James_2022.jpg", "initials": "RJ", "slug": "reece-james"}, {"name": "Kaoru Mitoma", "position": "FW", "club": "Brighton & Hove Albion", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kaoru_Mitoma_2022.jpg", "initials": "KM", "slug": "kaoru-mitoma"}, {"name": "Jack Grealish", "position": "MF", "club": "Everton", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jack_Grealish_2022.jpg", "initials": "JG", "slug": "jack-grealish"}, {"name": "Jordan Pickford", "position": "GK", "club": "Everton", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jordan_Pickford_2022.jpg", "initials": "JP", "slug": "jordan-pickford"}, {"name": "Nicolas Jackson", "position": "FW", "club": "Aston Villa", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nicolas_Jackson_2023.jpg", "initials": "NJ", "slug": "nicolas-jackson"}, {"name": "John McGinn", "position": "MF", "club": "Aston Villa", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/John_McGinn_2022.jpg", "initials": "JM", "slug": "john-mcginn"}, {"name": "Ismaïla Sarr", "position": "FW", "club": "Crystal Palace", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ismaïla_Sarr_2024.jpg", "initials": "IS", "slug": "isma-la-sarr"}, {"name": "Jean-Philippe Mateta", "position": "FW", "club": "Crystal Palace", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Jean-Philippe_Mateta_2024.jpg", "initials": "JM", "slug": "jean-philippe-mateta"}, {"name": "Dominic Calvert-Lewin", "position": "FW", "club": "Leeds United", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Dominic_Calvert-Lewin_2022.jpg", "initials": "DC", "slug": "dominic-calvert-lewin"}, {"name": "Daniel James", "position": "FW", "club": "Leeds United", "image": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Daniel_James_2022.jpg", "initials": "DJ", "slug": "daniel-james"}];
  document.querySelectorAll('.clickable-player').forEach(card => {
    card.setAttribute('tabindex','0');
    const open = () => { const id = card.dataset.player; if (id) location.href = `player.html?player=${encodeURIComponent(id)}`; };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  if (location.pathname.endsWith('player.html')) {
    const id = new URLSearchParams(location.search).get('player');
    const p = playerData.find(x => x.slug === id);
    const host = document.getElementById('player-detail');
    if (host && p) {
      host.innerHTML = `<article class="player-profile-card"><div class="player-profile-media"><img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="photo-fallback profile-fallback">${p.initials}</span></div><div class="player-profile-copy"><span class="eyebrow">${p.position} · ${p.club}</span><h2>${p.name}</h2><div class="profile-meta"><div><small>CLUB</small><b>${p.club}</b></div><div><small>POSITION</small><b>${p.position}</b></div><div><small>SEASON</small><b>2026/27</b></div></div><p>This profile is part of THE 90's football information directory. Match statistics and live performance data can be connected to a football-data API in a future version.</p><a class="primary-btn" href="club.html#club-${({'Manchester City':'manchester-city','Manchester United':'manchester-united','Arsenal':'arsenal','Liverpool':'liverpool','Chelsea':'chelsea','Brighton & Hove Albion':'brighton','Everton':'everton','Aston Villa':'aston-villa','Crystal Palace':'crystal-palace','Leeds United':'leeds-united'}[p.club] || p.club.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))}">VIEW CLUB ↗</a></div></article>`;
    } else if (host) { host.innerHTML = '<div class="empty-state"><h3>PLAYER NOT FOUND</h3><p>Return to the player directory and select a profile.</p><a href="players.html">BACK TO PLAYERS →</a></div>'; }
  }

  // Player search
  const search = document.getElementById('playerSearch');
  if (search) {
    const cards = [...document.querySelectorAll('.premium-player,.player-card')];
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase().trim();
      cards.forEach(card => {
        card.style.display = (!q || card.textContent.toLowerCase().includes(q)) ? '' : 'none';
      });
    });
  }

  // Match competition filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const matches = document.querySelectorAll('.match-card[data-competition]');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    matches.forEach(match => {
      match.style.display = (filter === 'all' || match.dataset.competition === filter) ? '' : 'none';
    });
  }));

  // Dedicated club page: club.html#club-arsenal
  if (location.pathname.endsWith('club.html')) {
    const id = location.hash.replace('#', '');
    const target = id ? document.getElementById(id) : null;
    const host = document.getElementById('club-detail');
    const fallback = document.getElementById('club-fallback');
    if (target && host) {
      host.innerHTML = target.outerHTML;
      if (fallback) fallback.style.display = 'none';
      host.querySelector('.club-profile')?.classList.add('active-profile');
    }
  }

  // Global region tabs
  document.querySelectorAll('.region-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  }));

  // Story page: every news-card destination resolves to real content.
  if (location.pathname.endsWith('article.html')) {
    const stories = {
      'title-race': {
        tag: 'PREMIER LEAGUE · MATCHWEEK',
        title: 'THE TITLE RACE <span>IS HEATING UP</span>',
        deck: 'A matchweek story built around the moments, momentum and tactical shifts shaping the season.',
        meta: 'PREMIER LEAGUE · 5 MIN READ',
        body: '<p>Every matchweek adds another layer to the season. Results at the top of the table are being shaped by small margins: transitions, set pieces, squad depth and the ability to control decisive moments.</p><p>THE 90 tracks those details through the match centre, standings and player directory so the bigger picture is easy to follow without leaving the portal.</p>'
      },
      'midfield': {
        tag: 'ANALYSIS · TACTICS',
        title: 'WHY THE MIDFIELD BATTLE <span>COULD DECIDE THE NEXT BIG FIXTURE</span>',
        deck: 'Space, pressing and possession often decide where the game is won before the final third even comes into view.',
        meta: 'TACTICS · 6 MIN READ',
        body: '<p>Midfield battles are rarely just about possession totals. The important questions are where the ball is recovered, how quickly a team can progress it and whether the first defensive line can be broken.</p><p>For a premium match preview, those are the details worth watching: pressing triggers, rotations, overloads and the quality of the next pass.</p>'
      },
      'attacks': {
        tag: 'FEATURE · STATS',
        title: 'THE NUMBERS BEHIND <span>THE MOST PRODUCTIVE ATTACKS</span>',
        deck: 'Goals tell the story at the surface. Chance creation and shot quality explain more underneath it.',
        meta: 'STATS · 7 MIN READ',
        body: '<p>Productive attacks combine volume with quality. Teams that consistently create central chances, attack space after turnovers and move defenders before the final pass tend to create more repeatable opportunities.</p><p>THE 90 presents those patterns alongside fixtures, standings and player information to give the numbers some context.</p>'
      }
    };
    const key = new URLSearchParams(location.search).get('story') || 'title-race';
    const story = stories[key] || stories['title-race'];
    document.getElementById('story-tag').textContent = story.tag;
    document.getElementById('story-title').innerHTML = story.title;
    document.getElementById('story-deck').textContent = story.deck;
    document.getElementById('story-meta').textContent = story.meta;
    document.getElementById('story-body').innerHTML = story.body;
  }

});
