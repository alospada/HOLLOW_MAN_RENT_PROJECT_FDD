'use strict';

var bookingForm  = document.getElementById('booking-form');
var formAlert    = document.getElementById('form-alert');
var alertMsg     = document.getElementById('alert-message');
var successState = document.getElementById('success-state');
var btnConfirm   = document.getElementById('btn-confirm');
var btnSpinner   = document.getElementById('btn-spinner');
var btnLabel     = btnConfirm ? btnConfirm.querySelector('.btn-label') : null;

var fName     = document.getElementById('full-name');
var fEmail    = document.getElementById('email');
var fPhone    = document.getElementById('phone');
var fVehicle  = document.getElementById('vehicle');
var fLocation = document.getElementById('location');
var fPickup   = document.getElementById('pickup-date');
var fReturn   = document.getElementById('return-date');
var fNotes    = document.getElementById('notes');

var errName     = document.getElementById('full-name-error');
var errEmail    = document.getElementById('email-error');
var errPhone    = document.getElementById('phone-error');
var errVehicle  = document.getElementById('vehicle-error');
var errLocation = document.getElementById('location-error');
var errPickup   = document.getElementById('pickup-date-error');
var errReturn   = document.getElementById('return-date-error');

var costSummary = document.getElementById('cost-summary');
var costAmount  = document.getElementById('cost-amount');
var costNote    = document.getElementById('cost-note');

var VEHICLE_PRICES = {
  'toyota-hilux':     8000,
  'honda-city':       4500,
  'mahindra-scorpio': 6500,
  'suzuki-swift':     3000,
  'ford-everest':     9000,
  'hyundai-creta':    5500,
};

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PHONE_RE = /^(\+977[\s-]?)?[0-9]{8,15}$/;

function setVisible(el, show) {
  if (!el) return;
  show ? el.removeAttribute('hidden') : el.setAttribute('hidden', '');
}

function setFieldError(input, errorEl, msg) {
  if (!input || !errorEl) return;
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg;
}

function clearFieldError(input, errorEl) {
  if (!input || !errorEl) return;
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  errorEl.textContent = '';
}

function showAlert(msg) {
  if (alertMsg) alertMsg.textContent = msg;
  setVisible(formAlert, true);
}

function hideAlert() {
  setVisible(formAlert, false);
  if (alertMsg) alertMsg.textContent = '';
}

function setLoading(loading) {
  if (btnConfirm) btnConfirm.disabled = loading;
  setVisible(btnSpinner, loading);
  if (btnLabel) btnLabel.textContent = loading ? 'Confirming…' : 'Confirm Booking';
}

function formatNPR(n) {
  return 'Rs. ' + n.toLocaleString('en-IN');
}

function daysBetween(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / 86400000);
}

function validateName() {
  var v = fName.value.trim();
  if (!v)           { setFieldError(fName, errName, 'Full name is required.'); return false; }
  if (v.length < 2) { setFieldError(fName, errName, 'Name must be at least 2 characters.'); return false; }
  clearFieldError(fName, errName); return true;
}

function validateEmail() {
  var v = fEmail.value.trim();
  if (!v)                { setFieldError(fEmail, errEmail, 'Email is required.'); return false; }
  if (!EMAIL_RE.test(v)) { setFieldError(fEmail, errEmail, 'Enter a valid email.'); return false; }
  clearFieldError(fEmail, errEmail); return true;
}

function validatePhone() {
  var v = fPhone.value.trim();
  if (!v)                              { setFieldError(fPhone, errPhone, 'Phone number is required.'); return false; }
  if (!PHONE_RE.test(v.replace(/\s/g, ''))) { setFieldError(fPhone, errPhone, 'Enter a valid phone (e.g. 9847653175).'); return false; }
  clearFieldError(fPhone, errPhone); return true;
}

