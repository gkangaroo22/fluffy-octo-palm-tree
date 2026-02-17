// === TOAST NOTIFICATION SYSTEM ===
function showToast(message, icon) {
  icon = icon || '';
  var container = document.getElementById('toast-container');
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = (icon ? '<span>' + icon + '</span>' : '') + message;
  container.appendChild(toast);

  setTimeout(function() {
    toast.classList.add('toast-out');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2200);
}

// === TAB NAVIGATION ===
function openTab(tabId, btnElement) {
  var contents = document.querySelectorAll('.tab-content');
  contents.forEach(function(content) { content.classList.remove('active'); });

  var buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(function(btn) { btn.classList.remove('active'); });

  var tab = document.getElementById(tabId);
  tab.classList.add('active');
  btnElement.classList.add('active');

  // Reset scroll-reveal cards so they animate in
  var cards = tab.querySelectorAll('.card.reveal');
  cards.forEach(function(card) {
    card.classList.remove('visible');
  });

  // Trigger observer check after tab switch
  setTimeout(function() {
    if (window._cardObserver) {
      cards.forEach(function(card) {
        window._cardObserver.observe(card);
      });
    }
  }, 50);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Save active tab
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('activeTab', tabId);
  }
}

// Scroll to a specific event card within a tab
function scrollToEvent(tabId, eventId) {
  var tabIndex = tabId === 'tab-fri' ? 1 : tabId === 'tab-sat' ? 2 : tabId === 'tab-sun' ? 3 : 4;
  var tabBtn = document.querySelectorAll('.tab-btn')[tabIndex];
  openTab(tabId, tabBtn);

  setTimeout(function() {
    var eventCard = document.getElementById(eventId);
    if (eventCard) {
      var yOffset = -20;
      var y = eventCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 200);
}

// === TRAVEL INFO TOGGLE ===
function toggleTravel(id) {
  var el = document.getElementById(id);
  el.classList.toggle('show');
}

// === BUDGET CALCULATOR ===
function updateBudgetTotal() {
  var inputs = document.querySelectorAll('.expense-amount-input');
  var total = 0;
  inputs.forEach(function(input) {
    var value = parseFloat(input.value) || 0;
    total += value;
  });
  var totalElement = document.getElementById('budget-total');
  if (totalElement) {
    totalElement.textContent = '$' + total.toLocaleString();
  }
  if (typeof Storage !== 'undefined') {
    var budgetData = [];
    inputs.forEach(function(input) {
      budgetData.push({
        name: input.previousElementSibling ? input.previousElementSibling.value : '',
        amount: parseFloat(input.value) || 0
      });
    });
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
  }
}

function addBudgetItem() {
  var container = document.getElementById('custom-expenses-container');
  var itemDiv = document.createElement('div');
  itemDiv.className = 'expense-item editable-expense';
  itemDiv.style.marginBottom = '8px';

  var nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'expense-name-input';
  nameInput.placeholder = 'Enter expense name';
  nameInput.style.width = 'auto';
  nameInput.style.flexGrow = '1';

  var amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.className = 'expense-amount-input';
  amountInput.value = '0';
  amountInput.onchange = updateBudgetTotal;

  var deleteBtn = document.createElement('button');
  deleteBtn.textContent = '\u00d7';
  deleteBtn.className = 'copy-btn';
  deleteBtn.style.marginLeft = '8px';
  deleteBtn.style.padding = '6px 12px';
  deleteBtn.style.fontSize = '1.2rem';
  deleteBtn.style.lineHeight = '1';
  deleteBtn.onclick = function() {
    itemDiv.remove();
    updateBudgetTotal();
  };

  itemDiv.appendChild(nameInput);
  itemDiv.appendChild(amountInput);
  itemDiv.appendChild(deleteBtn);
  container.appendChild(itemDiv);

  nameInput.focus();
  updateBudgetTotal();
}

// === CLIPBOARD WITH TOAST ===
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Copied to clipboard', '📋');
    }).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('Copied to clipboard', '📋');
  } catch (err) {
    showToast('Could not copy', '⚠️');
  }
  document.body.removeChild(textArea);
}

