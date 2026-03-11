'use strict';

const registerForm  = document.getElementById('register-form');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput  = document.getElementById('confirm-password');
const emailError    = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmError  = document.getElementById('confirm-error');
const formAlert     = document.getElementById('form-alert');
const alertMessage  = document.getElementById('alert-message');
const btnRegister   = document.getElementById('btn-register');
const btnSpinner    = document.getElementById('btn-spinner');
const btnLabel      = btnRegister.querySelector('.btn-label');
const togglePw1     = document.getElementById('toggle-pw-1');
const togglePw2     = document.getElementById('toggle-pw-2');
const strengthFill  = document.getElementById('strength-fill');
const strengthLabel = document.getElementById('strength-label');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setVisible(el, visible) {
  visible ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
}

function setFieldError(input, errorEl, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = message;
}

function clearFieldError(input, errorEl) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.removeAttribute('aria-invalid');
  errorEl.textContent = '';
}

function showAlert(message, type = 'error') {
  alertMessage.textContent = message;
  formAlert.className = 'form-alert alert-' + type;
  setVisible(formAlert, true);
}

function setLoadingState(loading) {
  btnRegister.disabled = loading;
  setVisible(btnSpinner, loading);
  btnLabel.textContent = loading ? 'Creating account…' : 'Create Account';
}

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function updateStrength(pw) {
  if (!pw) {
    strengthFill.style.width = '0%';
    strengthFill.className = 'strength-fill';
    strengthLabel.textContent = '';
    return;
  }
  const score = getStrength(pw);
  const levels = [
    { w: '20%',  cls: 'weak',   label: 'Weak' },
    { w: '40%',  cls: 'weak',   label: 'Weak' },
    { w: '60%',  cls: 'fair',   label: 'Fair' },
    { w: '80%',  cls: 'good',   label: 'Good' },
    { w: '100%', cls: 'strong', label: 'Strong' },
  ];
  const lvl = levels[Math.min(score, 4)];
  strengthFill.style.width = lvl.w;
  strengthFill.className = 'strength-fill ' + lvl.cls;
  strengthLabel.textContent = lvl.label;
}

function validateEmail() {
  const v = emailInput.value.trim();
  if (!v)                    { setFieldError(emailInput, emailError, 'Email is required.');         return false; }
  if (!EMAIL_REGEX.test(v))  { setFieldError(emailInput, emailError, 'Enter a valid email.');       return false; }
  clearFieldError(emailInput, emailError);
  return true;
}

function validatePassword() {
  const v = passwordInput.value;
  if (!v)          { setFieldError(passwordInput, passwordError, 'Password is required.');            return false; }
  if (v.length < 6){ setFieldError(passwordInput, passwordError, 'Password must be at least 6 chars.'); return false; }
  clearFieldError(passwordInput, passwordError);
  return true;
}

function validateConfirm() {
  const v = confirmInput.value;
  if (!v)                          { setFieldError(confirmInput, confirmError, 'Please confirm your password.'); return false; }
  if (v !== passwordInput.value)   { setFieldError(confirmInput, confirmError, 'Passwords do not match.');       return false; }
  clearFieldError(confirmInput, confirmError);
  return true;
}

function validateForm() {
  return [validateEmail(), validatePassword(), validateConfirm()].every(Boolean);
}

function toggleVisibility(input, btn) {
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  const show = btn.querySelector('.eye-show');
  const hide = btn.querySelector('.eye-hide');
  if (show) setVisible(show, !isHidden);
  if (hide) setVisible(hide, isHidden);
}

async function handleSubmit(e) {
  e.preventDefault();
  setVisible(formAlert, false);
  if (!validateForm()) return;

  const email    = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  setLoadingState(true);
  await new Promise(r => setTimeout(r, 800));

  try {
    const users = JSON.parse(localStorage.getItem('hmr_users') || '[]');
    if (users.find(u => u.email === email)) {
      showAlert('An account with this email already exists.');
      return;
    }
    users.push({ email, password });
    localStorage.setItem('hmr_users', JSON.stringify(users));
    showAlert('Account created! Redirecting to login…', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  } catch (err) {
    showAlert('Something went wrong. Please try again.');
  } finally {
    setLoadingState(false);
  }
}

function init() {
  registerForm.addEventListener('submit', handleSubmit);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('blur', validatePassword);
  confirmInput.addEventListener('blur', validateConfirm);

  emailInput.addEventListener('input', () => { if (emailInput.classList.contains('is-invalid')) validateEmail(); });
  passwordInput.addEventListener('input', () => {
    updateStrength(passwordInput.value);
    if (passwordInput.classList.contains('is-invalid')) validatePassword();
    if (confirmInput.value) validateConfirm();
  });
  confirmInput.addEventListener('input', () => {
    if (confirmInput.classList.contains('is-invalid') || confirmInput.value) validateConfirm();
  });

  if (togglePw1) togglePw1.addEventListener('click', () => toggleVisibility(passwordInput, togglePw1));
  if (togglePw2) togglePw2.addEventListener('click', () => toggleVisibility(confirmInput, togglePw2));
}

init();
