const deleteButton = document.getElementById('delete-button');
const modal = document.getElementById('modal');

deleteButton.addEventListener('click', (event) => {
  event.preventDefault();
  modal.style.display = 'block';
});

const modalCancelButton = document.getElementById('modal-cancel');
modalCancelButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

const modalCloseButton = document.getElementById('modal-close');
modalCloseButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

const modalDeleteButton = document.getElementById('modal-delete');
modalDeleteButton.addEventListener('click', () => {
  window.location = '/admin';
});
