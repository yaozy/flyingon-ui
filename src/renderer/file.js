flyingon.renderer('File', 'Button', function (base) {


    this.render = function (writer, control, render) {

        writer.push('<button type="button"');
        
        render.call(this, writer, control);
        
        writer.push('><span class="f-button-icon" style="display:none;width:16px;height:16px;"></span>',
                '<br style="display:none;"/>',
                '<span class="f-button-text"></span>',
                '<input type="file" style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;"/>',
            '</button>');
    }


    this.accept = function (control, view, value) {

        view.lastChild.setAttribute('accept', value);
    }


});