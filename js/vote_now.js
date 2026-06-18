(function() {
      const form = document.getElementById('vote-form');
      const message = document.getElementById('message');
      const resultsList = document.getElementById('results-list');
      const submitBtn = document.getElementById('vote-submit');
      const options = document.querySelectorAll('.option');
      const storageKey = 'vote_counts_v2';
      
      let counts = {};
      let hasVoted = false;

      // Load votes from localStorage
      function loadCounts() {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            counts = JSON.parse(stored);
          } catch (e) {
            counts = {};
          }
        }
        
        // Initialize options
        ['Option A', 'Option B', 'Option C'].forEach(opt => {
          counts[opt] = counts[opt] || 0;
        });
      }

      // Save to localStorage
      function saveCounts() {
        localStorage.setItem(storageKey, JSON.stringify(counts));
      }

      // Render results with progress bars
      function renderResults() {
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        
        resultsList.innerHTML = '';
        ['Option A', 'Option B', 'Option C'].forEach(option => {
          const count = counts[option];
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          
          const li = document.createElement('li');
          li.className = 'results-item';
          li.innerHTML = `
            <div>
              <span>${option}</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
              </div>
            </div>
            <span>${count} votes<br><small>${percentage}%</small></span>
          `;
          resultsList.appendChild(li);
        });
      }

      // Show message
      function showMessage(text, type = 'success') {
        message.textContent = text;
        message.className = type;
        message.style.display = 'block';
        setTimeout(() => {
          message.style.display = 'none';
        }, 4000);
      }

      // Mark as voted
      function markVoted(optionValue) {
        options.forEach(opt => {
          if (opt.dataset.option === optionValue) {
            opt.classList.add('voted');
          }
        });
        hasVoted = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Vote Submitted ✓';
        redirect('/results');
      }
      function redirect(path) {
        window.location.href = path;
      }

      // Check if already voted
      function checkPreviousVote() {
        const previousVote = localStorage.getItem('user_vote_v2');
        if (previousVote) {
          markVoted(previousVote);
          showMessage('You have already voted!', 'error');
        }
      }

      // Handle vote submission
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) {
          showMessage('Verify your identity first.', 'error');
          return;
        }
        if (hasVoted) return showMessage('You have already voted.', 'error');
        if (!selectedOption) return showMessage('Please select an option.', 'error');
      
        try {
          const encryptedVote = encrypt(selectedOption, 'user_vote_v2', secretKey); // Use secretKey directly
          
          const response = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              aadhaar: aadhaar.trim(),
              selection: encryptedVote, // Encrypted vote
            }),
          });
      
          const data = await response.json().catch(() => ({}));
          if (response.ok) {
            setHasVoted(true);
            showMessage(data.message || 'Your vote was saved successfully!', 'success', 2000);
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
              window.location.href = '/'; // Replace with your home page path
            }, 2000);
          } else {
            showMessage(data.error || `Voting failed (${response.status})`, 'error');
          }
        } catch (err) {
          showMessage(err?.message || 'Network error during voting', 'error');
        }
      };

      // Initialize
      loadCounts();
      checkPreviousVote();
      renderResults();
      
      form.addEventListener('submit', handleSubmit);

      // Prevent multiple votes
      options.forEach(option => {
        option.addEventListener('click', function() {
          if (hasVoted) {
            showMessage('You have already cast your vote!', 'error');
          }
        });
      });
    })();