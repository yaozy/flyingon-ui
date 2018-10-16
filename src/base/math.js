;(function (Math) {


    var pow = Math.pow;

    var round = Math.round;



    for (var i = 0; i < 50; i++)
    {
        pow[i] = pow(10, i);
    }



    function parse(value) {

        var k;

        value = ('' + value).split('.');

        if (k = value[1])
        {
            value[0] = +(value[0] + k);
            value[1] = pow[k = k.length] || (pow[k] = pow(10, k));
        }
        else
        {
            value[0] = +value[0];
            value[1] = 1;
        }

        return value;
    }



    // 小数处理类
    function Decimal(value) {

        value = +value;
        
        if (value !== value || value === (value | 0))
        {
            this.v = value;
            this.s = 1;
        }
        else
        {
            value = parse(value);

            this.v = value[0];
            this.s = value[1];
        }
    }
    



    var prototype = (window.Decimal = Decimal).prototype;



    prototype.reset = function (value) {

        Decimal.call(this, value);
        return this;
    }


    prototype.plus = function (value) {

        var scale1, scale2;
        
        value = +value;

        if (value !== value)
        {
            this.v = value;
            this.s = 1;

            return this;
        }

        scale1 = this.s;

        if (value === (value | 0))
        {
            scale2 = 1;
        }
        else
        {
            value = parse(value);

            scale2 = value[1];
            value = value[0];
        }
        
        if (scale1 > scale2)
        {
            this.v += value * scale1 / scale2;
        }
        else if (scale1 < scale2)
        {
            this.s = scale2;
            this.v = this.v * scale2 / scale1 + value;
        }
        else
        {
            this.v += value;
        }

        return this;
    }


    prototype.minus = function (value) {

        return this.plus(-value);
    }


    prototype.mul = function (value) {

        var scale;

        value = +value;

        if (value !== value)
        {
            this.v = value;
            this.s = 1;

            return this;
        }
        
        if (value === (value | 0))
        {
            scale = 1;
        }
        else
        {
            value = parse(value);

            scale = value[1];
            value = value[0];
        }

        this.v *= value;
        this.s *= scale;

        return this;
    }


    prototype.div = function (value) {

        var scale1, scale2;
        
        value = +value;

        if (value !== value)
        {
            this.v = value;
            this.s = 1;

            return this;
        }

        scale1 = this.s;
        
        if (value === (value | 0))
        {
            scale2 = 1;
        }
        else
        {
            value = parse(value);

            scale2 = value[1];
            value = value[0];
        }

        if (scale1 !== scale2)
        {
            if (scale1 > scale2)
            {
                value = this.v * scale2 / (value * scale1);
            }
            else
            {
                value = this.v * scale1 / (value * scale2);
            }
        }
        else
        {
            value = this.v / value;
        }

        value = parse(value);

        this.v = value[0];
        this.s = value[1];
        
        return this;
    }


    prototype.pow = function (value) {

        if (value |= 0)
        {
            if (value > 0)
            {
                this.v *= pow[value];
            }
            else
            {
                this.s += value;
            }
        }

        return this;
    }


    prototype.round = function (digits) {

        var scale = this.s;

        if (scale > 1 && (digits |= 0) > 0)
        {
            digits = pow[digits];

            if (scale > digits)
            {
                this.v = round(this.v * digits / scale);
                this.s = digits;
            }
        }

        return this;
    }


    prototype.toFixed = function (digits) {

        var scale1 = this.s;

        if ((digits |= 0) > 0)
        {
            if (scale1 > 1)
            {
                var scale2 = pow[digits];

                if (scale1 > scale2)
                {
                    return (round(this.v * scale2 / scale1) / scale2).toFixed(digits);
                }

                return (this.v / scale1).toFixed(digits);
            }

            return this.v.toFixed(digits);
        }
        
        return scale1 > 1 ? '' + round(this.v / scale1) : '' + this.v;
    }


    prototype.valueOf = function () {
        
        var scale = this.s;
        return scale > 1 ? this.v / scale : this.v;
    }


    prototype.toString = function (k) {

        var scale = this.s;
        return (scale > 1 ? this.v / scale : this.v).toString(k);
    }




    Object.defineProperty(prototype, 'value', {

        get: function () {

            var scale = this.s;
            return scale > 1 ? this.v / scale : this.v;
        }
    });



    // 注: 不同浏览器toFixed有差异, chrome使用的是银行家舍入规则
    // 银行家舍入: 所谓银行家舍入法, 其实质是一种四舍六入五取偶(又称四舍六入五留双)法
    // 简单来说就是: 四舍六入五考虑, 五后非零就进一, 五后为零看奇偶, 五前为奇应舍去, 五前为偶要进一
    // 此处统一处理为四舍五入
    Object.defineProperty(Number.prototype, 'toFixed2', {

        enumerable: false,

        value: (1.115).toFixed(2) !== '1.11' ? (0).toFixed : function (digits) {

            return new Decimal(this).toFixed(digits);
        }
    });



})(Math);
