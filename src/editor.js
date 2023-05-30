const tinymce = require('tinymce/tinymce');
require('tinymce/icons/default');
require('tinymce/themes/silver');
require('tinymce/skins/ui/oxide/skin.css');
require('tinymce/plugins/code');
require('tinymce/plugins/codesample');
require('tinymce/plugins/image');

const contentCssUi = require('tinymce/skins/ui/oxide/content.css');
const contentCss = require('tinymce/skins/content/default/content.css');

render = () => {
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
    content_style: `${contentCss.toString()}\n${contentCssUi.toString()}`,
  });
};

render();
