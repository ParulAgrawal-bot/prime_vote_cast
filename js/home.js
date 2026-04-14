const modals = {
    vote:      { title: 'Cast Your Vote', body: 'Authenticate with your voter ID to proceed to the secure ballot. This step requires identity verification.' },
    results:   { title: 'Election Results', body: 'Live tallies and historical results will appear here once the polls are open and data is connected.' },
    track:     { title: 'Track Your Vote', body: 'Enter your unique tracking code to verify your ballot was received and counted securely.' },
    elections: { title: 'Active Elections', body: 'View all current and upcoming elections for Metropolis City, including candidates and key dates.' },
    account:   { title: 'My Account', body: 'Manage your voter registration, notification preferences, and personal details.' },
    help:      { title: 'Help & Support', body: 'For assistance, contact the Metropolis City Elections office or browse the FAQ section.' },
  };

  function showModal(key) {
    const m = modals[key] || { title: 'Info', body: 'Details coming soon.' };
    document.getElementById('modal-title').textContent = m.title;
    document.getElementById('modal-body').textContent = m.body;
    document.getElementById('modal').classList.add('open');
  }

  function closeModal(e) {
    if (e.target === document.getElementById('modal')) {
      document.getElementById('modal').classList.remove('open');
    }
  }