/// <reference path="bootstrap.js" />
/// <reference path="jquery.min.js" />
/// <reference path="rangy-core.js" />
/// <reference path="rangy-selectionsaverestore.js" />
/// <reference path="rangy-cssclassapplier.js" />
/// <reference path="he.js" />
/// <reference path="to-markdown.js" />

$(function () {
    rangy.init();
    var cmd = {
        code: rangy.createCssClassApplier("cmd-code", { normalize: true })
    };
    var insertTag = function (tag) {
        var sel = document.getSelection();
        var insertTagAtCursor = function (tag) {
            var node = sel.anchorNode;
            /* Note 1: Zero-width character &#8203; is required as Chrome could not
             * move cursor to within an empty tag
             */
            $('<' + tag + '>&#8203;</' + tag + '>').insertAfter(node);
            node = node.nextSibling;
            sel.collapse(node, 1);
        };
        if (sel.isCollapsed) {
            insertTagAtCursor(tag);
        } else {
            cmd[tag].toggleSelection();
        }

        
    };

    $('#editor-toolbar button, #editor-toolbar ul li a').click(function (e) {
        var role = $(this).data('role');
        switch (role) {
            case 'bold':
            case 'italic':
            case 'superscript':
            case 'strikethrough':
            case 'justifyLeft':
            case 'justifyRight':
            case 'justifyCenter':
            case 'insertUnorderedList':
            case 'insertOrderedList':
            case 'indent':
            case 'outdent':
                document.execCommand(role, false, null);
                break;
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'div':
            case 'pre':
            case 'blockquote':
                document.execCommand('formatBlock', false, role);
                break;
            case 'code':  // Custom solution since <code> tag not supported by execCommand
                insertTag('code');
                break;
            case 'getselection':
                playWithSelection();
            default:
                break;
        }

    });
    $('#editor-toolbar button, #editor-toolbar ul li a').mousedown(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $('#parseToMarkdown').click(function () {
        var editorHTML = document.getElementById('editor').innerHTML;
        var markdown = toMarkdown(editorHTML);
        $('#output').html(markdown);
    });
});