function validateVehicle() {
  if (!fVehicle.value) { setFieldError(fVehicle, errVehicle, 'Please select a vehicle.'); return false; }
  clearFieldError(fVehicle, errVehicle); return true;
}

function validateLocation() {
  if (!fLocation.value) { setFieldError(fLocation, errLocation, 'Please select a pick-up location.'); return false; }
  clearFieldError(fLocation, errLocation); return true;
}

function validatePickupDate() {
  var v = fPickup.value;
  if (!v) { setFieldError(fPickup, errPickup, 'Pick-up date is required.'); return false; }
  var today = new Date(); today.setHours(0,0,0,0);
  if (new Date(v) < today) { setFieldError(fPickup, errPickup, 'Pick-up date cannot be in the past.'); return false; }
  clearFieldError(fPickup, errPickup); return true;
}

function validateReturnDate() {
  var v = fReturn.value, pv = fPickup.value;
  if (!v) { setFieldError(fReturn, errReturn, 'Return date is required.'); return false; }
  if (pv && new Date(v) <= new Date(pv)) { setFieldError(fReturn, errReturn, 'Return must be after pick-up date.'); return false; }
  clearFieldError(fReturn, errReturn); return true;
}

function validateAll() {
  return [
    validateName(), validateEmail(), validatePhone(),
    validateVehicle(), validateLocation(),
    validatePickupDate(), validateReturnDate()
  ].every(Boolean);
}

function updateCostEstimate() {
  var vehicle = fVehicle.value, pickup = fPickup.value, ret = fReturn.value;
  if (!vehicle || !pickup || !ret) { setVisible(costSummary, false); return; }
  var days = daysBetween(pickup, ret);
  if (days < 1) { setVisible(costSummary, false); return; }
  var pricePerDay = VEHICLE_PRICES[vehicle] || 0;
  var total = pricePerDay * days;
  if (costAmount) costAmount.textContent = formatNPR(total);
  if (costNote)   costNote.textContent   = days + ' day' + (days > 1 ? 's' : '') + ' × ' + formatNPR(pricePerDay) + '/day';
  setVisible(costSummary, true);
}

async function handleSubmit(e) {
  e.preventDefault();
  hideAlert();

  if (!validateAll()) {
    showAlert('Please fix the errors above before submitting.');
    var firstError = bookingForm.querySelector('.is-invalid');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  setLoading(true);
  await new Promise(function(r) { setTimeout(r, 1100); });

  try {
    bookingForm.setAttribute('hidden', '');
    setVisible(successState, true);
    setVisible(formAlert, false);
    var card = document.querySelector('.booking-card');
    if (card) card.scrollIntoView({ behavior: 'smooth' });
  } catch(err) {
    showAlert('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

function init() {
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', handleSubmit);

  fName.addEventListener('blur',     validateName);
  fEmail.addEventListener('blur',    validateEmail);
  fPhone.addEventListener('blur',    validatePhone);
  fVehicle.addEventListener('blur',  validateVehicle);
  fLocation.addEventListener('blur', validateLocation);
  fPickup.addEventListener('blur',   validatePickupDate);
  fReturn.addEventListener('blur',   validateReturnDate);

  fName.addEventListener('input',  function() { if (fName.classList.contains('is-invalid'))    validateName(); });
  fEmail.addEventListener('input', function() { if (fEmail.classList.contains('is-invalid'))   validateEmail(); });
  fPhone.addEventListener('input', function() { if (fPhone.classList.contains('is-invalid'))   validatePhone(); });

  fVehicle.addEventListener('change',  function() { validateVehicle();     updateCostEstimate(); });
  fPickup.addEventListener('change',   function() { validatePickupDate();  validateReturnDate(); updateCostEstimate(); });
  fReturn.addEventListener('change',   function() { validateReturnDate();  updateCostEstimate(); });

  var todayStr = new Date().toISOString().split('T')[0];
  fPickup.setAttribute('min', todayStr);
  fReturn.setAttribute('min', todayStr);
}

init();
