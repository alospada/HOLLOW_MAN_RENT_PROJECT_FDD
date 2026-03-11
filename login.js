'use strict';

const loginForm     = document.getElementById('login-form');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError    = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const formAlert     = document.getElementById('form-alert');
const alertMessage  = document.getElementById('alert-message');
const btnSignin     = document.getElementById('btn-signin');
const btnSpinner    = document.getElementById('btn-spinner');
const btnLabel      = btnSignin.querySelector('.btn-label');
const togglePwBtn   = document.getElementById('toggle-pw');
const eyeShow       = togglePwBtn.querySelector('.eye-show');
const eyeHide       = togglePwBtn.querySelector('.eye-hide');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setVisible(el, visible) {
  visible ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
}

function setFieldError(input, errorEl, msg) {
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg;
}

function clearFieldError(input, errorEl) {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  errorEl.textContent = '';
}

function showAlert(msg, type = 'error') {
  alertMessage.textContent = msg;
  formAlert.className = 'form-alert alert-' + type;
  setVisible(formAlert, true);
}

function setLoadingState(loading) {
  btnSignin.disabled = loading;
  setVisible(btnSpinner, loading);
  btnLabel.textContent = loading ? 'Signing in…' : 'Sign In';
}

function validateEmail() {
  const v = emailInput.value.trim();
  if (!v)                   { setFieldError(emailInput, emailError, 'Email is required.');       return false; }
  if (!EMAIL_REGEX.test(v)) { setFieldError(emailInput, emailError, 'Enter a valid email.');     return false; }
  clearFieldError(emailInput, emailError);
  return true;
}

function validatePassword() {
  const v = passwordInput.value;
  if (!v)           { setFieldError(passwordInput, passwordError, 'Password is required.');          return false; }
  if (v.length < 6) { setFieldError(passwordInput, passwordError, 'Password must be at least 6 chars.'); return false; }
  clearFieldError(passwordInput, passwordError);
  return true;
}

function authenticate(email, password) {
  if (email === 'demo@hollowmanrent.com' && password === 'demo123') return true;
  try {
    const users = JSON.parse(localStorage.getItem('hmr_users') || '[]');
    return users.some(u => u.email === email.toLowerCase() && u.password === password);
  } catch {
    return false;
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  setVisible(formAlert, false);
  if (![validateEmail(), validatePassword()].every(Boolean)) return;

  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  setLoadingState(true);
  await new Promise(r => setTimeout(r, 800));

  try {
    if (authenticate(email, password)) {
      showAlert('Login successful! Redirecting…', 'success');
      setTimeout(() => { window.location.href = 'home.html'; }, 1000);
    } else {
      showAlert('Incorrect email or password. Please try again.');
    }
  } catch {
    showAlert('Something went wrong. Please try again.');
  } finally {
    setLoadingState(false);
  }
}

function handlePasswordToggle() {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePwBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  setVisible(eyeShow, !isHidden);
  setVisible(eyeHide, isHidden);
}

function init() {
  loginForm.addEventListener('submit', handleSubmit);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);
  emailInput.addEventListener('input', () => { if (emailInput.classList.contains('is-invalid')) validateEmail(); });
  passwordInput.addEventListener('input', () => { if (passwordInput.classList.contains('is-invalid')) validatePassword(); });
  togglePwBtn.addEventListener('click', handlePasswordToggle);
}

init();
