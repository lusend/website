import { nanoid } from 'nanoid';

import { Editor, Node, mergeAttributes } from '@tiptap/core';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import DropCursor from '@tiptap/extension-dropcursor';
import GapCursor from '@tiptap/extension-gapcursor';
import History from '@tiptap/extension-history';
import Heading from '@tiptap/extension-heading';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';

/**
 * A function that will use the adobe DC Embed PDF API to inline PDFs on the brochure
 * @returns script to build PDFs
 */
function pdfListener() {
  const script = document.createElement('script');
  script.innerHTML = `window.addEventListener('load', function () {
    [...document.querySelectorAll('div[id^=pdf]')].forEach(
      (pdfWrapper) => {
        const pdf = pdfWrapper.querySelector('object');
        const url = pdf.data;
        const fileName = 'download.pdf';
        const id = pdfWrapper.id;

        var adobeDCView = new AdobeDC.View({
          clientId: '9ec6f2abc7b34e9c87f0639106879d49',
          divId: id
        });

        adobeDCView.previewFile(
          { content: { location: { url } }, metaData: { fileName } },
          { embedMode: 'IN_LINE', enableLinearization: false }
        );
      }
    );
  });`;

  return script;
}

function addGlobalVar(name, value) {
  const script = document.createElement('script');
  script.innerHTML = `const ${name} = '${JSON.stringify(
    value
  )}'; window.${name} = ${name}`;
  return script;
}

/**
 * A custom PDF Extension for tiptap
 */
