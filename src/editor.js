const fs = require('fs');

const tinymce = require('tinymce/tinymce');
require('tinymce/icons/default');
require('tinymce/themes/silver');
require('tinymce/skins/ui/oxide/skin.css');
require('tinymce/plugins/code');
require('tinymce/plugins/codesample');
require('tinymce/plugins/image');

const contentCssUi = fs.readFileSync(
  'node_modules/tinymce/skins/ui/oxide/content.css',
  { encoding: 'UTF-8' },
);
const contentCss = fs.readFileSync(
  'node_modules/tinymce/skins/content/default/content.css',
  { encoding: 'UTF-8' },
);

exports.render = () => {
  tinymce.init({
    selector: 'textarea#post-content',
    height: 500,
    plugins: 'code codesample image',
    toolbar: 'undo redo | styleselect | bold italic | codesample image | alignleft aligncenter alignright alignjustify | outdent indent | code',
    relative_urls: false,
    content_css: false,
    content_style: `${contentCss.toString()}\n${contentCssUi.toString()}`,
  });
};
