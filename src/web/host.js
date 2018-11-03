//宿主容器
(function (flyingon, document) {
    
   
          
    /*

    W3C事件规范:

    A: 鼠标事件 mousedown -> mouseup -> click -> mousedown -> mouseup -> click -> dblclick
    注: IE8以下会忽略第二个mousedown和click事件

    1. mousedown 冒泡 鼠标按下时触发
    2. mousemove 冒泡 鼠标在元素内部移动时重复的触发
    3. mouseup 冒泡 释放鼠标按键时触发
    4. click 冒泡 单击鼠标按键或回车键时触发
    5. dblclick 冒泡 双击鼠标按键时触发
    6. mouseover 冒泡 鼠标移入一个元素(包含子元素)的内部时触发
    7. mouseout 冒泡 鼠标移入另一个元素(包含子元素)内部时触发
    8. mouseenter 不冒泡 鼠标移入一个元素(不包含子元素)内部时触发
    9. mouseleave 不冒泡 鼠标移入另一个元素(不包含子元素)内部时触发


    B: 键盘事件

    1. keydown 冒泡 按下键盘上的任意键时触发 如果按住不放会重复触发
    2. keypress 冒泡 按下键盘上的字符键时触发 如果按住不放会重复触发
    3. keyup 冒泡 释放键盘上的按键时触发


    C: 焦点事件

    1. focus 不冒泡 元素获得焦点时触发
    2. blur 不冒泡 元素失去焦点时触发
    3. focusin 冒泡 元素获得焦点时触发
    4. focusout 冒泡 元素失去焦点时触发

    */
   
    
    var MouseEvent = flyingon.MouseEvent;
        
    var KeyEvent = flyingon.KeyEvent;

    var TouchEvent = flyingon.TouchEvent;
    
    var on = flyingon.dom_on;
    
    //鼠标按下事件
    var mousedown = null;
    
    //调整大小参数
    var resizable = 0;
    
 


    //在指定dom容器显示控件
    flyingon.show = function (control, host) {

        if (!control.__top_control)
        {
            if (typeof host === 'string')
            {
                host = document.getElementById(host);
            }
            
            if (!host)
            {
                throw 'can not find host!';
            }
        
            //先获取容器大小以提升性能
            var width = host.clientWidth,
                height = host.clientHeight;

            control.__top_control = true;

            //挂载之前处理挂起的ready队列
            flyingon.ready();
            flyingon.__update_patch();

            host.appendChild(control.view || control.renderer.createView(control));

            if (control instanceof flyingon.Panel)
            {
                control.__location_values = null;
                control.offsetLeft = control.offsetTop = 0;

                control.measure(width, height, width, height, height ? 3 : 1);
                control.renderer.locate(control);
            }
            else
            {
                control.renderer.update(control);
            }
        }
    };


    //隐藏控件
    flyingon.hide = function (control, dispose) {

        if (control.__top_control)
        {
            var view = control.view,
                any;

            if (view && (any = view.parentNode))
            {
                any.removeChild(view);
            }

            control.__top_control = false;

            if (dispose !== false)
            {
                control.dispose();
            }
        }
    };

    
            
    //查找与指定dom关联的控件
    flyingon.findControl = function (dom) {
        
        var id;
        
        while (dom)
        {
            if (id = dom.flyingon_id)
            {
                return flyingon.__uniqueId[id];
            }
            
            dom = dom.parentNode;
        }
    };


        
    //通用鼠标事件处理
    function mouse_event(e) {
        
        var control = flyingon.findControl(e.target),
            any;
        
        if (control && !((any = control.__storage) && any.disabled))
        {
            control.trigger(new MouseEvent(e));
        }
    };
    
    
    //通用键盘事件处理
    function key_event(e) {
        
        var control = flyingon.findControl(e.target),
            any;
        
        if (control && !((any = control.__storage) && any.disabled))
        {
            control.trigger(new KeyEvent(e));
        }
    };


    function touch_event(e) {

        var control = flyingon.findControl(e.target),
            any;
        
        if (control && !((any = control.__storage) && any.disabled))
        {
            control.trigger(new TouchEvent(e));
        }
    };
    
    
    //检查调整尺寸方向
    function check_resize(value, e) {
        
        var dom = this.view,
            rect = dom.getBoundingClientRect(),
            side = 0,
            cursor = '',
            x,
            y;
        
        if (value !== 'x')
        {
            x = e.clientY - rect.top;
            
            if (x >= 0 && x <= 4)
            {
                side = 1;
                cursor = 's';                
            }
            else
            {
                y = this.offsetHeight;
                
                if (x >= y - 4 && x <= y)
                {
                    side = 2;
                    cursor = 'n';
                }
            }
        }
        
        if (value !== 'y')
        {
            x = e.clientX - rect.left;
            
            if (x >= 0 && x <= 4)
            {
                side |= 4;
                cursor += 'e';
            }
            else
            {
                y = this.offsetWidth;
                
                if (x >= y - 4 && x <= y)
                {
                    side |= 8;
                    cursor += 'w';
                }
            }
        }

        if (cursor)
        {
            cursor += '-resize';
        }
        else
        {
            cursor = this.cursor();
        }
        
        dom.style.cursor = cursor || '';
        
        return side;
    };
    
    
    function do_resize(data) {
        
        var side = data.side,
            width = this.offsetWidth,
            height = this.offsetHeight;
        
        if ((side & 1) === 1) //top
        {
            this.height(width = data.height - data.distanceY);
        }
        else if ((side & 2) === 2) //bottom
        {
            this.height(width = data.height + data.distanceY);
        }
        
        if ((side & 4) === 4) //left
        {
            this.width(height = data.width - data.distanceX);
        }
        else if ((side & 8) === 8) //right
        {
            this.width(height = data.width + data.distanceX);
        }

        if (this.__top_control)
        {
            this.measure(width, height);
            this.update();
        }

        clear_selection();
    };
    
    

    function clear_selection() {

        var fn = window.getSelection;

        if (fn)
        {
            fn.call(window).removeAllRanges();
        }
        else
        {
            document.selection.empty();
        }
    };
    

    on(document, 'mousedown', function (e) {
        
        var control = flyingon.findControl(e.target),
            any;
        
        if (control && !((any = control.__storage) && any.disabled) && 
            control.trigger(mousedown = new MouseEvent(e)) !== false)
        {
            if (any = resizable)
            {
                resizable = {
                
                    side: any,
                    width: control.offsetWidth,
                    height: control.offsetHeight
                };
            }
        }

    });
    
    
    on(document, 'mousemove', function (e) {
        
        var start = mousedown,
            control,
            any;
        
        if (start && (control = start.target))
        {
            var x = e.clientX - start.clientX,
                y = e.clientY - start.clientY;
                
            if (any = resizable)
            {
                any.distanceX = x;
                any.distanceY = y;

                do_resize.call(control, any);
            }
            else
            {
                e = new MouseEvent(e);
                
                e.mousedown = start;
                e.distanceX = x;
                e.distanceY = y;
                
                control.trigger(e);
            }
        }
        else if (control = flyingon.findControl(e.target))
        {
            if ((any = control.resizable) && any.call(control) !== 'none')
            {
                resizable = (control.__check_resize || check_resize).call(control, any, e);
            }
            else if (!((any = control.__storage) && any.disabled))
            {
                control.trigger(new MouseEvent(e));
            }
        }
    });
    
    
    //按下鼠标时弹起处理
    on(document, 'mouseup', function (e) {
        
        var start = mousedown,
            control,
            any;
        
        if (start && (control = start.target))
        {
            if (any = resizable)
            {
                resizable = 0;
            }

            e = new MouseEvent(e);

            e.mousedown = start;
            e.distanceX = e.clientX - start.clientX;
            e.distanceY = e.clientY - start.clientY;

            control.trigger(e);
            
            mousedown = null;
        }
        else if ((control = flyingon.findControl(e.target)) && !((any = control.__storage) && any.disabled))
        {
            control.trigger(new MouseEvent(e));
        }

    });
        
            
    on(document, 'click', mouse_event);
    
    
    on(document, 'dblclick', mouse_event);
    
    
    on(document, 'mouseover', mouse_event);
    
    
    on(document, 'mouseout', mouse_event);
    
    
    
    on(document, 'keydown', key_event);
    
    on(document, 'keypress', key_event);
    
    on(document, 'keyup', key_event);


    on(document, 'touchstart', touch_event);

    on(document, 'touchmove', touch_event);

    on(document, 'touchend', touch_event);

    on(document, 'touchcancel', touch_event);


    on(document, 'contextmenu', function (e) {

        var control = flyingon.findControl(e.target);

        if (control)
        {
            var event = new flyingon.Event(e.type);

            event.original_event = e;
            
            if (control.trigger(event) === false)
            {
                return false;
            }

            var Class = flyingon.Menu,
                menu;

            do
            {
                if ((menu = control.__storage) && (menu = menu.contextmenu))
                {
                    if (typeof menu === 'string')
                    {
                        menu = Class.all[menu];
                    }

                    if (menu instanceof Class)
                    {
                        menu.showAt(e.clientX, e.clientY);
                        return false;
                    }
                }
            }
            while (control = control.parent);
        }
    });



    /* 各浏览器对focusin/focusout事件的支持区别

    	                                    IE6/7/8	    IE9/10	    Firefox5	Safari5	    Chrome12	Opera11
    e.onfocusin	                            Y	        Y	        N	        N	        N	        Y
    e.attachEvent('onfocusin',fn)	        Y	        Y	        N	        N	        N	        Y
    e.addEventListener('focusin',fn,false)	N	        Y	        N	        Y	        Y	        Y

    */

    //IE
    if ('onfocusin' in document)
    {
        on(document, 'focusin', focus);
        on(document, 'focusout', blur);
    }
    else //w3c标准使用捕获模式
    {
        on(document, 'focus', focus, true);
        on(document, 'blur', blur, true);
    }


    function focus(e) {

        var control = flyingon.findControl(e.target);

        if (flyingon.activeControl = control)
        {
            control.trigger('focus');
            control.renderer.__do_focus(control, e);
        }
    };


    function blur(e) {

        var control = flyingon.findControl(e.target);

        flyingon.activeControl = null;

        if (control)
        {
            control.trigger('blur');
            control.renderer.__do_blur(control, e);
        }
    };



    //滚事件不冒泡,每个控件自己绑定
    flyingon.__dom_scroll = function (event) {
      
        var control = flyingon.findControl(this),
            any;

        if (control && !((any = control.__storage) && any.disabled))
        {
            if (control.trigger('scroll') !== false)
            {
                control.renderer.__do_scroll(control, 
                    control.scrollLeft = this.scrollLeft, 
                    control.scrollTop = this.scrollTop);
            }
            else
            {
                try
                {
                    this.onscroll = null;
                    this.scrollTop = control.scrollTop;
                    this.scrollLeft = control.scrollLeft;
                }
                finally
                {
                    this.onscroll = flyingon.__dom_scroll;
                }
            }
        }
    };


    
    //滚轮事件兼容处理firefox和其它浏览器不一样
    on(document, document.mozHidden ? 'DOMMouseScroll' : 'mousewheel', function (e) {

        var control = flyingon.findControl(e.target),
            any;

        if (control && !((any = control.__storage) && any.disabled))
        {
            //firefox向下滚动是3 其它浏览器向下滚动是-120 此处统一转成-120
            control.trigger('mousewheel', 'original_event', e, 'wheelDelta', e.wheelDelta || -e.detail * 40 || -120);
        }
    });



    
})(flyingon, document);