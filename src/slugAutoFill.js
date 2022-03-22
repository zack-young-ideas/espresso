const titleField = document.getElementById('post-title');
titleField.addEventListener('keyup', () => {
  const text = titleField.value.toLowerCase()
    .replace(/[^-\w\s]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-")
    .replace(/-+$/g, "");
  const slugField = document.getElementById('post-slug');
  slugField.value = text;
});
