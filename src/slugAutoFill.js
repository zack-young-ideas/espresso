const titleField = document.getElementById('post-title');
titleField.addEventListener('keyup', () => {
  const text = titleField.value.toLowerCase().split(' ').join('-');
  const slugField = document.getElementById('post-slug');
  slugField.value = text;
});