// === CHECKLIST PROGRESS ===
function updateProgress() {
  var checkboxes = document.querySelectorAll('.pack-checkbox');
  var checked = document.querySelectorAll('.pack-checkbox:checked').length;
  var total = checkboxes.length;
  var percentage = total > 0 ? (checked / total) * 100 : 0;

  document.getElementById('pack-progress').style.width = percentage + '%';
  document.getElementById('pack-count').textContent = checked;
  document.getElementById('pack-total').textContent = total;

  if (typeof Storage !== 'undefined') {
    var checkedIndices = [];
    checkboxes.forEach(function(checkbox, index) {
      if (checkbox.checked) checkedIndices.push(index);
    });
    localStorage.setItem('packingProgress', JSON.stringify(checkedIndices));
  }

  // Celebrate completion
  if (checked === total && total > 0) {
    showToast('All packed! You\'re ready for NYC!', '🎉');
  }
}

// === SATURDAY BAG CHECKLIST ===
function updateSatBagProgress() {
  var checkboxes = document.querySelectorAll('.sat-bag-checkbox');
  var checked = document.querySelectorAll('.sat-bag-checkbox:checked').length;
  var countEl = document.getElementById('sat-bag-count');
  if (countEl) countEl.textContent = checked;

  if (typeof Storage !== 'undefined') {
    var checkedIndices = [];
    checkboxes.forEach(function(cb, i) {
      if (cb.checked) checkedIndices.push(i);
    });
    localStorage.setItem('satBagProgress', JSON.stringify(checkedIndices));
  }

  if (checked === checkboxes.length && checkboxes.length > 0) {
    showToast('Day bag is ready! Go kill it!', '💃');
  }
}

// === COUNTDOWN TIMER ===
function updateCountdown() {
  var tripDate = new Date('2026-02-20T00:00:00');
  var now = new Date();
  var diff = tripDate - now;

  var container = document.getElementById('countdown');
  if (!container) return;

  if (diff <= 0) {
    container.innerHTML = '<div class="countdown-unit"><span class="countdown-num" style="font-size: 1rem; letter-spacing: 1px;">THE TIME IS NOW</span></div>';
    return;
  }

  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  container.innerHTML =
    '<div class="countdown-unit">' +
      '<span class="countdown-num">' + days + '</span>' +
      '<span class="countdown-label">Days</span>' +
    '</div>' +
    '<div class="countdown-unit">' +
      '<span class="countdown-num">' + hours + '</span>' +
      '<span class="countdown-label">Hrs</span>' +
    '</div>' +
    '<div class="countdown-unit">' +
      '<span class="countdown-num">' + mins + '</span>' +
      '<span class="countdown-label">Min</span>' +
    '</div>';
}

// === SCROLL PROGRESS BAR ===
function updateScrollProgress() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  var bar = document.getElementById('scroll-progress');
  if (bar) bar.style.width = scrollPercent + '%';
}

// === PARALLAX HEADER ===
function updateHeaderParallax() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var header = document.querySelector('header');
  if (!header) return;

  if (scrollTop > 120) {
    header.classList.add('compact');
  } else {
    header.classList.remove('compact');
  }
}

