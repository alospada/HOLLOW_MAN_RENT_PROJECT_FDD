'use strict';

const navbar         = document.getElementById('navbar');
const hamburger      = document.getElementById('hamburger');
const mobileMenu     = document.getElementById('mobile-menu');
const contactForm    = document.getElementById('contact-form');
const formSuccess    = document.getElementById('form-success');
const btnSend        = document.getElementById('btn-send');
const btnSpinner     = document.getElementById('btn-spinner');
const btnLabel       = btnSend.querySelector('.btn-label');
const btnSendAnother = document.getElementById('btn-send-another');

const fName    = document.getElementById('c-name');
const fEmail   = document.getElementById('c-email');
const fSubject = document.getElementById('c-subject');
const fMessage = document.getElementById('c-message');
const errName    = document.getElementById('c-name-error');
const errEmail   = document.getElementById('c-email-error');
const errSubject = document.getElementById('c-subject-error');
const errMessage = document.getElementById('c-message-error');

document.addEventListener('click', e => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) &&
      hamburger.getAttribute('aria-expanded') === 'true') toggleMobileMenu();
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setErr(inp, el, msg) { inp.classList.add('is-invalid'); inp.setAttribute('aria-invalid','true'); el.textContent = msg; }
function clrErr(inp, el)      { inp.classList.remove('is-invalid'); inp.removeAttribute('aria-invalid'); el.textContent = ''; }

function validateName()    { const v=fName.value.trim();    if(!v){setErr(fName,errName,'Your name is required.');return false;} if(v.length<2){setErr(fName,errName,'Name must be at least 2 characters.');return false;} clrErr(fName,errName);    return true; }
function validateEmail()   { const v=fEmail.value.trim();   if(!v){setErr(fEmail,errEmail,'Email address is required.');return false;} if(!EMAIL_RE.test(v)){setErr(fEmail,errEmail,'Please enter a valid email.');return false;} clrErr(fEmail,errEmail);   return true; }
function validateSubject() { const v=fSubject.value.trim(); if(!v){setErr(fSubject,errSubject,'Subject is required.');return false;} if(v.length<3){setErr(fSubject,errSubject,'Subject must be at least 3 characters.');return false;} clrErr(fSubject,errSubject); return true; }
function validateMessage() { const v=fMessage.value.trim(); if(!v){setErr(fMessage,errMessage,'Please enter a message.');return false;} if(v.length<10){setErr(fMessage,errMessage,'Message must be at least 10 characters.');return false;} clrErr(fMessage,errMessage); return true; }
function validateAll()     { return [validateName(),validateEmail(),validateSubject(),validateMessage()].every(Boolean); }

async function handleSubmit(e) {
  e.preventDefault();
  if (!validateAll()) { const first=contactForm.querySelector('.is-invalid'); if(first)first.scrollIntoView({behavior:'smooth',block:'center'}); return; }
  btnSend.disabled=true; btnLabel.textContent='Sending…'; btnSpinner.removeAttribute('hidden');
  await new Promise(r=>setTimeout(r,1000));
  contactForm.setAttribute('hidden','');
  formSuccess.removeAttribute('hidden');
  document.querySelector('.form-card').scrollIntoView({behavior:'smooth'});
  btnSend.disabled=false; btnLabel.textContent='Send Message'; btnSpinner.setAttribute('hidden','');
}

function resetForm() {
  contactForm.reset();
  [fName,fEmail,fSubject,fMessage].forEach(el=>el.classList.remove('is-invalid'));
  [errName,errEmail,errSubject,errMessage].forEach(el=>el.textContent='');
  formSuccess.setAttribute('hidden','');
  contactForm.removeAttribute('hidden');
  fName.focus();
}

fName.addEventListener('blur', validateName);
fEmail.addEventListener('blur', validateEmail);
fSubject.addEventListener('blur', validateSubject);
fName.addEventListener('input',    ()=>{ if(fName.classList.contains('is-invalid'))    validateName(); });
fEmail.addEventListener('input',   ()=>{ if(fEmail.classList.contains('is-invalid'))   validateEmail(); });
fSubject.addEventListener('input', ()=>{ if(fSubject.classList.contains('is-invalid')) validateSubject(); });
fMessage.addEventListener('input', ()=>{ if(fMessage.classList.contains('is-invalid')) validateMessage(); });

function init() {
  ;

  ;
  mobileMenu.addEventListener('click', e => { if(e.target.classList.contains('mob-link')) toggleMobileMenu(); });
  window.addEventListener('resize', () => { if(window.innerWidth>900 && hamburger.getAttribute('aria-expanded')==='true') toggleMobileMenu(); });
  contactForm.addEventListener('submit', handleSubmit);
  btnSendAnother.addEventListener('click', resetForm);

}

init();
