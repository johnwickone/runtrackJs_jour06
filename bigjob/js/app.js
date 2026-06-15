// BigJob La Plateforme_ - version front simple avec localStorage
const DOMAIN = '@laplateforme.io';
const authSection = document.querySelector('#authSection');
const appSection = document.querySelector('#appSection');
const authForm = document.querySelector('#authForm');
const authError = document.querySelector('#authError');
const logoutBtn = document.querySelector('#logoutBtn');
const currentUser = document.querySelector('#currentUser');
const requestForm = document.querySelector('#requestForm');
const dateInput = document.querySelector('#dateInput');

const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const saveUsers = users => localStorage.setItem('users', JSON.stringify(users));
const getRequests = () => JSON.parse(localStorage.getItem('requests')) || [];
const saveRequests = requests => localStorage.setItem('requests', JSON.stringify(requests));
const getSession = () => JSON.parse(localStorage.getItem('session'));
const saveSession = user => localStorage.setItem('session', JSON.stringify(user));

function initDemoAdmin() {
  const users = getUsers();
  if (!users.find(u => u.email === 'admin@laplateforme.io')) {
    users.push({ name: 'Admin Demo', email: 'admin@laplateforme.io', role: 'admin' });
    saveUsers(users);
  }
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function isPast(date) {
  return date < today();
}

function showApp() {
  const user = getSession();
  if (!user) {
    authSection.classList.remove('d-none');
    appSection.classList.add('d-none');
    logoutBtn.classList.add('d-none');
    return;
  }

  authSection.classList.add('d-none');
  appSection.classList.remove('d-none');
  logoutBtn.classList.remove('d-none');
  currentUser.textContent = `${user.name} (${user.role})`;
  dateInput.min = today();

  document.querySelector('#backoffice').classList.toggle('d-none', !['moderator', 'admin'].includes(user.role));
  document.querySelector('#adminPanel').classList.toggle('d-none', user.role !== 'admin');

  renderMyRequests();
  renderBackoffice();
  renderUsers();
}

authForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const role = document.querySelector('#role').value;

  if (!email.endsWith(DOMAIN)) {
    authError.textContent = `Seuls les emails ${DOMAIN} sont autorisés.`;
    return;
  }

  const users = getUsers();
  let user = users.find(u => u.email === email);
  if (!user) {
    user = { name, email, role };
    users.push(user);
    saveUsers(users);
  }

  saveSession(user);
  authError.textContent = '';
  showApp();
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('session');
  showApp();
});

requestForm.addEventListener('submit', event => {
  event.preventDefault();
  const user = getSession();
  const date = dateInput.value;
  if (!date || isPast(date)) return alert('Impossible de demander une date passée.');

  const requests = getRequests();
  const exists = requests.find(r => r.email === user.email && r.date === date);
  if (exists) return alert('Vous avez déjà une demande pour cette date.');

  requests.push({ id: Date.now(), name: user.name, email: user.email, date, status: 'en attente' });
  saveRequests(requests);
  requestForm.reset();
  showApp();
});

function renderMyRequests() {
  const user = getSession();
  const tbody = document.querySelector('#myRequests');
  tbody.innerHTML = '';
  getRequests().filter(r => r.email === user.email).forEach(r => {
    const disabled = isPast(r.date) ? 'disabled' : '';
    tbody.innerHTML += `<tr>
      <td>${r.date}</td><td>${r.status}</td>
      <td><button class="btn btn-sm btn-danger" ${disabled} onclick="deleteRequest(${r.id})">Supprimer</button></td>
    </tr>`;
  });
}

function renderBackoffice() {
  const tbody = document.querySelector('#allRequests');
  tbody.innerHTML = '';
  getRequests().forEach(r => {
    const disabled = isPast(r.date) ? 'disabled' : '';
    tbody.innerHTML += `<tr>
      <td>${r.name}</td><td>${r.email}</td><td>${r.date}</td><td>${r.status}</td>
      <td>
        <button class="btn btn-sm btn-success" ${disabled} onclick="setStatus(${r.id}, 'acceptée')">Accepter</button>
        <button class="btn btn-sm btn-danger" ${disabled} onclick="setStatus(${r.id}, 'refusée')">Refuser</button>
      </td>
    </tr>`;
  });
}

function renderUsers() {
  const list = document.querySelector('#usersList');
  list.innerHTML = '';
  getUsers().forEach(u => {
    list.innerHTML += `<li class="list-group-item d-flex justify-content-between">
      <span>${u.name} - ${u.email}</span><b>${u.role}</b>
    </li>`;
  });
}

function deleteRequest(id) {
  const requests = getRequests().filter(r => r.id !== id || isPast(r.date));
  saveRequests(requests);
  showApp();
}

function setStatus(id, status) {
  const requests = getRequests().map(r => {
    if (r.id === id && !isPast(r.date)) r.status = status;
    return r;
  });
  saveRequests(requests);
  showApp();
}

document.querySelector('#rightsForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#rightsEmail').value.trim().toLowerCase();
  const role = document.querySelector('#rightsRole').value;
  if (!email.endsWith(DOMAIN)) return alert('Email non autorisé.');

  const users = getUsers().map(u => u.email === email ? { ...u, role } : u);
  saveUsers(users);

  const session = getSession();
  if (session.email === email) saveSession({ ...session, role });
  event.target.reset();
  showApp();
});

initDemoAdmin();
showApp();
