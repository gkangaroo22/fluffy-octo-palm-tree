// === PERSONALIZED RECOMMENDATIONS ENGINE ===
// Learns from user behavior, scores recommendations, and proactively suggests

var RecEngine = (function() {
  'use strict';

  // ============================================================
  // RECOMMENDATION DATABASE — Curated NYC picks
  // ============================================================
  var database = [
    // --- HIDDEN GEM RESTAURANTS ---
    {
      id: 'rec-la-morada',
      name: 'La Morada',
      type: 'Restaurant',
      category: 'dining',
      neighborhood: 'bronx',
      address: '308 Willis Ave, Bronx, NY 10454',
      tags: ['hidden-gem', 'food', 'latin', 'affordable', 'community'],
      priceRange: '$',
      timeWindow: 'afternoon',
      emoji: '🫔',
      hiddenGem: true,
      description: 'Family-run Oaxacan restaurant serving some of NYC\'s best mole. Beloved by food critics but missed by most tourists — the kind of place locals guard jealously.',
      matchReason: 'Off the beaten path with incredible soul — just like the spots you love.'
    },
    {
      id: 'rec-cafe-erzulie',
      name: 'Cafe Erzulie',
      type: 'Restaurant',
      category: 'dining',
      neighborhood: 'bushwick',
      address: '894 Broadway, Brooklyn, NY 11206',
      tags: ['hidden-gem', 'food', 'vegan', 'caribbean', 'lgbtq', 'community'],
      priceRange: '$$',
      timeWindow: 'afternoon',
      emoji: '🌱',
      hiddenGem: true,
      description: 'Queer-owned vegan Haitian cafe in Bushwick. Tropical vibes, incredible plant-based Caribbean food, and a welcoming community spirit.',
      matchReason: 'Queer-owned, community-driven, and the food is extraordinary.'
    },
    {
      id: 'rec-wo-hop',
      name: 'Wo Hop',
      type: 'Restaurant',
      category: 'dining',
      neighborhood: 'chinatown',
      address: '17 Mott St, New York, NY 10013',
      tags: ['hidden-gem', 'food', 'late-night', 'affordable', 'classic-nyc'],
      priceRange: '$',
      timeWindow: 'late-night',
      emoji: '🥡',
      hiddenGem: true,
      description: 'Underground Chinatown institution open until 4 AM. The basement location has been serving classic Chinese-American dishes since 1938. Perfect post-club fuel.',
      matchReason: 'The ultimate late-night spot — open until 4 AM, perfect after dancing all night.'
    },
    {
      id: 'rec-aunts-et-uncles',
      name: 'Aunts et Uncles',
      type: 'Restaurant',
      category: 'dining',
      neighborhood: 'brooklyn',
      address: '74 Jefferson St, Brooklyn, NY 11206',
      tags: ['hidden-gem', 'food', 'brunch', 'lgbtq', 'community', 'affordable'],
      priceRange: '$$',
      timeWindow: 'morning',
      emoji: '🍳',
      hiddenGem: true,
      description: 'Queer-owned comfort food spot where you pay what you can. A space built on radical generosity, serving incredible brunch and community warmth.',
      matchReason: 'Queer-owned, pay-what-you-can, and genuinely transformative brunch.'
    },
    {
      id: 'rec-red-rooster',
      name: 'Red Rooster',
      type: 'Restaurant',
      category: 'dining',
      neighborhood: 'harlem',
      address: '310 Lenox Ave, New York, NY 10027',
      tags: ['food', 'soul-food', 'harlem', 'celebrity', 'brunch'],
      priceRange: '$$$',
      timeWindow: 'afternoon',
      emoji: '🐓',
      hiddenGem: false,
      description: 'Marcus Samuelsson\'s Harlem flagship. A celebration of Black culture through food, with live music and an electric atmosphere. Steps from Sylvia\'s.',
      matchReason: 'You\'re already in Harlem for Sylvia\'s — this is the perfect complement.'
    },

    // --- HIDDEN GEM NIGHTLIFE ---
    {
      id: 'rec-house-of-yes',
      name: 'House of Yes',
      type: 'Bar & Venue',
      category: 'party',
      neighborhood: 'bushwick',
      address: '2 Wyckoff Ave, Brooklyn, NY 11237',
      tags: ['nightlife', 'dance', 'lgbtq', 'performance', 'community', 'costumes'],
      priceRange: '$$',
      timeWindow: 'late-night',
      emoji: '🎪',
      hiddenGem: true,
      description: 'A spectacle of circus arts, burlesque, drag, and dancing in a converted warehouse. Every night is a celebration of self-expression and community.',
      matchReason: 'If you love Nocturnal\'s warehouse energy, this is its artistic cousin.'
    },
    {
      id: 'rec-nowadays',
      name: 'Nowadays',
      type: 'Club & Garden',
      category: 'party',
      neighborhood: 'ridgewood',
      address: '56-06 Cooper Ave, Queens, NY 11385',
      tags: ['hidden-gem', 'nightlife', 'dance', 'outdoor', 'underground', 'electronic'],
      priceRange: '$$',
      timeWindow: 'late-night',
      emoji: '🌿',
      hiddenGem: true,
      description: 'Indoor/outdoor dance venue on the Brooklyn-Queens border. Think garden party meets underground rave. The outdoor space is magical in any weather.',
      matchReason: 'Underground electronic music with an outdoor garden — a different vibe from BASEMENT but equally legendary.'
    },
    {
      id: 'rec-julius-bar',
      name: 'Julius\' Bar',
      type: 'Bar',
      category: 'nightlife',
      neighborhood: 'west-village',
      address: '159 W 10th St, New York, NY 10014',
      tags: ['hidden-gem', 'lgbtq', 'historic', 'classic-nyc', 'affordable', 'community'],
      priceRange: '$',
      timeWindow: 'evening',
      emoji: '🏳️‍🌈',
      hiddenGem: true,
      description: 'The oldest gay bar in NYC, operating since 1966. A piece of living queer history in the West Village. Unpretentious, welcoming, and deeply meaningful.',
      matchReason: 'A pilgrimage for anyone who loves queer history and community.'
    },
    {
      id: 'rec-3-dollar-bill',
      name: '3 Dollar Bill',
      type: 'Club & Venue',
      category: 'party',
      neighborhood: 'bushwick',
      address: '260 Meserole St, Brooklyn, NY 11206',
      tags: ['lgbtq', 'nightlife', 'dance', 'drag', 'performance', 'community'],
      priceRange: '$$',
      timeWindow: 'late-night',
      emoji: '💃',
      hiddenGem: false,
      description: 'Brooklyn\'s premier queer performance and dance venue. From drag shows to DJ nights, it\'s a space where the community shines.',
      matchReason: 'The vogue and drag scene here is world-class — right in your wheelhouse.'
    },
    {
      id: 'rec-metropolitan',
      name: 'Metropolitan',
      type: 'Bar',
      category: 'nightlife',
      neighborhood: 'williamsburg',
      address: '559 Lorimer St, Brooklyn, NY 11211',
      tags: ['hidden-gem', 'lgbtq', 'affordable', 'low-key', 'outdoor', 'community'],
      priceRange: '$',
      timeWindow: 'evening',
      emoji: '🍻',
      hiddenGem: true,
      description: 'Low-key queer bar in Williamsburg with a big outdoor patio. The kind of place where you end up in a 3-hour conversation with a stranger who becomes a friend.',
      matchReason: 'Your intention is to make new friends — this is the place for it.'
    },

    // --- HIDDEN GEM CULTURE & ACTIVITIES ---
    {
      id: 'rec-leslie-lohman',
      name: 'Leslie-Lohman Museum',
      type: 'Museum',
      category: 'culture',
      neighborhood: 'soho',
      address: '26 Wooster St, New York, NY 10013',
      tags: ['hidden-gem', 'art', 'lgbtq', 'free', 'culture', 'museum'],
      priceRange: 'Free',
      timeWindow: 'afternoon',
      emoji: '🎨',
      hiddenGem: true,
      description: 'The world\'s first dedicated LGBTQ+ art museum. Free admission, rotating exhibitions, and a profound collection of queer art spanning centuries.',
      matchReason: 'You love MoMA — this is art through a queer lens, and it\'s free.'
    },
    {
      id: 'rec-lot-radio',
      name: 'The Lot Radio',
      type: 'Activity',
      category: 'culture',
      neighborhood: 'williamsburg',
      address: '17 Nassau Ave, Brooklyn, NY 11222',
      tags: ['hidden-gem', 'music', 'outdoor', 'free', 'community', 'coffee'],
      priceRange: 'Free',
      timeWindow: 'afternoon',
      emoji: '📻',
      hiddenGem: true,
      description: 'An independent online radio station broadcasting live from a glass booth on a Greenpoint corner. DJs spin while you sip coffee and watch the neighborhood go by.',
      matchReason: 'Free, unexpected, and deeply NYC — music and community in the open air.'
    },
    {
      id: 'rec-green-wood',
      name: 'Green-Wood Cemetery',
      type: 'Activity',
      category: 'culture',
      neighborhood: 'brooklyn',
      address: '500 25th St, Brooklyn, NY 11232',
      tags: ['hidden-gem', 'outdoor', 'architecture', 'peaceful', 'free', 'brooklyn'],
      priceRange: 'Free',
      timeWindow: 'afternoon',
      emoji: '🏛️',
      hiddenGem: true,
      description: 'A National Historic Landmark with stunning Gothic architecture, panoramic Manhattan views, and peaceful paths. Jean-Michel Basquiat is buried here.',
      matchReason: 'Art, history, and breathtaking views — an unexpected Brooklyn treasure near your hotel.'
    },
    {
      id: 'rec-gibney-dance',
      name: 'Gibney Dance',
      type: 'Activity',
      category: 'dance',
      neighborhood: 'downtown-manhattan',
      address: '280 Broadway, New York, NY 10007',
      tags: ['dance', 'classes', 'community', 'affordable', 'contemporary'],
      priceRange: '$$',
      timeWindow: 'afternoon',
      emoji: '🩰',
      hiddenGem: false,
      description: 'Drop-in dance classes in a stunning historic building near City Hall. Contemporary, ballet, hip hop, and more — a dancer\'s sanctuary in Lower Manhattan.',
      matchReason: 'You\'re already taking two vogue classes — why not add one more style to the mix?'
    },

    // --- PROACTIVE / TIME-SENSITIVE ---
    {
      id: 'rec-apollo',
      name: 'Apollo Theater Amateur Night',
      type: 'Experience',
      category: 'culture',
      neighborhood: 'harlem',
      address: '253 W 125th St, New York, NY 10027',
      tags: ['culture', 'music', 'harlem', 'historic', 'classic-nyc', 'performance'],
      priceRange: '$$',
      timeWindow: 'evening',
      emoji: '🎤',
      hiddenGem: false,
      proactiveMsg: 'You\'re heading to Harlem for brunch — Amateur Night at the Apollo is legendary!',
      description: 'The legendary Amateur Night at the Apollo. Where Ella Fitzgerald, James Brown, and countless legends got their start. A Harlem institution since 1934.',
      matchReason: 'You\'re already in Harlem for Sylvia\'s — the Apollo is right around the corner.'
    },
    {
      id: 'rec-smorgasburg',
      name: 'Smorgasburg',
      type: 'Food Market',
      category: 'dining',
      neighborhood: 'williamsburg',
      address: '90 Kent Ave, Brooklyn, NY 11249',
      tags: ['food', 'outdoor', 'weekend', 'brooklyn', 'community'],
      priceRange: '$$',
      timeWindow: 'afternoon',
      emoji: '🥘',
      hiddenGem: false,
      proactiveMsg: 'It\'s the weekend — Smorgasburg food market is open with 100+ vendors!',
      description: 'NYC\'s largest open-air food market with 100+ vendors every weekend. From ramen burgers to rainbow grilled cheese — it\'s a food lover\'s paradise on the Williamsburg waterfront.',
      matchReason: 'A weekend-only food market right in Brooklyn — perfect for exploring between events.'
    },
    {
      id: 'rec-brooklyn-flea',
      name: 'Brooklyn Flea at DUMBO',
      type: 'Market',
      category: 'culture',
      neighborhood: 'dumbo',
      address: '80 Pearl St, Brooklyn, NY 11201',
      tags: ['hidden-gem', 'shopping', 'vintage', 'brooklyn', 'weekend', 'affordable'],
      priceRange: '$',
      timeWindow: 'afternoon',
      emoji: '🛍️',
      hiddenGem: true,
      proactiveMsg: 'Weekend alert — Brooklyn Flea has vintage finds and unique NYC souvenirs!',
      description: 'Curated vintage clothing, antiques, and local artisan goods under the Manhattan Bridge. The ultimate treasure hunt with stunning bridge views.',
      matchReason: 'Vintage finds and unique treasures — perfect for that trip outfit or accessory.'
    },
    {
      id: 'rec-stonewall',
      name: 'Stonewall Inn',
      type: 'Bar',
      category: 'nightlife',
      neighborhood: 'west-village',
      address: '53 Christopher St, New York, NY 10014',
      tags: ['lgbtq', 'historic', 'classic-nyc', 'nightlife', 'community'],
      priceRange: '$',
      timeWindow: 'evening',
      emoji: '🏳️‍🌈',
      hiddenGem: false,
      description: 'The birthplace of the modern LGBTQ+ rights movement. A National Historic Landmark and still an active, welcoming bar. History lives here.',
      matchReason: 'Every trip to NYC deserves a moment at Stonewall — where it all began.'
    }
  ];

  // ============================================================
  // EVENT → CATEGORY MAPPING (for learning from bookmarks)
  // ============================================================
  var eventCategories = {
    'event-checkin': { cats: ['travel'], tags: ['brooklyn'], neighborhoods: ['brooklyn'] },
    'event-explore': { cats: ['culture'], tags: ['outdoor', 'brooklyn'], neighborhoods: ['brooklyn'] },
    'event-holywater': { cats: ['dining'], tags: ['food', 'upscale'], neighborhoods: ['downtown-manhattan'] },
    'event-bars': { cats: ['nightlife', 'party'], tags: ['lgbtq', 'nightlife'], neighborhoods: ['hells-kitchen'] },
    'event-nocturnal': { cats: ['party', 'dance'], tags: ['underground', 'dance', 'electronic', 'nightlife'], neighborhoods: ['bushwick'] },
    'event-vogue1': { cats: ['dance'], tags: ['dance', 'vogue', 'classes'], neighborhoods: ['midtown'] },
    'event-moma': { cats: ['culture', 'art'], tags: ['art', 'museum', 'culture'], neighborhoods: ['midtown'] },
    'event-vogue2': { cats: ['dance'], tags: ['dance', 'vogue', 'classes'], neighborhoods: ['midtown'] },
    'event-dweller': { cats: ['culture', 'art'], tags: ['art', 'immersive', 'community'], neighborhoods: ['brooklyn'] },
    'event-basement': { cats: ['party', 'dance'], tags: ['underground', 'dance', 'electronic', 'nightlife'], neighborhoods: ['bushwick'] },
    'event-brunch': { cats: ['dining'], tags: ['food', 'soul-food', 'brunch', 'harlem'], neighborhoods: ['harlem'] },
    'event-ballet': { cats: ['culture', 'dance'], tags: ['dance', 'performance', 'classic-nyc'], neighborhoods: ['lincoln-center'] },
    'event-birthday-dinner': { cats: ['dining'], tags: ['food', 'upscale'], neighborhoods: ['midtown'] },
    'event-cock': { cats: ['nightlife', 'party'], tags: ['lgbtq', 'nightlife', 'late-night'], neighborhoods: ['east-village'] }
  };

  // ============================================================
  // PROFILE MANAGEMENT
  // ============================================================
  var profile;

  var defaultProfile = {
    interests: { dining: 40, dance: 40, party: 40, culture: 40, nightlife: 40, art: 40 },
    tagScores: {},
    neighborhoodScores: {},
    travelPref: 'any',
    hiddenGemsPreferred: true,
    explicitInterests: {},
    dismissed: [],
    saved: [],
    notificationsEnabled: true,
    lastNotificationTime: null,
    shownNotifications: [],
    interactionCount: 0,
    lastLearnedAt: null
  };

  function loadProfile() {
    try {
      var saved = localStorage.getItem('recProfile');
      if (saved) {
        var parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        for (var key in defaultProfile) {
          if (!(key in parsed)) parsed[key] = defaultProfile[key];
        }
        return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(defaultProfile));
  }

  function saveProfile() {
    try {
      localStorage.setItem('recProfile', JSON.stringify(profile));
    } catch (e) {}
  }

  // ============================================================
  // PREFERENCE LEARNING
  // ============================================================
  function learnFromBookmarks() {
    var bookmarks = {};
    try {
      bookmarks = JSON.parse(localStorage.getItem('bookmarkedEvents') || '{}');
    } catch (e) { return; }

    for (var eventId in bookmarks) {
      if (!bookmarks[eventId]) continue;
      var mapping = eventCategories[eventId];
      if (!mapping) continue;

      // Boost interest categories
      mapping.cats.forEach(function(cat) {
        profile.interests[cat] = Math.min(100, (profile.interests[cat] || 0) + 15);
      });

      // Boost tag scores
      mapping.tags.forEach(function(tag) {
        profile.tagScores[tag] = Math.min(50, (profile.tagScores[tag] || 0) + 8);
      });

      // Boost neighborhood scores
      mapping.neighborhoods.forEach(function(hood) {
        profile.neighborhoodScores[hood] = Math.min(50, (profile.neighborhoodScores[hood] || 0) + 10);
      });
    }
  }

  function learnFromTravelInfo() {
    // Check which travel info sections have been opened (stored in their show state)
    var travelSections = document.querySelectorAll('.travel-info.show');
    travelSections.forEach(function(section) {
      var text = section.textContent.toLowerCase();
      if (text.indexOf('uber') !== -1 || text.indexOf('lyft') !== -1) {
        profile.travelPref = 'rideshare';
      }
      if (text.indexOf('train') !== -1 || text.indexOf('subway') !== -1) {
        profile.travelPref = 'subway';
      }
    });
  }

  function learnFromItinerary() {
    // The user's existing itinerary tells us a LOT about their interests
    // Dance classes = dance lover
    profile.interests.dance = Math.max(profile.interests.dance, 70);
    // Underground parties = nightlife lover
    profile.interests.party = Math.max(profile.interests.party, 65);
    profile.interests.nightlife = Math.max(profile.interests.nightlife, 65);
    // MoMA + World Dweller = art & culture lover
    profile.interests.culture = Math.max(profile.interests.culture, 60);
    profile.interests.art = Math.max(profile.interests.art, 60);
    // Multiple dinners = food lover
    profile.interests.dining = Math.max(profile.interests.dining, 55);

    // Baseline tags from itinerary
    var baseTags = ['dance', 'lgbtq', 'underground', 'nightlife', 'art', 'food', 'community', 'vogue'];
    baseTags.forEach(function(tag) {
      profile.tagScores[tag] = Math.max(profile.tagScores[tag] || 0, 15);
    });

    // Baseline neighborhoods from itinerary
    var baseHoods = ['brooklyn', 'bushwick', 'midtown', 'harlem', 'east-village'];
    baseHoods.forEach(function(hood) {
      profile.neighborhoodScores[hood] = Math.max(profile.neighborhoodScores[hood] || 0, 10);
    });
  }

  function learnAll() {
    learnFromItinerary();
    learnFromBookmarks();
    learnFromTravelInfo();
    profile.lastLearnedAt = new Date().toISOString();
    saveProfile();
  }

  // ============================================================
  // SCORING ALGORITHM
  // ============================================================
  function scoreRecommendation(rec) {
    var score = 30; // baseline

    // 1. Category match (0–30 pts)
    var catScore = profile.interests[rec.category] || 0;
    score += Math.round(catScore * 0.3);

    // 2. Tag overlap (0–25 pts)
    var tagPoints = 0;
    rec.tags.forEach(function(tag) {
      if (profile.tagScores[tag]) {
        tagPoints += Math.min(5, profile.tagScores[tag] / 3);
      }
      // Explicit interests boost
      if (profile.explicitInterests[tag]) {
        tagPoints += 4;
      }
    });
    score += Math.min(25, Math.round(tagPoints));

    // 3. Hidden gem bonus (0–15 pts)
    if (rec.hiddenGem && profile.hiddenGemsPreferred) {
      score += 15;
    }

    // 4. Neighborhood proximity (0–10 pts)
    if (profile.neighborhoodScores[rec.neighborhood]) {
      score += Math.min(10, profile.neighborhoodScores[rec.neighborhood]);
    }

    // 5. LGBTQ+ community bonus (0–5 pts)
    if (rec.tags.indexOf('lgbtq') !== -1) {
      score += 5;
    }

    // Cap at 99
    return Math.min(99, Math.max(10, score));
  }

  // ============================================================
  // RECOMMENDATION RETRIEVAL
  // ============================================================
  function getRecommendations(filterCategory, count) {
    count = count || 50;
    learnAll();

    var scored = database
      .filter(function(rec) {
        // Filter out dismissed
        if (profile.dismissed.indexOf(rec.id) !== -1) return false;
        // Filter by category if specified
        if (filterCategory && filterCategory !== 'all') {
          if (filterCategory === 'hidden-gems') return rec.hiddenGem;
          if (filterCategory === 'saved') return profile.saved.indexOf(rec.id) !== -1;
          return rec.category === filterCategory;
        }
        return true;
      })
      .map(function(rec) {
        return { rec: rec, score: scoreRecommendation(rec) };
      })
      .sort(function(a, b) { return b.score - a.score; });

    return scored.slice(0, count);
  }

  function getHiddenGems(count) {
    return getRecommendations('hidden-gems', count || 5);
  }

  // ============================================================
  // PROACTIVE NOTIFICATIONS
  // ============================================================
  function checkNotifications() {
    if (!profile.notificationsEnabled) return;

    // Only show one notification per session
    if (sessionStorage.getItem('recNotifShown')) return;

    var now = new Date();
    var candidates = [];

    database.forEach(function(rec) {
      if (!rec.proactiveMsg) return;
      if (profile.shownNotifications.indexOf(rec.id) !== -1) return;
      if (profile.dismissed.indexOf(rec.id) !== -1) return;
      candidates.push(rec);
    });

    if (candidates.length === 0) return;

    // Pick the best matching one
    var best = null;
    var bestScore = 0;
    candidates.forEach(function(rec) {
      var s = scoreRecommendation(rec);
      if (s > bestScore) {
        bestScore = s;
        best = rec;
      }
    });

    if (!best) return;

    // Delay the notification so it doesn't fire on load immediately
    setTimeout(function() {
      showProactiveNotification(best);
    }, 5000);
  }

  function showProactiveNotification(rec) {
    sessionStorage.setItem('recNotifShown', 'true');
    profile.shownNotifications.push(rec.id);
    saveProfile();

    // Create notification banner
    var banner = document.createElement('div');
    banner.className = 'rec-notification';
    banner.innerHTML =
      '<div class="rec-notif-content">' +
        '<div class="rec-notif-header">' +
          '<span class="rec-notif-icon">' + rec.emoji + '</span>' +
          '<span class="rec-notif-label">Recommendation</span>' +
          '<button class="rec-notif-close" onclick="RecEngine.dismissNotification(this)" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="rec-notif-title">' + rec.name + '</div>' +
        '<div class="rec-notif-msg">' + rec.proactiveMsg + '</div>' +
        '<button class="rec-notif-action" onclick="RecEngine.openForYou(this)">View Recommendation</button>' +
      '</div>';

    document.body.appendChild(banner);

    // Animate in
    setTimeout(function() { banner.classList.add('visible'); }, 50);

    // Update notification bell
    updateNotifBadge(1);
  }

  function dismissNotification(btn) {
    var banner = btn.closest('.rec-notification');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(function() { banner.remove(); }, 400);
    }
  }

  function openForYou(btn) {
    dismissNotification(btn);
    // Open the For You tab
    var tabBtn = document.querySelectorAll('.tab-btn')[1]; // For You is 2nd tab
    if (tabBtn) tabBtn.click();
  }

  function updateNotifBadge(count) {
    var badge = document.getElementById('rec-notif-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  // ============================================================
  // SURPRISE ME — Random hidden gem reveal
  // ============================================================
  function surpriseMe() {
    var gems = database.filter(function(rec) {
      return rec.hiddenGem && profile.dismissed.indexOf(rec.id) === -1;
    });
    if (gems.length === 0) {
      showToast('You\'ve seen all the hidden gems!', '✨');
      return;
    }

    var pick = gems[Math.floor(Math.random() * gems.length)];

    // Dramatic reveal
    var overlay = document.createElement('div');
    overlay.className = 'surprise-overlay';
    overlay.innerHTML =
      '<div class="surprise-card">' +
        '<div class="surprise-emoji">' + pick.emoji + '</div>' +
        '<div class="surprise-label">Hidden Gem</div>' +
        '<div class="surprise-name">' + pick.name + '</div>' +
        '<div class="surprise-desc">' + pick.description + '</div>' +
        '<div class="surprise-actions">' +
          '<button class="surprise-save" onclick="RecEngine.saveRec(\'' + pick.id + '\'); this.closest(\'.surprise-overlay\').remove();">Save</button>' +
          '<button class="surprise-close" onclick="this.closest(\'.surprise-overlay\').remove();">Close</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    setTimeout(function() { overlay.classList.add('visible'); }, 50);
  }

  // ============================================================
  // SAVE / DISMISS
  // ============================================================
  function saveRec(id) {
    if (profile.saved.indexOf(id) === -1) {
      profile.saved.push(id);
      saveProfile();
      showToast('Recommendation saved!', '💛');
      renderRecommendations();
    }
  }

  function unsaveRec(id) {
    var idx = profile.saved.indexOf(id);
    if (idx !== -1) {
      profile.saved.splice(idx, 1);
      saveProfile();
      renderRecommendations();
    }
  }

  function dismissRec(id) {
    if (profile.dismissed.indexOf(id) === -1) {
      profile.dismissed.push(id);
      saveProfile();
      renderRecommendations();
    }
  }

  // ============================================================
  // EXPLICIT PREFERENCE TOGGLES
  // ============================================================
  function toggleInterest(tag) {
    if (profile.explicitInterests[tag]) {
      delete profile.explicitInterests[tag];
    } else {
      profile.explicitInterests[tag] = true;
    }
    saveProfile();
    renderRecommendations();
  }

  function toggleHiddenGems() {
    profile.hiddenGemsPreferred = !profile.hiddenGemsPreferred;
    saveProfile();
    renderRecommendations();
  }

  function toggleNotifications() {
    profile.notificationsEnabled = !profile.notificationsEnabled;
    saveProfile();
    renderNotifToggle();
  }

  function resetProfile() {
    profile = JSON.parse(JSON.stringify(defaultProfile));
    saveProfile();
    renderAll();
    showToast('Preferences reset', '🔄');
  }

  // ============================================================
  // UI RENDERING
  // ============================================================
  var currentFilter = 'all';

  function renderAll() {
    renderProfileSummary();
    renderPreferenceToggles();
    renderFilters();
    renderRecommendations();
    renderNotifToggle();
  }

  function renderProfileSummary() {
    var el = document.getElementById('recs-profile');
    if (!el) return;

    learnAll();

    // Find top interests
    var sorted = Object.keys(profile.interests).sort(function(a, b) {
      return profile.interests[b] - profile.interests[a];
    });
    var top3 = sorted.slice(0, 3);

    var interestLabels = {
      dining: '🍽️ Food & Dining',
      dance: '💃 Dance',
      party: '🎉 Nightlife & Parties',
      culture: '🏛️ Culture & Arts',
      nightlife: '🌙 Nightlife',
      art: '🎨 Art'
    };

    var barsHtml = '';
    sorted.forEach(function(cat) {
      var val = profile.interests[cat];
      var label = interestLabels[cat] || cat;
      barsHtml +=
        '<div class="recs-interest-row">' +
          '<span class="recs-interest-label">' + label + '</span>' +
          '<div class="recs-interest-bar-bg">' +
            '<div class="recs-interest-bar" style="width: ' + val + '%"></div>' +
          '</div>' +
          '<span class="recs-interest-val">' + val + '</span>' +
        '</div>';
    });

    el.innerHTML =
      '<div class="recs-profile-header">' +
        '<span style="font-size: 1.5rem;">🧠</span>' +
        '<strong>Your Interest Profile</strong>' +
      '</div>' +
      '<div class="recs-profile-subtitle">Learned from your itinerary, bookmarks, and preferences</div>' +
      '<div class="recs-interest-bars">' + barsHtml + '</div>';
  }

  function renderPreferenceToggles() {
    var el = document.getElementById('recs-prefs');
    if (!el) return;

    var interestTags = [
      { tag: 'lgbtq', label: 'LGBTQ+ Spaces', emoji: '🏳️‍🌈' },
      { tag: 'dance', label: 'Dance', emoji: '💃' },
      { tag: 'underground', label: 'Underground', emoji: '🔊' },
      { tag: 'food', label: 'Food', emoji: '🍽️' },
      { tag: 'art', label: 'Art', emoji: '🎨' },
      { tag: 'community', label: 'Community', emoji: '💜' },
      { tag: 'late-night', label: 'Late Night', emoji: '🌙' },
      { tag: 'outdoor', label: 'Outdoor', emoji: '🌿' }
    ];

    var togglesHtml = interestTags.map(function(item) {
      var active = profile.explicitInterests[item.tag] ? ' active' : '';
      return '<button class="recs-pref-pill' + active + '" onclick="RecEngine.toggleInterest(\'' + item.tag + '\')">' +
        item.emoji + ' ' + item.label +
      '</button>';
    }).join('');

    var gemActive = profile.hiddenGemsPreferred ? ' active' : '';

    el.innerHTML =
      '<div class="recs-prefs-header">' +
        '<span style="font-size: 1.2rem;">✨</span>' +
        '<strong>Tell Us What You Love</strong>' +
      '</div>' +
      '<div class="recs-prefs-subtitle">Tap to boost these in your recommendations</div>' +
      '<div class="recs-pref-pills">' + togglesHtml + '</div>' +
      '<button class="recs-pref-pill gem-pill' + gemActive + '" onclick="RecEngine.toggleHiddenGems()">' +
        '💎 Prefer Hidden Gems' +
      '</button>';
  }

  function renderFilters() {
    var el = document.getElementById('recs-filters');
    if (!el) return;

    var filters = [
      { key: 'all', label: 'All' },
      { key: 'dining', label: 'Dining' },
      { key: 'party', label: 'Nightlife' },
      { key: 'culture', label: 'Culture' },
      { key: 'dance', label: 'Dance' },
      { key: 'hidden-gems', label: 'Hidden Gems' },
      { key: 'saved', label: 'Saved' }
    ];

    var html = filters.map(function(f) {
      var active = currentFilter === f.key ? ' active' : '';
      return '<button class="recs-filter-btn' + active + '" onclick="RecEngine.setFilter(\'' + f.key + '\')">' +
        f.label + '</button>';
    }).join('');

    el.innerHTML = html;
  }

  function setFilter(key) {
    currentFilter = key;
    renderFilters();
    renderRecommendations();
  }

  function renderRecommendations() {
    var el = document.getElementById('recs-list');
    if (!el) return;

    var recs = getRecommendations(currentFilter);

    if (recs.length === 0) {
      el.innerHTML =
        '<div class="recs-empty">' +
          '<div style="font-size: 2rem; margin-bottom: 12px;">🔍</div>' +
          '<div>No recommendations match this filter.</div>' +
          '<div style="margin-top: 8px; color: var(--gray); font-size: 0.85rem;">Try a different category or reset your dismissed items.</div>' +
          '<button class="recs-reset-dismissed" onclick="RecEngine.resetDismissed()">Show All Again</button>' +
        '</div>';
      return;
    }

    var html = recs.map(function(item) {
      var rec = item.rec;
      var score = item.score;
      var isSaved = profile.saved.indexOf(rec.id) !== -1;

      var gemBadge = rec.hiddenGem
        ? '<span class="recs-gem-badge">💎 Hidden Gem</span>'
        : '';

      var scoreClass = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low';

      var tagPills = rec.tags.slice(0, 4).map(function(tag) {
        return '<span class="recs-tag">' + tag + '</span>';
      }).join('');

      var saveLabel = isSaved ? '💛 Saved' : '🤍 Save';
      var saveAction = isSaved
        ? 'RecEngine.unsaveRec(\'' + rec.id + '\')'
        : 'RecEngine.saveRec(\'' + rec.id + '\')';

      return '<div class="recs-card" data-id="' + rec.id + '">' +
        '<div class="recs-card-top">' +
          '<div class="recs-card-emoji">' + rec.emoji + '</div>' +
          '<div class="recs-card-info">' +
            '<div class="recs-card-name">' + rec.name + '</div>' +
            '<div class="recs-card-meta">' +
              '<span class="recs-type-badge">' + rec.type + '</span>' +
              gemBadge +
              '<span class="recs-price">' + rec.priceRange + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="recs-score ' + scoreClass + '">' +
            '<span class="recs-score-num">' + score + '%</span>' +
            '<span class="recs-score-label">match</span>' +
          '</div>' +
        '</div>' +
        '<div class="recs-card-desc">' + rec.description + '</div>' +
        '<div class="recs-card-reason">' +
          '<span class="recs-reason-icon">💡</span>' +
          '<span>' + rec.matchReason + '</span>' +
        '</div>' +
        '<div class="recs-card-tags">' + tagPills + '</div>' +
        '<div class="recs-card-addr">' +
          rec.address +
          '<button class="copy-btn" onclick="copyToClipboard(\'' + rec.address.replace(/'/g, "\\'") + '\')">Copy</button>' +
        '</div>' +
        '<div class="recs-card-actions">' +
          '<a href="https://maps.google.com/?q=' + encodeURIComponent(rec.address) + '" target="_blank" class="recs-maps-btn">Open in Maps</a>' +
          '<button class="recs-save-btn' + (isSaved ? ' saved' : '') + '" onclick="' + saveAction + '">' + saveLabel + '</button>' +
          '<button class="recs-dismiss-btn" onclick="RecEngine.dismissRec(\'' + rec.id + '\')">Not for me</button>' +
        '</div>' +
      '</div>';
    }).join('');

    el.innerHTML = html;
  }

  function renderNotifToggle() {
    var el = document.getElementById('recs-notif-prefs');
    if (!el) return;

    var checked = profile.notificationsEnabled ? ' checked' : '';

    el.innerHTML =
      '<div class="recs-notif-section">' +
        '<div class="recs-notif-header-row">' +
          '<span style="font-size: 1.2rem;">🔔</span>' +
          '<strong>Proactive Suggestions</strong>' +
        '</div>' +
        '<div class="recs-notif-desc">Get notified about recommendations that match your interests</div>' +
        '<label class="recs-notif-toggle">' +
          '<input type="checkbox"' + checked + ' onchange="RecEngine.toggleNotifications()">' +
          '<span class="recs-toggle-slider"></span>' +
          '<span class="recs-toggle-label">' + (profile.notificationsEnabled ? 'Enabled' : 'Disabled') + '</span>' +
        '</label>' +
      '</div>' +
      '<button class="recs-reset-btn" onclick="RecEngine.resetProfile()">Reset All Preferences</button>';
  }

  function resetDismissed() {
    profile.dismissed = [];
    saveProfile();
    renderRecommendations();
    showToast('All recommendations restored', '🔄');
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init() {
    profile = loadProfile();
    learnAll();

    // Render UI when For You tab is opened
    renderAll();

    // Check for proactive notifications
    setTimeout(function() {
      checkNotifications();
    }, 3000);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  return {
    init: init,
    renderAll: renderAll,
    renderRecommendations: renderRecommendations,
    toggleInterest: toggleInterest,
    toggleHiddenGems: toggleHiddenGems,
    toggleNotifications: toggleNotifications,
    setFilter: setFilter,
    saveRec: saveRec,
    unsaveRec: unsaveRec,
    dismissRec: dismissRec,
    dismissNotification: dismissNotification,
    openForYou: openForYou,
    surpriseMe: surpriseMe,
    resetProfile: resetProfile,
    resetDismissed: resetDismissed,
    getProfile: function() { return profile; }
  };

})();
