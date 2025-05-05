tinymce.init({
  selector: 'textarea#post-content',
  height: 500,
  plugins: 'code codesample image',
  toolbar: 'undo redo | styleselect | bold italic | codesample image | alignleft aligncenter alignright alignjustify | outdent indent | code',
  image_uploadtab: true,
  images_upload_url: '/admin/upload-image',
  images_upload_credentials: true,
  relative_urls: false,
  content_css: false,
});
