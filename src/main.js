import { settings } from './content.js';
const dialog = document.querySelector('#contact-dialog');
document.querySelector('#contact-button').addEventListener('click', () => { if (settings.bookingUrl) window.location.assign(settings.bookingUrl); else dialog.showModal(); });
document.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