// === SCROLL-REVEAL (INTERSECTION OBSERVER) ===
function initScrollReveal() {
  var cards = document.querySelectorAll('.card');
  cards.forEach(function(card) {
    card.classList.add('reveal');
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Only observe cards in the active tab initially
  var activeTab = document.querySelector('.tab-content.active');
  if (activeTab) {
    activeTab.querySelectorAll('.card.reveal').forEach(function(card) {
      observer.observe(card);
    });
  }

  window._cardObserver = observer;
}

// === NOW INDICATOR ===
function updateNowIndicator() {
  // Event schedule: [tabId, eventId, startHour, startMin, endHour, endMin, day (20-23)]
  var events = [
    // Friday Feb 20
    ['tab-fri', 'event-checkin', 12, 0, 14, 0, 20],
    ['tab-fri', 'event-holywater', 19, 15, 20, 45, 20],
    ['tab-fri', 'event-bars', 20, 45, 23, 0, 20],
    ['tab-fri', 'event-nocturnal', 23, 0, 23, 59, 20],
    // Sat Feb 21
    ['tab-sat', 'event-vogue1', 12, 0, 13, 30, 21],
    ['tab-sat', 'event-moma', 13, 30, 15, 0, 21],
    ['tab-sat', 'event-vogue2', 15, 30, 17, 0, 21],
    ['tab-sat', 'event-sat-hotel', 17, 30, 18, 30, 21],
    ['tab-sat', 'event-dweller', 19, 0, 21, 30, 21],
    ['tab-sat', 'event-basement', 23, 15, 23, 59, 21],
    // Sun Feb 22
    ['tab-sun', 'event-brunch', 11, 0, 13, 0, 22],
    ['tab-sun', 'event-ballet', 15, 0, 17, 30, 22],
    ['tab-sun', 'event-birthday-dinner', 18, 30, 20, 30, 22],
    ['tab-sun', 'event-cock', 23, 30, 23, 59, 22]
  ];

  var now = new Date();
  var month = now.getMonth(); // 0-indexed, Feb = 1
  var day = now.getDate();
  var hour = now.getHours();
  var min = now.getMinutes();

  // Clear existing badges and active states
  document.querySelectorAll('.now-badge').forEach(function(b) { b.remove(); });
  document.querySelectorAll('.card.now-active').forEach(function(c) { c.classList.remove('now-active'); });

  // Only show during trip (Feb 20-23, 2026)
  if (now.getFullYear() !== 2026 || month !== 1) return;

  events.forEach(function(ev) {
    if (day !== ev[6]) return;
    var startMins = ev[2] * 60 + ev[3];
    var endMins = ev[4] * 60 + ev[5];
    var nowMins = hour * 60 + min;

    if (nowMins >= startMins && nowMins <= endMins) {
      var card = document.getElementById(ev[1]);
      if (card) {
        card.classList.add('now-active');
        var h2 = card.querySelector('h2');
        if (h2 && !h2.querySelector('.now-badge')) {
          var badge = document.createElement('span');
          badge.className = 'now-badge';
          badge.textContent = 'NOW';
          h2.appendChild(badge);
        }
      }
    }
  });
}

// === DOUBLE-TAP BOOKMARK ===
function initBookmarks() {
  var cards = document.querySelectorAll('.card[id]');
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('bookmarkedEvents') || '{}');
  } catch (e) { saved = {}; }

  cards.forEach(function(card) {
    var id = card.id;
    var bookmark = document.createElement('div');
    bookmark.className = 'card-bookmark' + (saved[id] ? ' saved' : '');
    bookmark.innerHTML = saved[id] ? '💛' : '🤍';
    bookmark.setAttribute('aria-label', 'Bookmark this event');

    bookmark.addEventListener('click', function(e) {
      e.stopPropagation();
      var isSaved = bookmark.classList.toggle('saved');
      bookmark.innerHTML = isSaved ? '💛' : '🤍';

      if (isSaved) {
        saved[id] = true;
        showToast('Event saved!', '💛');
      } else {
        delete saved[id];
      }
      localStorage.setItem('bookmarkedEvents', JSON.stringify(saved));
    });

    card.style.position = 'relative';
    card.appendChild(bookmark);
  });
}

// === BIRTHDAY CELEBRATION ===
function checkBirthday() {
  var now = new Date();
  if (now.getMonth() !== 1 || now.getDate() !== 22) return;

  // Only show once per session
  if (sessionStorage.getItem('birthdayCelebrated')) return;
  sessionStorage.setItem('birthdayCelebrated', 'true');

  // Create confetti overlay
  var overlay = document.createElement('div');
  overlay.className = 'birthday-overlay';
  document.body.appendChild(overlay);

  var colors = ['#D4AF7A', '#B89FD9', '#8FB4D6', '#D4A5A5', '#7FC7D9', '#B8D4E8', '#FFD700', '#FF69B4'];
  for (var i = 0; i < 80; i++) {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 3) + 's';
    piece.style.animationDelay = (Math.random() * 1.5) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (8 + Math.random() * 10) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    overlay.appendChild(piece);
  }

  // Create banner
  var banner = document.createElement('div');
  banner.className = 'birthday-banner';
  banner.innerHTML = '<h2>Happy Birthday!</h2><div class="birthday-sub">This is your day. Own it.</div>';
  document.body.appendChild(banner);

  // Clean up after animation
  setTimeout(function() {
    banner.style.transition = 'opacity 1s ease';
    banner.style.opacity = '0';
    setTimeout(function() {
      overlay.remove();
      banner.remove();
    }, 1000);
  }, 4500);

  // Haptic burst if available
  if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);

  // Show toast after confetti
  setTimeout(function() {
    showToast('It\'s your birthday! Make it legendary.', '🎂');
  }, 5500);
}

