;(function (Math) {



    var pow = Math.pow;

    var round = Math.round;

    var toFixed = (0).toFixed;

    var cache = new Decimal(0);



    for (var i = 0; i < 100; i++)
    {
        pow[i] = Math.pow(10, i);
    }




    // 小数处理类
    function Decimal(value) {

        var v, e;

        if (value)
        {
            if (value instanceof Decimal)
            {
                e = value.e;
                v = value.v;
            }
            else if ((value = +value) === value)
            {
                if (value === (value | 0))
                {
                    v = value || 0;
                }
                else if (e = (v = ('' + value).split('.'))[1])
                {
                    e = e.length;
                    v = +(v[0] + v[1]);
                }
                else
                {
                    e = 0;
                    v = value;
                }
            }
        }

        this.v = v || 0;
        this.e = e || 0;

        return this;
    }
    



    var prototype = (window.Decimal = Decimal).prototype;



    prototype.clone = function () {

        var result = Object.create(prototype);

        result.v = this.v;
        result.e = this.e;

        return result;
    }


    prototype.reset = function (value) {

        Decimal.call(this, value);
        return this;
    }


    prototype.plus = function (value) {

        var e1, e2;

        if (!value)
        {
            return this;
        }
        
        if (value instanceof Decimal)
        {
            e2 = value.e;
            value = value.v;
        }
        else if ((value = +value) !== value)
        {
            return this;
        }
        else if (value === (value | 0))
        {
            e2 = 0;
        }
        else
        {
            value = Decimal.call(cache, value);

            e2 = value.e;
            value = value.v;
        }
        
        if ((e1 = this.e) > e2)
        {
            this.v += value * pow[e1] / pow[e2];
        }
        else if (e1 < e2)
        {
            this.e = e2;
            this.v = this.v * pow[e2] / pow[e1] + value;
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

        var e;

        if (!value)
        {
            this.v = this.e = 0;
            return this;
        }

        if (!this.v)
        {
            return this;
        }

        if (value instanceof Decimal)
        {
            e = value.e;
            value = value.v;
        }
        else if ((value = +value) !== value)
        {
            return this;
        }
        else if (value === (value | 0))
        {
            e = 0;
        }
        else
        {
            value = Decimal.call(cache, value);

            e = value.e;
            value = value.v;
        }

        if (value)
        {
            this.v *= value;
        }
        else
        {
            this.v = this.e = 0;
            return this;
        }

        this.e += e;

        return this;
    }


    prototype.div = function (value) {

        var e1, e2;
        
        if (!value)
        {
            this.v = this.e = 0;
            return this;
        }

        if (!this.v)
        {
            return this;
        }

        if (value instanceof Decimal)
        {
            e2 = value.e;
            value = this.v / value.v;
        }
        else if ((value = +value) !== value)
        {
            this.v = this.e = 0;
            return this;
        }
        else if (value === (value | 0))
        {
            e2 = 0;
        }
        else
        {
            value = Decimal.call(cache, value);

            e2 = value.e;
            value = value.v;
        }

        if (!value)
        {
            this.v = this.e = 0;
            return this;
        }

        if ((e1 = this.e) !== e2)
        {
            if (e1 > e2)
            {
                value = this.v / (value * pow[e1 - e2]);
            }
            else
            {
                value = this.v * pow[e2 - e1] / value;
            }
        }
        else
        {
            value = this.v / value;
        }

        value = Decimal.call(cache, value);

        this.v = value.v;
        this.e = value.e;

        return this;
    }


    prototype.pow = function (value) {

        if (value |= 0)
        {
            var v = this.v;

            if (!v)
            {
                return this;
            }

            if (value > 0)
            {
                this.v *= pow[value];
            }
            else
            {
                this.e -= value;
            }
        }

        return this;
    }


    prototype.round = function (digits) {

        var e = this.e;

        if ((digits |= 0) < e)
        {
            this.v = round(this.v * pow[digits] / pow[e]);
            this.e = digits;
        }

        return this;
    }


    prototype.toFixed = function (digits) {

        var e = this.e;

        if ((digits |= 0) > 0)
        {
            if (e)
            {
                if (e > digits)
                {
                    return toFixed.call(round(this.v * pow[digits] / pow[e]) / pow[digits], digits);
                }

                return toFixed.call(this.v / pow[e], digits);
            }

            return toFixed.call(this.v, digits);
        }
        
        return e ? '' + round(this.v / pow[e]) : '' + this.v;
    }


    prototype.valueOf = function () {
        
        var e = this.e;
        return e ? this.v / pow[e] : this.v;
    }


    prototype.toString = function (k) {

        var e = this.e;
        return (e ? this.v / pow[e] : this.v).toString(k);
    }




    Object.defineProperty(prototype, 'value', {

        get: function () {

            var e = this.e;
            return e ? this.v / pow[e] : this.v;
        }
    });



    // 重载四舍五入方法增加指定小数位数
    Math.round = function (value, digits) {

        if ((digits |= 0) > 0)
        {
            if ((value = +value) !== value)
            {
                return value;
            }

            var items = ('' + value).split('.'),
                decimal = items[1];

            if (decimal.length <= digits)
            {
                return value;
            }

            return round(items[0] + decimal.slice(0, digits) + '.' + decimal[digits]);
        }
        
        return round(value);
    }


    // 注: 不同浏览器toFixed有差异, chrome使用的是银行家舍入规则
    // 银行家舍入: 所谓银行家舍入法, 其实质是一种四舍六入五取偶(又称四舍六入五留双)法
    // 简单来说就是: 四舍六入五考虑, 五后非零就进一, 五后为零看奇偶, 五前为奇应舍去, 五前为偶要进一
    // 此处统一处理为四舍五入
    if ((1.115).toFixed(2) === '1.11')
    {
        Number.prototype.toFixed = function (digits) {

            return new Decimal(this).toFixed(digits);
        }
    }


    // test
    // new Decimal(.1).plus(.2).value === 0.3;
    // new Decimal(10).mul(12.1).value === 121;
    // new Decimal(2.135).round(2).value === '2.14';




})(Math);