const PDF = Node.create({
  name: 'pdf',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  addAttributes() {
    return {
      data: {
        default: ''
      },
      type: {
        default: 'application/pdf'
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'object[data][type="application/pdf"]'
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const href =
      node.attrs.data ||
      this.options.HTMLAttributes.data ||
      HTMLAttributes.data ||
      '';
    return [
      'div',
      {
        id: 'pdf-' + nanoid()
      },
      [
        'object',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          width: '100%',
          height: '100%',
          data:
            href +
            '#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0&pagemode=none'
        }),
        [
          'span',
          {},
          'PDF embeds are not supported in this browser, and/or you are trying to access a PDF you do not have access to on this website. Try downloading the PDF by navigating to ',
          ['a', { href, target: '_blank' }, 'this link.']
        ]
      ]
    ];
  },

  addCommands() {
    return {
      setPDF:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});

/**
 * A custom Iframe/Video embed extension for tiptap
 */

function manipulateEmbedURL(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11
    ? '//www.youtube.com/embed/' + match[2]
    : url;
}

const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: { class: 'iframe-wrapper' }
    };
  },

  addAttributes() {
    return {
      src: {
        default: null
      },
      frameborder: {
        default: 0
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen
      }
    };
  },

  parseHTML() {
    return [{ tag: 'iframe[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  }
});

/**
 * Alpine Store for creating an editor and handling its data
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('editor', (customId = null, customContent = null) => {
    const editors = window.tiptapEditors || {};

    return {
      id: null,
      updatedAt: null,

      init() {
        this.id = customId ? customId : this.$el.id;
        const section = document.getElementById(this.id);
        const _this = this;

        [
          ...document.querySelectorAll(`#${this.id} :is(h1,h2,h3,h4,h5,h6)`)
        ].forEach(
          (heading) =>
            (heading.innerHTML = heading.querySelector('a').innerHTML)
        );

        const content = customContent
          ? customContent
          : section.innerHTML.trim();

        section.innerHTML = '';

        editors[this.id] = new Editor({
          element: section,
          editorProps: {
            attributes: {
              class: 'prose focus:outline-none w-full max-w-[85ch]'
            }
          },
          extensions: [
            Document,
            PDF,
            Paragraph,
            Text,
            Bold,
            Underline,
            Code,
            Italic,
            Strike,
            HardBreak,
            CodeBlock,
            Blockquote,
            BulletList,
            Iframe,
            OrderedList,
            ListItem,
            HorizontalRule,
            DropCursor,
            GapCursor,
            History,
            TextStyle,
            Color,
            Link.configure({
              openOnClick: false
            }),
            Image.configure({
              HTMLAttributes: {
                class: 'header'
              }
            }),
            Superscript,
            TaskList,
            TaskItem,
            Subscript.extend({
              addKeyboardShortcuts() {
                return {
                  'Mod-Shift-,': () => this.editor.commands.toggleSubscript()
                };
              }
            }),
            Table.configure({ resizable: false }),
            TableRow,
            TableHeader,
            TableCell,
            Highlight.configure({ multicolor: true }),
            Heading.configure({ levels: [1, 2, 3] }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
              placeholder: 'Your Content Goes Here...'
            }),
            Typography
          ],
          content,
          onCreate() {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          },
          onUpdate() {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          },
          onSelectionUpdate() {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          },
          onTransaction: () => {
            _this.updatedAt = Date.now();
            _this.$data.lastUpdate = Date.now();
          }
        });

        window.tiptapEditors = editors;

        this.$data.editor = () => {
          return editors[this.currentId];
        };
      }
    };
  });

  Alpine.data('menu', () => {
    return {
      init() {},
      isActive(type, lastUpdate) {
        // lastUpdate forces a rerender
        return this.$data.editor() && this.$data.editor().isActive(type);
      },
      toggleBold() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleBold().focus().run()
        );
      },
      toggleUnderline() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleUnderline().focus().run()
        );
      },
      toggleStrike() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleStrike().focus().run()
        );
      },
      toggleCode() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleCode().focus().run()
        );
      },
      toggleItalic() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().toggleItalic().focus().run()
        );
      },
      clearFormat() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().unsetAllMarks().run()
        );
      },
      toggleLink() {
        let previousLink =
          this.$data.editor() && this.$data.editor().getAttributes('link').href;
        let link = prompt('Enter your URL Link: ', previousLink);

        if (!link)
          return (
            this.$data.editor() &&
            this.$data
              .editor()
              .chain()
              .focus()
              .extendMarkRange('link')
              .unsetLink()
              .run()
          );

        return (
          this.$data.editor() &&
          this.$data
            .editor()
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: link, target: '_self' })
            .run()
        );
      },
      createIframe() {
        let previousIframe =
          this.$data.editor() &&
          this.$data.editor().getAttributes('iframe').src;
        let iframe = prompt('Enter your Video Embed Link: ', previousIframe);

        if (!iframe) return;

        return (
          this.$data.editor() &&
          this.$data
            .editor()
            .chain()
            .focus()
            .setIframe({ src: manipulateEmbedURL(iframe) })
            .run()
        );
      },
      createImage() {
        let previousImage =
          this.$data.editor() &&
          this.$data.editor().getAttributes('iframe').src;
        let image = prompt('Enter the link to your Image: ', previousImage);

        if (!image) return;

        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setImage({ src: image }).run()
        );
      },
      createPDF() {
        let previousPDF =
          this.$data.editor() && this.$data.editor().getAttributes('pdf').data;

        let pdf = prompt('Enter the link to the PDF: ', previousPDF);

        if (!pdf) return;

        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().setPDF({ data: pdf }).run()
        );
      },
      canUndo(lastUpdate) {
        // lastUpdate forces a rerender
        return this.$data.editor() && this.$data.editor().can().undo();
      },
      canRedo(lastUpdate) {
        // lastUpdate forces a rerender
        return this.$data.editor() && this.$data.editor().can().redo();
      },
      isSelected(lastUpdate) {
        // lastUpdate forces a rerender
        return (
          this.$data.editor() &&
          this.$data.editor().view.state.selection &&
          !this.$data.editor().view.state.selection.empty
        );
      },
      undo() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().undo().run()
        );
      },
      redo() {
        return (
          this.$data.editor() &&
          this.$data.editor().chain().focus().redo().run()
        );
      }
    };
  });
});

/**
 * A function to remove certain parts from the HTML
 * @param {string} html A string of html
 * @param {string[]} sections A list of section names that should be removed (i.e. a section wrapped with <!--STRIP SCRIPT-->...<!--STRIPEND SCRIPT--> would be removed)
 * @returns Removes a list of stripped sections from the html string
 */
function removeStrip(html, sections) {
  if (!Array.isArray(sections)) sections = [sections];

  return sections
    .map((section) => section.toLowerCase())
    .reduce(
      (prev, cur) =>
        prev.replace(
          new RegExp(
            `<!--STRIP ${cur}-->(.|\n)*?<!--STRIPEND ${cur}-->`,
            'gim'
          ),
          ''
        ),
      html
    );
}

const appData =
  '{"appOverview":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Trip Overview"}]}]},"appResources":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Travel Resources"}]}]},"appSafety":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Travel Safety"}]}]},"appChecklist":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Traveler Checklist"}]}]},"appFlights":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Flight Itinerary"}]}]},"appPacking":{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":"left","level":1},"content":[{"type":"text","text":"Packing Guide"}]}]}}';

document.querySelector('#appSubtitle').innerHTML =
  'XX Month, 20XX - XX Month, 20XX';
document.querySelector('#appApplicationDeadline').innerHTML =
  'Application Due XX/XX/20XX';

/**
 * Copies the brochure to be pasted into the TD WYSIWYG
 */
async function exportBrochure(programID) {
  const html = await get(window.location.href, { asText: true });
  const strippedHTML = removeStrip(html, ['script', 'menu', 'importexport']);

  const parser = new DOMParser();

  const finalJSON = {};
  let finalHTML = parser.parseFromString(strippedHTML, 'text/html');
  for (const [section, editor] of Object.entries(window.tiptapEditors)) {
    const tempHTML = editor.getHTML();
    finalHTML.getElementById(section).innerHTML =
      tempHTML === '<p></p>' ? '&nbsp;' : tempHTML;
    finalHTML.getElementById(section).removeAttribute('x-data');
    finalJSON[section] = editor.getJSON();
  }

  finalJSON.other = {
    background: window.backgroundImage
  };

  finalHTML.getElementById('app').appendChild(pdfListener());
  finalHTML
    .getElementById('app')
    .appendChild(addGlobalVar('appData', finalJSON));

  if (window.backgroundImage)
    finalHTML
      .getElementById('appBackground')
      .setAttribute('x-init', `background = '${window.backgroundImage}'`);

  await navigator.clipboard.writeText(
    finalHTML.head.innerHTML + finalHTML.body.innerHTML
  );

  if (programID !== false) {
    window.open(
      'https://liberty-sa.terradotta.com/index.cfm?FuseAction=ProgramAdmin.BrochureEdit&Program_ID=' +
        programID,
      '_blank'
    );
  }
}

async function importBrochure(importData) {
  if (importData) {
    try {
      const data = JSON.parse(importData);
      setTimeout(function () {
        for (const [section, editor] of Object.entries(window.tiptapEditors)) {
          if (data && data[section]) editor.commands.setContent(data[section]);
          document.getElementById('importBrochureButton').style.display =
            'none';
        }

        if (data.other) {
          const other = data.other;

          if (other.background) {
            window.backgroundImage = other.background;
            document.getElementById(
              'appBackground'
            ).style.backgroundImage = `url('${other.background}')`;
          }
        }
      }, 0);
    } catch (error) {
      console.warn(error);
    }
  }
}

/**
 * Makes this function publicly available
 */
window.exportBrochure = exportBrochure;
window.importBrochure = importBrochure;
window.appData = appData;