// === MTA APP LAUNCHER ===
function openMTAApp() {
  // Try deep-linking to MYmta app, fall back to MTA website
  var mtaWeb = 'https://new.mta.info/';
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  var isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
    // Try MYmta app scheme, fall back to App Store then web
    var appStoreUrl = 'https://apps.apple.com/us/app/mymta/id472041997';
    var fallbackTimer = setTimeout(function() {
      window.location.href = appStoreUrl;
    }, 1500);

    window.location.href = 'mymta://';

    window.addEventListener('blur', function handler() {
      clearTimeout(fallbackTimer);
      window.removeEventListener('blur', handler);
    });
  } else if (isAndroid) {
    // Android intent for MYmta app
    window.location.href = 'intent://new.mta.info/#Intent;scheme=https;package=info.mta.mymta;end';
    setTimeout(function() {
      window.open(mtaWeb, '_blank');
    }, 1500);
  } else {
    window.open(mtaWeb, '_blank');
  }
}

// === INITIALIZE EVERYTHING ===
window.addEventListener('DOMContentLoaded', function() {
  // Checklist
  var total = document.querySelectorAll('.pack-checkbox').length;
  document.getElementById('pack-total').textContent = total;

  if (typeof Storage !== 'undefined') {
    // Restore packing checklist
    var saved = localStorage.getItem('packingProgress');
    if (saved) {
      var checkedIndices = JSON.parse(saved);
      var checkboxes = document.querySelectorAll('.pack-checkbox');
      checkedIndices.forEach(function(index) {
        if (checkboxes[index]) checkboxes[index].checked = true;
      });
      updateProgress();
    }

    // Restore sat bag checklist
    var satSaved = localStorage.getItem('satBagProgress');
    if (satSaved) {
      var satIndices = JSON.parse(satSaved);
      var satCheckboxes = document.querySelectorAll('.sat-bag-checkbox');
      satIndices.forEach(function(index) {
        if (satCheckboxes[index]) satCheckboxes[index].checked = true;
      });
      updateSatBagProgress();
    }

    // Restore budget
    var savedBudget = localStorage.getItem('budgetData');
    if (savedBudget) {
      var budgetData = JSON.parse(savedBudget);
      var inputs = document.querySelectorAll('.expense-amount-input');
      inputs.forEach(function(input, index) {
        if (budgetData[index]) input.value = budgetData[index].amount;
      });
      updateBudgetTotal();
    }

    // Restore active tab
    var activeTabId = localStorage.getItem('activeTab');
    if (activeTabId) {
      var tabBtn = null;
      var tabIds = ['tab-home', 'tab-fri', 'tab-sat', 'tab-sun', 'tab-budget', 'tab-checklist'];
      var tabIndex = tabIds.indexOf(activeTabId);
      if (tabIndex >= 0) {
        tabBtn = document.querySelectorAll('.tab-btn')[tabIndex];
        if (tabBtn) openTab(activeTabId, tabBtn);
      }
    }
  }

  // Countdown
  updateCountdown();
  setInterval(updateCountdown, 60000);

  // Editable content persistence
  document.querySelectorAll('[contenteditable="true"]').forEach(function(element, index) {
    var storageKey = 'editable-content-' + index;
    var savedContent = localStorage.getItem(storageKey);
    if (savedContent) element.innerHTML = savedContent;

    element.addEventListener('blur', function() {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(storageKey, this.innerHTML);
      }
    });
  });

  // Birthday celebration
  checkBirthday();

  // Scroll-reveal with Intersection Observer
  initScrollReveal();

  // Bookmarks
  initBookmarks();

  // Now indicator (check every 30s)
  updateNowIndicator();
  setInterval(updateNowIndicator, 30000);

  // Scroll listeners (throttled)
  var scrollTicking = false;
  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      requestAnimationFrame(function() {
        updateScrollProgress();
        updateHeaderParallax();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
});

// === SWIPE NAVIGATION ===
var touchStartX = 0;
var touchEndX = 0;

document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  var swipeThreshold = 100;
  var swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    var activeTab = document.querySelector('.tab-btn.active');
    var allTabs = Array.from(document.querySelectorAll('.tab-btn'));
    var currentIndex = allTabs.indexOf(activeTab);

    if (swipeDistance > 0 && currentIndex > 0) {
      allTabs[currentIndex - 1].click();
    } else if (swipeDistance < 0 && currentIndex < allTabs.length - 1) {
      allTabs[currentIndex + 1].click();
    }
  }
}

// === HAPTIC FEEDBACK ===
document.querySelectorAll('button, a').forEach(function(element) {
  element.addEventListener('click', function() {
    if (navigator.vibrate) navigator.vibrate(10);
  });
});

// === SERVICE WORKER REGISTRATION ===
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function() {
    // SW registration failed — offline support unavailable, no action needed
  });
}
