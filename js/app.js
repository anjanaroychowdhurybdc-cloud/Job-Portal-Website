const JOBS_STORAGE_KEY = 'jobPortalJobs';
const THEME_STORAGE_KEY = 'jobPortalTheme';
const CONTACT_STORAGE_KEY = 'jobPortalContacts';

const defaultJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Bright Labs',
    location: 'Park Street, Kolkata, India',
    category: 'Development',
    type: 'Full-time',
    salary: '$25k - $35k',
    description: 'Build responsive UI components with JavaScript, HTML, and CSS.',
    requirements: [
      'Strong JavaScript skills',
      'Responsive web design experience',
      'Familiarity with version control',
    ],
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'Pixelify',
    location: 'Sector V, Salt Lake, Kolkata, India',
    category: 'Design',
    type: 'Contract',
    salary: '$45k - $60k',
    description: 'Design intuitive user experiences for web and mobile products.',
    requirements: [
      'Portfolio of visual design work',
      'Wireframing and prototyping skills',
      'Attention to detail',
    ],
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    company: 'GrowthWave',
    location: 'Salt Lake, Kolkata, India',
    category: 'Marketing',
    type: 'Part-time',
    salary: '$30k - $45k',
    description: 'Manage campaigns and improve brand visibility online.',
    requirements: [
      'Social media strategy knowledge',
      'Strong communication skills',
      'Analytics-driven mindset',
    ],
  },
  {
    id: 4,
    title: 'Customer Support Agent',
    company: 'HelpHub',
    location: 'Salt Lake City, Kolkata, India',
    category: 'Support',
    type: 'Full-time',
    salary: '$25k - $35k',
    description: 'Provide excellent customer service across support channels.',
    requirements: [
      'Great problem-solving skills',
      'Written and verbal communication',
      'Empathy and patience',
    ],
  },
];

function getStoredJobs() {
  const stored = localStorage.getItem(JOBS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
  try {
    const parsed = JSON.parse(stored) || [];
    const needsRefresh =
      parsed.length !== defaultJobs.length ||
      defaultJobs.some((job) => {
        const storedJob = parsed.find((item) => item.id === job.id);
        if (!storedJob) return true;
        return (
          storedJob.title !== job.title ||
          storedJob.company !== job.company ||
          storedJob.location !== job.location ||
          storedJob.category !== job.category ||
          storedJob.type !== job.type ||
          storedJob.salary !== job.salary ||
          storedJob.description !== job.description ||
          JSON.stringify(storedJob.requirements) !== JSON.stringify(job.requirements)
        );
      });

    if (needsRefresh) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(defaultJobs));
      return defaultJobs;
    }

    return parsed;
  } catch {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
}

function getJobById(id) {
  const jobs = getStoredJobs();
  return jobs.find((job) => String(job.id) === String(id));
}

function renderJobCards(jobs) {
  const container = document.getElementById('jobsList');
  if (!container) return;
  container.innerHTML = jobs.length
    ? jobs
        .map(
          (job) => `<article class="job-card">
            <h3>${job.title}</h3>
            <p class="job-company">${job.company} · ${job.location}</p>
            <p class="job-meta">${job.category} · ${job.type} · ${job.salary}</p>
            <div class="job-actions">
              <a class="button primary" href="job-details.html?id=${job.id}">View Details</a>
              <button class="button secondary" onclick="demoApply(${job.id})">Apply Demo</button>
            </div>
          </article>`
        )
        .join('')
    : '<p>No jobs matched your search. Try a different keyword or category.</p>';
}

function demoApply(id) {
  const job = getJobById(id);
  if (!job) return;
  alert(`Demo application submitted for ${job.title} at ${job.company}. Thank you!`);
}

function initializeJobsPage() {
  const jobs = getStoredJobs();
  const searchInput = document.getElementById('jobSearch');
  const filterSelect = document.getElementById('categoryFilter');

  function updateList() {
    const query = searchInput?.value.trim().toLowerCase() ?? '';
    const category = filterSelect?.value ?? 'all';

    const filtered = jobs.filter((job) => {
      const matchesQuery =
        query === '' ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || job.category === category;
      return matchesQuery && matchesCategory;
    });

    renderJobCards(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', updateList);
  }
  if (filterSelect) {
    filterSelect.addEventListener('change', updateList);
  }

  updateList();
}

function renderJobDetails() {
  const container = document.getElementById('jobDetailsContainer');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id');
  const job = getJobById(jobId);

  if (!job) {
    container.innerHTML = `<div class="detail-card"><h1>Job Not Found</h1><p>We could not find that job listing. Please return to the <a href="jobs.html">jobs page</a>.</p></div>`;
    return;
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(job.location)}&output=embed`;
  container.innerHTML = `<article class="detail-card">
      <h1>${job.title}</h1>
      <p class="job-company">${job.company} · ${job.location}</p>
      <div class="job-info">
        <span>${job.category}</span>
        <span>${job.type}</span>
        <span>${job.salary}</span>
      </div>
      <p>${job.description}</p>
      <div class="job-map">
        <h2>Location Map</h2>
        <div class="map-frame">
          <iframe src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${job.location} map"></iframe>
        </div>
      </div>
      <h2>Requirements</h2>
      <ul class="job-detail-list">
        ${job.requirements.map((item) => `<li>${item}</li>`).join('')}
      </ul>
      <div class="job-actions">
        <button class="button primary" onclick="handleApply(${job.id})">Apply Now</button>
        <a href="jobs.html" class="button secondary">Back to Jobs</a>
      </div>
    </article>`;
}

function handleApply(id) {
  const job = getJobById(id);
  if (!job) return;
  alert(`Your demo application for ${job.title} has been received. We will contact you soon.`);
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  applyTheme(savedTheme);
  const buttons = document.querySelectorAll('#themeToggle');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  document.querySelectorAll('#themeToggle').forEach((button) => {
    button.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('contactFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in every field before sending.';
      return;
    }

    const stored = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) || '[]');
    stored.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(stored));

    form.reset();
    feedback.textContent = 'Message saved locally. Thank you for contacting us!';
  });
}

function initPage() {
  initTheme();
  if (document.getElementById('jobsList')) {
    initializeJobsPage();
  }
  if (document.getElementById('jobDetailsContainer')) {
    renderJobDetails();
  }
  if (document.getElementById('contactForm')) {
    initContactForm();
  }
}

window.addEventListener('DOMContentLoaded', initPage);
