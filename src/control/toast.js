(function () {


    var dom = document.createElement('div');

    var mask = document.createElement('div');

    var delay;



    dom.className = 'yx-toast';
    mask.className = 'yx-mask';



    function show(options) {

        var style = dom.style;

        close();

        dom.innerHTML = (options.loading ? '<span class="yx-loading"></span>' : '')
            + '<span>' + options.text + '</span>';
    
        if (options.mask || options.loading && options.mask !== false)
        {
            document.body.appendChild(mask);
        }

        document.body.appendChild(dom);

        style.cssText = options.style || '';
        style.left = (window.innerWidth - dom.offsetWidth >> 1) + 'px';

        switch (options.position)
        {
            case 'top':
                style.top = options.offset == null ? '.8rem' : options.offset;
                break;

            case 'bottom':
                style.bottom = options.offset == null ? '.8rem' : options.offset;
                break;

            default:
                style.top = (window.innerHeight - dom.offsetHeight >> 1) + 'px';
                break;
        }

        delay = setTimeout(close, options.time || 2500);
    }


    function close() {

        var any;

        delay = 0;

        if (any = dom.parentNode)
        {
            any.removeChild(dom);
        }

        if (any = mask.parentNode)
        {
            any.removeChild(mask);
        }
    }


    this.toast = function (options) {

        if (delay)
        {
            clearTimeout(delay);
        }

        if (!options)
        {
            return;
        }

        if (typeof options === 'string')
        {
            options = { text: options };
        }
    
        if (options.delay > 0)
        {
            delay = setTimeout(function () {

                show(options);

            }, options.delay);
        }
        else
        {
            show(options);
        }
    }


    this.toast.hide = function () {

        if (delay)
        {
            clearTimeout(delay);
        }

        close();
    }

    

}).call(flyingon);
