// Tab navigation
function openTab(tabId, btnElement) {
  var contents = document.querySelectorAll('.tab-content');
  contents.forEach(function(content) { content.classList.remove('active'); });

  var buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(function(btn) { btn.classList.remove('active'); });

  var tab = document.getElementById(tabId);
  tab.classList.add('active');
  btnElement.classList.add('active');

  // Force re-trigger card fade-in animations to fix cards not loading
  var cards = tab.querySelectorAll('.card');
  cards.forEach(function(card) {
    card.style.animation = 'none';
    void card.offsetHeight; // force reflow
    card.style.animation = '';
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll to a specific event card within a tab
function scrollToEvent(tabId, eventId) {
  // Tab order: Home(0), Friday(1), Saturday(2), Sunday(3), Budget(4), Pack(5)
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

// Toggle travel info panels
function toggleTravel(id) {
  var el = document.getElementById(id);
  el.classList.toggle('show');
}

// Budget total calculator
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

// Add custom budget line item
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

// Clipboard
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showCopyFeedback(text);
    }).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function showCopyFeedback(text) {
  var buttons = document.querySelectorAll('.copy-btn');
  buttons.forEach(function(btn) {
    if (btn.onclick && btn.onclick.toString().includes(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      var originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function() {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }
  });
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
    showCopyFeedback(text);
  } catch (err) {
    alert('Could not copy');
  }
  document.body.removeChild(textArea);
}

// Checklist progress
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
}

// Countdown timer
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

// Initialize
window.addEventListener('DOMContentLoaded', function() {
  // Checklist
  var total = document.querySelectorAll('.pack-checkbox').length;
  document.getElementById('pack-total').textContent = total;

  if (typeof Storage !== 'undefined') {
    // Restore checklist
    var saved = localStorage.getItem('packingProgress');
    if (saved) {
      var checkedIndices = JSON.parse(saved);
      var checkboxes = document.querySelectorAll('.pack-checkbox');
      checkedIndices.forEach(function(index) {
        if (checkboxes[index]) checkboxes[index].checked = true;
      });
      updateProgress();
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
});

// Swipe navigation
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

// Haptic feedback
document.querySelectorAll('button, a').forEach(function(element) {
  element.addEventListener('click', function() {
    if (navigator.vibrate) navigator.vibrate(10);
  });
});
