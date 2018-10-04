const webminify = require('webminify');


webminify()
    .load('less', [
        'color.less',
        'base.less',
        'listbox.less',
        'calendar.less',
        'slider.less',
        'progressbar.less',
        'tree.less',
        'grid.less',
        'groupbox.less',
        'pagination.less',
        'tab.less',
        'dialog.less',
        'popup.less',
        'tooltip.less',
        'toast.less',
        'box.less',
        'message.less',
        'menu.less'
    ])
    .combine('\r\n\r\n\r\n\r\n\r\n')
    .lessToCss()
    .output('css/default/flyingon.css');
