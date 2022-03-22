const titleField = document.getElementById('post-title');
titleField.addEventListener('keyup', () => {
  const text = titleField.value.toLowerCase()
    .replace(/[^-\w\s]/g, "") // Remove non-alphanumeric characters
    .trim()
    .replace(/[-\s]+/g, "-") // Replace spaces with hyphens
    .replace(/-+$/g, "");
  const slugField = document.getElementById('post-slug');
  slugField.value = text;
});
