(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.dj.aP === region.dK.aP)
	{
		return 'on line ' + region.dj.aP;
	}
	return 'on lines ' + region.dj.aP + ' through ' + region.dK.aP;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fs,
		impl.gd,
		impl.f2,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		as: func(record.as),
		dl: record.dl,
		c7: record.c7
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.as;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.dl;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.c7) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fs,
		impl.gd,
		impl.f2,
		function(sendToApp, initialModel) {
			var view = impl.gf;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fs,
		impl.gd,
		impl.f2,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.dc && impl.dc(sendToApp)
			var view = impl.gf;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.ak);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.dq) && (_VirtualDom_doc.title = title = doc.dq);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.fO;
	var onUrlRequest = impl.fP;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		dc: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.em === next.em
							&& curr.dR === next.dR
							&& curr.eh.a === next.eh.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		fs: function(flags)
		{
			return A3(impl.fs, flags, _Browser_getUrl(), key);
		},
		gf: impl.gf,
		gd: impl.gd,
		f2: impl.f2
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { fo: 'hidden', e2: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { fo: 'mozHidden', e2: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { fo: 'msHidden', e2: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { fo: 'webkitHidden', e2: 'webkitvisibilitychange' }
		: { fo: 'hidden', e2: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		ev: _Browser_getScene(),
		eR: {
			eT: _Browser_window.pageXOffset,
			eU: _Browser_window.pageYOffset,
			eS: _Browser_doc.documentElement.clientWidth,
			dQ: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		eS: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		dQ: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			ev: {
				eS: node.scrollWidth,
				dQ: node.scrollHeight
			},
			eR: {
				eT: node.scrollLeft,
				eU: node.scrollTop,
				eS: node.clientWidth,
				dQ: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			ev: _Browser_getScene(),
			eR: {
				eT: x,
				eU: y,
				eS: _Browser_doc.documentElement.clientWidth,
				dQ: _Browser_doc.documentElement.clientHeight
			},
			fa: {
				eT: x + rect.left,
				eU: y + rect.top,
				eS: rect.width,
				dQ: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}



// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.N.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.N.b, xhr)); });
		$elm$core$Maybe$isJust(request.gc) && _Http_track(router, xhr, request.gc.a);

		try {
			xhr.open(request.fx, request.U, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.U));
		}

		_Http_configureRequest(xhr, request);

		request.ak.a && xhr.setRequestHeader('Content-Type', request.ak.a);
		xhr.send(request.ak.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.fm; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.f5.a || 0;
	xhr.responseType = request.N.d;
	xhr.withCredentials = request.eY;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		U: xhr.responseURL,
		f0: xhr.status,
		f1: xhr.statusText,
		fm: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			f_: event.loaded,
			ez: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			fT: event.loaded,
			ez: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}



// VIRTUAL-DOM WIDGETS


var _Markdown_toHtml = F3(function(options, factList, rawMarkdown)
{
	return _VirtualDom_custom(
		factList,
		{
			a: options,
			b: rawMarkdown
		},
		_Markdown_render,
		_Markdown_diff
	);
});



// WIDGET IMPLEMENTATION


function _Markdown_render(model)
{
	return A2(_Markdown_replace, model, _VirtualDom_doc.createElement('div'));
}


function _Markdown_diff(x, y)
{
	return x.b === y.b && x.a === y.a
		? false
		: _Markdown_replace(y);
}


var _Markdown_replace = F2(function(model, div)
{
	div.innerHTML = _Markdown_marked(model.b, _Markdown_formatOptions(model.a));
	return div;
});



// ACTUAL MARKDOWN PARSER


var _Markdown_marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^_\_([\s\S]+?)_\_(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|_\_)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^_\_(?=\S)([\s\S]*?\S)_\_(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function _Markdown_formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && $elm$core$Maybe$isJust(options.dH))
		{
			lang = options.dH.a;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.fl.a;

	return {
		highlight: toHighlight,
		gfm: gfm,
		tables: gfm && gfm.f3,
		breaks: gfm && gfm.e0,
		sanitize: options.fY,
		smartypants: options.f$
	};
}
var $author$project$Main$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.g) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.h),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.h);
		} else {
			var treeLen = builder.g * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.i) : builder.i;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.g);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.h) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.h);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{i: nodeList, g: (len / $elm$core$Array$branchFactor) | 0, h: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {dO: fragment, dR: host, ef: path, eh: port_, em: protocol, c8: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Main$Model = F2(
	function (shared, page) {
		return {av: page, z: shared};
	});
var $author$project$Main$Pages = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$Shared = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Spa$Generated$Route$NotFound = {$: 3};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {ab: frag, fS: params, T: unvisited, eQ: value, af: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.T;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.eQ);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.eQ);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.ef),
					$elm$url$Url$Parser$prepareQuery(url.c8),
					url.dO,
					$elm$core$Basics$identity)));
	});
var $author$project$Spa$Generated$Route$Article__Slug_String = function (a) {
	return {$: 6, a: a};
};
var $author$project$Spa$Generated$Route$Editor = {$: 1};
var $author$project$Spa$Generated$Route$Editor__ArticleSlug_String = function (a) {
	return {$: 7, a: a};
};
var $author$project$Spa$Generated$Route$Login = {$: 2};
var $author$project$Spa$Generated$Route$Profile__Username_String = function (a) {
	return {$: 8, a: a};
};
var $author$project$Spa$Generated$Route$Register = {$: 4};
var $author$project$Spa$Generated$Route$Settings = {$: 5};
var $author$project$Spa$Generated$Route$Top = {$: 0};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.af;
		var unvisited = _v0.T;
		var params = _v0.fS;
		var frag = _v0.ab;
		var value = _v0.eQ;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.af;
			var unvisited = _v1.T;
			var params = _v1.fS;
			var frag = _v1.ab;
			var value = _v1.eQ;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.af;
		var unvisited = _v0.T;
		var params = _v0.fS;
		var frag = _v0.ab;
		var value = _v0.eQ;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_v0) {
			var visited = _v0.af;
			var unvisited = _v0.T;
			var params = _v0.fS;
			var frag = _v0.ab;
			var value = _v0.eQ;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _v2 = stringToSomething(next);
				if (!_v2.$) {
					var nextValue = _v2.a;
					return _List_fromArray(
						[
							A5(
							$elm$url$Url$Parser$State,
							A2($elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var $elm$url$Url$Parser$string = A2($elm$url$Url$Parser$custom, 'STRING', $elm$core$Maybe$Just);
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Spa$Generated$Route$routes = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Spa$Generated$Route$Top, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Editor,
			$elm$url$Url$Parser$s('editor')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Login,
			$elm$url$Url$Parser$s('login')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$NotFound,
			$elm$url$Url$Parser$s('not-found')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Register,
			$elm$url$Url$Parser$s('register')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Settings,
			$elm$url$Url$Parser$s('settings')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Article__Slug_String,
			A2(
				$elm$url$Url$Parser$map,
				function (slug) {
					return {Q: slug};
				},
				A2(
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$s('article'),
					$elm$url$Url$Parser$string))),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Editor__ArticleSlug_String,
			A2(
				$elm$url$Url$Parser$map,
				function (articleSlug) {
					return {cG: articleSlug};
				},
				A2(
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$s('editor'),
					$elm$url$Url$Parser$string))),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Spa$Generated$Route$Profile__Username_String,
			A2(
				$elm$url$Url$Parser$map,
				function (username) {
					return {cy: username};
				},
				A2(
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$s('profile'),
					$elm$url$Url$Parser$string)))
		]));
var $author$project$Spa$Generated$Route$fromUrl = $elm$url$Url$Parser$parse($author$project$Spa$Generated$Route$routes);
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Utils$Route$fromUrl = A2(
	$elm$core$Basics$composeR,
	$author$project$Spa$Generated$Route$fromUrl,
	$elm$core$Maybe$withDefault($author$project$Spa$Generated$Route$NotFound));
var $author$project$Shared$Model = F3(
	function (url, key, user) {
		return {fu: key, U: url, V: user};
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Api$User$User = F3(
	function (email, token, username) {
		return {aI: email, S: token, cy: username};
	});
var $author$project$Api$Token$Token = $elm$core$Basics$identity;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Api$Token$decoder = A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Api$User$decoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Api$User$User,
	A2($elm$json$Json$Decode$field, 'email', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'token', $author$project$Api$Token$decoder),
	A2($elm$json$Json$Decode$field, 'username', $elm$json$Json$Decode$string));
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Shared$init = F3(
	function (json, url, key) {
		var user = $elm$core$Result$toMaybe(
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, 'user', $author$project$Api$User$decoder),
				json));
		return _Utils_Tuple2(
			A3($author$project$Shared$Model, url, key, user),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Spa$Generated$Pages$Article__Slug_String__Model = function (a) {
	return {$: 6, a: a};
};
var $author$project$Spa$Generated$Pages$Article__Slug_String__Msg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Spa$Generated$Pages$Editor__ArticleSlug_String__Model = function (a) {
	return {$: 7, a: a};
};
var $author$project$Spa$Generated$Pages$Editor__ArticleSlug_String__Msg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Spa$Generated$Pages$Editor__Model = function (a) {
	return {$: 1, a: a};
};
var $author$project$Spa$Generated$Pages$Editor__Msg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Spa$Generated$Pages$Login__Model = function (a) {
	return {$: 2, a: a};
};
var $author$project$Spa$Generated$Pages$Login__Msg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Spa$Generated$Pages$NotFound__Model = function (a) {
	return {$: 3, a: a};
};
var $author$project$Spa$Generated$Pages$NotFound__Msg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Spa$Generated$Pages$Profile__Username_String__Model = function (a) {
	return {$: 8, a: a};
};
var $author$project$Spa$Generated$Pages$Profile__Username_String__Msg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Spa$Generated$Pages$Register__Model = function (a) {
	return {$: 4, a: a};
};
var $author$project$Spa$Generated$Pages$Register__Msg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Spa$Generated$Pages$Settings__Model = function (a) {
	return {$: 5, a: a};
};
var $author$project$Spa$Generated$Pages$Settings__Msg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Spa$Generated$Pages$Top__Model = function (a) {
	return {$: 0, a: a};
};
var $author$project$Spa$Generated$Pages$Top__Msg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Spa$Page$application = function (page) {
	return page;
};
var $author$project$Pages$Article$Slug_String$GotArticle = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Article$Slug_String$GotComments = function (a) {
	return {$: 8, a: a};
};
var $author$project$Api$Data$Loading = {$: 1};
var $author$project$Api$Article$Article = function (slug) {
	return function (title) {
		return function (description) {
			return function (body) {
				return function (tags) {
					return function (createdAt) {
						return function (updatedAt) {
							return function (favorited) {
								return function (favoritesCount) {
									return function (author) {
										return {e$: author, ak: body, e7: createdAt, cN: description, fg: favorited, fh: favoritesCount, Q: slug, eF: tags, dq: title, ge: updatedAt};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Api$Profile$Profile = F2(
	function (username, following) {
		return {fk: following, cy: username};
	});
var $author$project$Api$Profile$decoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Api$Profile$Profile,
	A2($elm$json$Json$Decode$field, 'username', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'following', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$parser$Parser$deadEndsToString = function (deadEnds) {
	return 'TODO deadEndsToString';
};
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {dA: col, e6: contextStack, ej: problem, es: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.es, s.dA, x, s.c));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.b) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{dA: col, c: s0.c, d: s0.d, b: offset, es: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.es, s.dA, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$core$Basics$round = _Basics_round;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$core$String$toFloat = _String_toFloat;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs = A2(
	$elm$parser$Parser$andThen,
	function (str) {
		if ($elm$core$String$length(str) <= 9) {
			var _v0 = $elm$core$String$toFloat('0.' + str);
			if (!_v0.$) {
				var floatVal = _v0.a;
				return $elm$parser$Parser$succeed(
					$elm$core$Basics$round(floatVal * 1000));
			} else {
				return $elm$parser$Parser$problem('Invalid float: \"' + (str + '\"'));
			}
		} else {
			return $elm$parser$Parser$problem(
				'Expected at most 9 digits, but got ' + $elm$core$String$fromInt(
					$elm$core$String$length(str)));
		}
	},
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile($elm$core$Char$isDigit)));
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts = F6(
	function (monthYearDayMs, hour, minute, second, ms, utcOffsetMinutes) {
		return $elm$time$Time$millisToPosix((((monthYearDayMs + (((hour * 60) * 60) * 1000)) + (((minute - utcOffsetMinutes) * 60) * 1000)) + (second * 1000)) + ms);
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$core$String$append = _String_append;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.b, s.a);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{dA: 1, c: s.c, d: s.d, b: s.b + 1, es: s.es + 1, a: s.a}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{dA: s.dA + 1, c: s.c, d: s.d, b: newOffset, es: s.es, a: s.a}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt = function (quantity) {
	var helper = function (str) {
		if (_Utils_eq(
			$elm$core$String$length(str),
			quantity)) {
			var _v0 = $elm$core$String$toInt(str);
			if (!_v0.$) {
				var intVal = _v0.a;
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$Done,
					$elm$parser$Parser$succeed(intVal));
			} else {
				return $elm$parser$Parser$problem('Invalid integer: \"' + (str + '\"'));
			}
		} else {
			return A2(
				$elm$parser$Parser$map,
				function (nextChar) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$String$append, str, nextChar));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
		}
	};
	return A2($elm$parser$Parser$loop, '', helper);
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.es, s.dA, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{dA: newCol, c: s.c, d: s.d, b: newOffset, es: newRow, a: s.a});
	};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear = 1970;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay = function (day) {
	return $elm$parser$Parser$problem(
		'Invalid day: ' + $elm$core$String$fromInt(day));
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear = function (year) {
	return (!A2($elm$core$Basics$modBy, 4, year)) && ((!(!A2($elm$core$Basics$modBy, 100, year))) || (!A2($elm$core$Basics$modBy, 400, year)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore = function (y1) {
	var y = y1 - 1;
	return (((y / 4) | 0) - ((y / 100) | 0)) + ((y / 400) | 0);
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay = 86400000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear = 31536000000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay = function (_v0) {
	var year = _v0.a;
	var month = _v0.b;
	var dayInMonth = _v0.c;
	if (dayInMonth < 0) {
		return $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth);
	} else {
		var succeedWith = function (extraMs) {
			var yearMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear * (year - $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear);
			var days = ((month < 3) || (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year))) ? (dayInMonth - 1) : dayInMonth;
			var dayMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay * (days + ($rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore(year) - $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore($rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear)));
			return $elm$parser$Parser$succeed((extraMs + yearMs) + dayMs);
		};
		switch (month) {
			case 1:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(0);
			case 2:
				return ((dayInMonth > 29) || ((dayInMonth === 29) && (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year)))) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(2678400000);
			case 3:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(5097600000);
			case 4:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(7776000000);
			case 5:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(10368000000);
			case 6:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(13046400000);
			case 7:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(15638400000);
			case 8:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(18316800000);
			case 9:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(20995200000);
			case 10:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(23587200000);
			case 11:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(26265600000);
			case 12:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(28857600000);
			default:
				return $elm$parser$Parser$problem(
					'Invalid month: \"' + ($elm$core$String$fromInt(month) + '\"'));
		}
	}
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs = A2(
	$elm$parser$Parser$andThen,
	$rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (year, month, day) {
							return _Utils_Tuple3(year, month, day);
						})),
				$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(4)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed($elm$core$Basics$identity),
							$elm$parser$Parser$symbol('-')),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
					]))),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$symbol('-')),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
				]))));
var $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes = function () {
	var utcOffsetMinutesFromParts = F3(
		function (multiplier, hours, minutes) {
			return (multiplier * (hours * 60)) + minutes;
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return 0;
					},
					$elm$parser$Parser$symbol('Z')),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(utcOffsetMinutesFromParts),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$map,
										function (_v1) {
											return 1;
										},
										$elm$parser$Parser$symbol('+')),
										A2(
										$elm$parser$Parser$map,
										function (_v2) {
											return -1;
										},
										$elm$parser$Parser$symbol('-'))
									]))),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed($elm$core$Basics$identity),
									$elm$parser$Parser$symbol(':')),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2),
								$elm$parser$Parser$succeed(0)
							]))),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(0),
					$elm$parser$Parser$end)
				])));
}();
var $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601 = A2(
	$elm$parser$Parser$andThen,
	function (datePart) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed(
											$rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts(datePart)),
										$elm$parser$Parser$symbol('T')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$elm$parser$Parser$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$keeper,
											A2(
												$elm$parser$Parser$ignorer,
												$elm$parser$Parser$succeed($elm$core$Basics$identity),
												$elm$parser$Parser$symbol(':')),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
										]))),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$keeper,
										A2(
											$elm$parser$Parser$ignorer,
											$elm$parser$Parser$succeed($elm$core$Basics$identity),
											$elm$parser$Parser$symbol(':')),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
									]))),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$symbol('.')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs),
									$elm$parser$Parser$succeed(0)
								]))),
					A2($elm$parser$Parser$ignorer, $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes, $elm$parser$Parser$end)),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A6($rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts, datePart, 0, 0, 0, 0, 0)),
					$elm$parser$Parser$end)
				]));
	},
	$rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {dA: col, ej: problem, es: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.es, p.dA, p.ej);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{dA: 1, c: _List_Nil, d: 1, b: 0, es: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime = function (str) {
	return A2($elm$parser$Parser$run, $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601, str);
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$decoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		var _v0 = $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime(str);
		if (_v0.$ === 1) {
			var deadEnds = _v0.a;
			return $elm$json$Json$Decode$fail(
				$elm$parser$Parser$deadEndsToString(deadEnds));
		} else {
			var time = _v0.a;
			return $elm$json$Json$Decode$succeed(time);
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Utils$Json$record = $elm$json$Json$Decode$succeed;
var $author$project$Utils$Json$apply = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $author$project$Utils$Json$withField = F2(
	function (str, decoder) {
		return $author$project$Utils$Json$apply(
			A2($elm$json$Json$Decode$field, str, decoder));
	});
var $author$project$Api$Article$decoder = A3(
	$author$project$Utils$Json$withField,
	'author',
	$author$project$Api$Profile$decoder,
	A3(
		$author$project$Utils$Json$withField,
		'favoritesCount',
		$elm$json$Json$Decode$int,
		A3(
			$author$project$Utils$Json$withField,
			'favorited',
			$elm$json$Json$Decode$bool,
			A3(
				$author$project$Utils$Json$withField,
				'updatedAt',
				$rtfeldman$elm_iso8601_date_strings$Iso8601$decoder,
				A3(
					$author$project$Utils$Json$withField,
					'createdAt',
					$rtfeldman$elm_iso8601_date_strings$Iso8601$decoder,
					A3(
						$author$project$Utils$Json$withField,
						'tagList',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
						A3(
							$author$project$Utils$Json$withField,
							'body',
							$elm$json$Json$Decode$string,
							A3(
								$author$project$Utils$Json$withField,
								'description',
								$elm$json$Json$Decode$string,
								A3(
									$author$project$Utils$Json$withField,
									'title',
									$elm$json$Json$Decode$string,
									A3(
										$author$project$Utils$Json$withField,
										'slug',
										$elm$json$Json$Decode$string,
										$author$project$Utils$Json$record($author$project$Api$Article$Article)))))))))));
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $author$project$Api$Data$errorDecoder = A2(
	$elm$json$Json$Decode$map,
	$elm$core$List$concatMap(
		function (_v0) {
			var key = _v0.a;
			var values = _v0.b;
			return A2(
				$elm$core$List$map,
				function (value) {
					return key + (' ' + value);
				},
				values);
		}),
	A2(
		$elm$json$Json$Decode$field,
		'errors',
		$elm$json$Json$Decode$keyValuePairs(
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string))));
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $author$project$Api$Data$Failure = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$Data$Success = function (a) {
	return {$: 3, a: a};
};
var $author$project$Api$Data$fromResult = function (result) {
	if (!result.$) {
		var value = result.a;
		return $author$project$Api$Data$Success(value);
	} else {
		var reasons = result.a;
		return $author$project$Api$Data$Failure(reasons);
	}
};
var $author$project$Api$Data$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			A2($elm$core$Basics$composeR, $author$project$Api$Data$fromResult, toMsg),
			function (response) {
				switch (response.$) {
					case 0:
						return $elm$core$Result$Err(
							_List_fromArray(
								['Bad URL']));
					case 1:
						return $elm$core$Result$Err(
							_List_fromArray(
								['Request timeout']));
					case 2:
						return $elm$core$Result$Err(
							_List_fromArray(
								['Connection issues']));
					case 3:
						var body = response.b;
						var _v1 = A2($elm$json$Json$Decode$decodeString, $author$project$Api$Data$errorDecoder, body);
						if (!_v1.$) {
							var errors = _v1.a;
							return $elm$core$Result$Err(errors);
						} else {
							return $elm$core$Result$Err(
								_List_fromArray(
									['Bad status code']));
						}
					default:
						var body = response.b;
						var _v2 = A2($elm$json$Json$Decode$decodeString, decoder, body);
						if (!_v2.$) {
							var value = _v2.a;
							return $elm$core$Result$Ok(value);
						} else {
							var err = _v2.a;
							return $elm$core$Result$Err(
								_List_fromArray(
									[
										$elm$json$Json$Decode$errorToString(err)
									]));
						}
				}
			});
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {ep: reqs, eD: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.gc;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.ep));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.eD)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					eY: r.eY,
					ak: r.ak,
					N: A2(_Http_mapExpect, func, r.N),
					fm: r.fm,
					fx: r.fx,
					f5: r.f5,
					gc: r.gc,
					U: r.U
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{eY: false, ak: r.ak, N: r.N, fm: r.fm, fx: r.fx, f5: r.f5, gc: r.gc, U: r.U}));
};
var $author$project$Api$Token$request = F4(
	function (method, body, maybeToken, options) {
		return $elm$http$Http$request(
			{
				ak: body,
				N: options.N,
				fm: function () {
					if (!maybeToken.$) {
						var token = maybeToken.a;
						return _List_fromArray(
							[
								A2($elm$http$Http$header, 'Authorization', 'Token ' + token)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				fx: method,
				f5: $elm$core$Maybe$Just(1000 * 60),
				gc: $elm$core$Maybe$Nothing,
				U: options.U
			});
	});
var $author$project$Api$Token$get = A2($author$project$Api$Token$request, 'GET', $elm$http$Http$emptyBody);
var $author$project$Api$Article$get = function (options) {
	return A2(
		$author$project$Api$Token$get,
		options.S,
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'article', $author$project$Api$Article$decoder)),
			U: 'https://conduit.productionready.io/api/articles/' + options.Q
		});
};
var $author$project$Api$Article$Comment$Comment = F5(
	function (id, createdAt, updatedAt, body, author) {
		return {e$: author, ak: body, e7: createdAt, fq: id, ge: updatedAt};
	});
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Api$Article$Comment$decoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Api$Article$Comment$Comment,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'createdAt', $rtfeldman$elm_iso8601_date_strings$Iso8601$decoder),
	A2($elm$json$Json$Decode$field, 'updatedAt', $rtfeldman$elm_iso8601_date_strings$Iso8601$decoder),
	A2($elm$json$Json$Decode$field, 'body', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'author', $author$project$Api$Profile$decoder));
var $author$project$Api$Article$Comment$get = function (options) {
	return A2(
		$author$project$Api$Token$get,
		options.S,
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2(
					$elm$json$Json$Decode$field,
					'comments',
					$elm$json$Json$Decode$list($author$project$Api$Article$Comment$decoder))),
			U: 'https://conduit.productionready.io/api/articles/' + (options.cG + '/comments')
		});
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Pages$Article$Slug_String$init = F2(
	function (shared, _v0) {
		var params = _v0.fS;
		return _Utils_Tuple2(
			{X: $author$project$Api$Data$Loading, Y: '', L: $author$project$Api$Data$Loading, fu: shared.fu, V: shared.V},
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Api$Article$get(
						{
							O: $author$project$Pages$Article$Slug_String$GotArticle,
							Q: params.Q,
							S: A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.S;
								},
								shared.V)
						}),
						$author$project$Api$Article$Comment$get(
						{
							cG: params.Q,
							O: $author$project$Pages$Article$Slug_String$GotComments,
							S: A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.S;
								},
								shared.V)
						})
					])));
	});
var $author$project$Pages$Article$Slug_String$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Article$Slug_String$save = F2(
	function (_v0, shared) {
		return shared;
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Pages$Article$Slug_String$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Article$Slug_String$CreatedComment = function (a) {
	return {$: 12, a: a};
};
var $author$project$Pages$Article$Slug_String$DeletedArticle = function (a) {
	return {$: 4, a: a};
};
var $author$project$Pages$Article$Slug_String$DeletedComment = function (a) {
	return {$: 10, a: a};
};
var $author$project$Pages$Article$Slug_String$GotAuthor = function (a) {
	return {$: 5, a: a};
};
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Api$Token$post = F2(
	function (token, options) {
		return A4($author$project$Api$Token$request, 'POST', options.ak, token, options);
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Api$Article$Comment$create = function (options) {
	var body = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'comment',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'body',
							$elm$json$Json$Encode$string(options.e4.ak))
						])))
			]));
	return A2(
		$author$project$Api$Token$post,
		$elm$core$Maybe$Just(options.S),
		{
			ak: $elm$http$Http$jsonBody(body),
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'comment', $author$project$Api$Article$Comment$decoder)),
			U: 'https://conduit.productionready.io/api/articles/' + (options.cG + '/comments')
		});
};
var $author$project$Api$Token$delete = A2($author$project$Api$Token$request, 'DELETE', $elm$http$Http$emptyBody);
var $author$project$Api$Article$delete = function (options) {
	return A2(
		$author$project$Api$Token$delete,
		$elm$core$Maybe$Just(options.S),
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'article', $author$project$Api$Article$decoder)),
			U: 'https://conduit.productionready.io/api/articles/' + options.Q
		});
};
var $author$project$Api$Article$Comment$delete = function (options) {
	return A2(
		$author$project$Api$Token$delete,
		$elm$core$Maybe$Just(options.S),
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				$elm$json$Json$Decode$succeed(options.dD)),
			U: 'https://conduit.productionready.io/api/articles/' + (options.cG + ('/comments/' + $elm$core$String$fromInt(options.dD)))
		});
};
var $author$project$Api$Article$favorite = function (options) {
	return A2(
		$author$project$Api$Token$post,
		$elm$core$Maybe$Just(options.S),
		{
			ak: $elm$http$Http$emptyBody,
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'article', $author$project$Api$Article$decoder)),
			U: 'https://conduit.productionready.io/api/articles/' + (options.Q + '/favorite')
		});
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Api$Profile$follow = function (options) {
	return A2(
		$author$project$Api$Token$post,
		$elm$core$Maybe$Just(options.S),
		{
			ak: $elm$http$Http$emptyBody,
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'profile', $author$project$Api$Profile$decoder)),
			U: 'https://conduit.productionready.io/api/profiles/' + (options.cy + '/follow')
		});
};
var $author$project$Api$Data$NotAsked = {$: 0};
var $author$project$Api$Data$map = F2(
	function (fn, data) {
		switch (data.$) {
			case 0:
				return $author$project$Api$Data$NotAsked;
			case 1:
				return $author$project$Api$Data$Loading;
			case 2:
				var reason = data.a;
				return $author$project$Api$Data$Failure(reason);
			default:
				var value = data.a;
				return $author$project$Api$Data$Success(
					fn(value));
		}
	});
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Spa$Generated$Route$toString = function (route) {
	var segments = function () {
		switch (route.$) {
			case 0:
				return _List_Nil;
			case 1:
				return _List_fromArray(
					['editor']);
			case 2:
				return _List_fromArray(
					['login']);
			case 3:
				return _List_fromArray(
					['not-found']);
			case 4:
				return _List_fromArray(
					['register']);
			case 5:
				return _List_fromArray(
					['settings']);
			case 6:
				var slug = route.a.Q;
				return _List_fromArray(
					['article', slug]);
			case 7:
				var articleSlug = route.a.cG;
				return _List_fromArray(
					['editor', articleSlug]);
			default:
				var username = route.a.cy;
				return _List_fromArray(
					['profile', username]);
		}
	}();
	return A2(
		$elm$core$String$append,
		'/',
		A2($elm$core$String$join, '/', segments));
};
var $author$project$Utils$Route$navigate = F2(
	function (key, route) {
		return A2(
			$elm$browser$Browser$Navigation$pushUrl,
			key,
			$author$project$Spa$Generated$Route$toString(route));
	});
var $author$project$Api$Article$unfavorite = function (options) {
	return A2(
		$author$project$Api$Token$delete,
		$elm$core$Maybe$Just(options.S),
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'article', $author$project$Api$Article$decoder)),
			U: 'https://conduit.productionready.io/api/articles/' + (options.Q + '/favorite')
		});
};
var $author$project$Api$Profile$unfollow = function (options) {
	return A2(
		$author$project$Api$Token$delete,
		$elm$core$Maybe$Just(options.S),
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'profile', $author$project$Api$Profile$decoder)),
			U: 'https://conduit.productionready.io/api/profiles/' + (options.cy + '/follow')
		});
};
var $author$project$Pages$Article$Slug_String$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var article = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{X: article}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$favorite(
						{O: $author$project$Pages$Article$Slug_String$GotArticle, Q: article.Q, S: user.S}));
			case 2:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$unfavorite(
						{O: $author$project$Pages$Article$Slug_String$GotArticle, Q: article.Q, S: user.S}));
			case 3:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$delete(
						{O: $author$project$Pages$Article$Slug_String$DeletedArticle, Q: article.Q, S: user.S}));
			case 4:
				return _Utils_Tuple2(
					model,
					A2($author$project$Utils$Route$navigate, model.fu, $author$project$Spa$Generated$Route$Top));
			case 5:
				var profile = msg.a;
				var updateAuthor = function (article) {
					if (profile.$ === 3) {
						var author = profile.a;
						return _Utils_update(
							article,
							{e$: author});
					} else {
						return article;
					}
				};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							X: A2($author$project$Api$Data$map, updateAuthor, model.X)
						}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var user = msg.a;
				var profile = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Profile$follow(
						{O: $author$project$Pages$Article$Slug_String$GotAuthor, S: user.S, cy: profile.cy}));
			case 7:
				var user = msg.a;
				var profile = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Profile$unfollow(
						{O: $author$project$Pages$Article$Slug_String$GotAuthor, S: user.S, cy: profile.cy}));
			case 8:
				var comments = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{L: comments}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var text = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Y: text}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var user = msg.a;
				var article = msg.b;
				return $elm$core$String$isEmpty(model.Y) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{Y: ''}),
					$author$project$Api$Article$Comment$create(
						{
							cG: article.Q,
							e4: {ak: model.Y},
							O: $author$project$Pages$Article$Slug_String$CreatedComment,
							S: user.S
						}));
			case 12:
				var comment = msg.a;
				return _Utils_Tuple2(
					function () {
						if (comment.$ === 3) {
							var c = comment.a;
							return _Utils_update(
								model,
								{
									L: A2(
										$author$project$Api$Data$map,
										function (comments) {
											return A2($elm$core$List$cons, c, comments);
										},
										model.L)
								});
						} else {
							return model;
						}
					}(),
					$elm$core$Platform$Cmd$none);
			case 9:
				var user = msg.a;
				var article = msg.b;
				var comment = msg.c;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$Comment$delete(
						{cG: article.Q, dD: comment.fq, O: $author$project$Pages$Article$Slug_String$DeletedComment, S: user.S}));
			default:
				var id = msg.a;
				var removeComment = $elm$core$List$filter(
					function (comment) {
						return !_Utils_eq(
							$author$project$Api$Data$Success(comment.fq),
							id);
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							L: A2($author$project$Api$Data$map, removeComment, model.L)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm_explorations$markdown$Markdown$defaultOptions = {
	dH: $elm$core$Maybe$Nothing,
	fl: $elm$core$Maybe$Just(
		{e0: false, f3: false}),
	fY: true,
	f$: false
};
var $elm_explorations$markdown$Markdown$toHtmlWith = _Markdown_toHtml;
var $elm_explorations$markdown$Markdown$toHtml = $elm_explorations$markdown$Markdown$toHtmlWith($elm_explorations$markdown$Markdown$defaultOptions);
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$a = _VirtualDom_node('a');
var $ryannhg$date_format$DateFormat$DayOfMonthNumber = {$: 5};
var $ryannhg$date_format$DateFormat$dayOfMonthNumber = $ryannhg$date_format$DateFormat$DayOfMonthNumber;
var $ryannhg$date_format$DateFormat$Language$Language = F6(
	function (toMonthName, toMonthAbbreviation, toWeekdayName, toWeekdayAbbreviation, toAmPm, toOrdinalSuffix) {
		return {f6: toAmPm, f7: toMonthAbbreviation, f8: toMonthName, ay: toOrdinalSuffix, ga: toWeekdayAbbreviation, gb: toWeekdayName};
	});
var $ryannhg$date_format$DateFormat$Language$toEnglishAmPm = function (hour) {
	return (hour > 11) ? 'pm' : 'am';
};
var $ryannhg$date_format$DateFormat$Language$toEnglishMonthName = function (month) {
	switch (month) {
		case 0:
			return 'January';
		case 1:
			return 'February';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		default:
			return 'December';
	}
};
var $ryannhg$date_format$DateFormat$Language$toEnglishSuffix = function (num) {
	var _v0 = A2($elm$core$Basics$modBy, 100, num);
	switch (_v0) {
		case 11:
			return 'th';
		case 12:
			return 'th';
		case 13:
			return 'th';
		default:
			var _v1 = A2($elm$core$Basics$modBy, 10, num);
			switch (_v1) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
	}
};
var $ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName = function (weekday) {
	switch (weekday) {
		case 0:
			return 'Monday';
		case 1:
			return 'Tuesday';
		case 2:
			return 'Wednesday';
		case 3:
			return 'Thursday';
		case 4:
			return 'Friday';
		case 5:
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $ryannhg$date_format$DateFormat$Language$english = A6(
	$ryannhg$date_format$DateFormat$Language$Language,
	$ryannhg$date_format$DateFormat$Language$toEnglishMonthName,
	A2(
		$elm$core$Basics$composeR,
		$ryannhg$date_format$DateFormat$Language$toEnglishMonthName,
		$elm$core$String$left(3)),
	$ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName,
	A2(
		$elm$core$Basics$composeR,
		$ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName,
		$elm$core$String$left(3)),
	$ryannhg$date_format$DateFormat$Language$toEnglishAmPm,
	$ryannhg$date_format$DateFormat$Language$toEnglishSuffix);
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.dj, posixMinutes) < 0) {
					return posixMinutes + era.b;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $ryannhg$date_format$DateFormat$amPm = F3(
	function (language, zone, posix) {
		return language.f6(
			A2($elm$time$Time$toHour, zone, posix));
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		dF: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		d5: month,
		eV: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).dF;
	});
var $ryannhg$date_format$DateFormat$dayOfMonth = $elm$time$Time$toDay;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $ryannhg$date_format$DateFormat$days = _List_fromArray(
	[6, 0, 1, 2, 3, 4, 5]);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return 3;
			case 1:
				return 4;
			case 2:
				return 5;
			case 3:
				return 6;
			case 4:
				return 0;
			case 5:
				return 1;
			default:
				return 2;
		}
	});
var $ryannhg$date_format$DateFormat$dayOfWeek = F2(
	function (zone, posix) {
		return function (_v1) {
			var i = _v1.a;
			return i;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, 6),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var day = _v0.b;
							return _Utils_eq(
								day,
								A2($elm$time$Time$toWeekday, zone, posix));
						},
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, day) {
									return _Utils_Tuple2(i, day);
								}),
							$ryannhg$date_format$DateFormat$days)))));
	});
var $ryannhg$date_format$DateFormat$isLeapYear = function (year_) {
	return (!(!A2($elm$core$Basics$modBy, 4, year_))) ? false : ((!(!A2($elm$core$Basics$modBy, 100, year_))) ? true : ((!(!A2($elm$core$Basics$modBy, 400, year_))) ? false : true));
};
var $ryannhg$date_format$DateFormat$daysInMonth = F2(
	function (year_, month) {
		switch (month) {
			case 0:
				return 31;
			case 1:
				return $ryannhg$date_format$DateFormat$isLeapYear(year_) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $ryannhg$date_format$DateFormat$months = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).d5;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $ryannhg$date_format$DateFormat$monthPair = F2(
	function (zone, posix) {
		return A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var i = _v0.a;
						var m = _v0.b;
						return _Utils_eq(
							m,
							A2($elm$time$Time$toMonth, zone, posix));
					},
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (a, b) {
								return _Utils_Tuple2(a, b);
							}),
						$ryannhg$date_format$DateFormat$months))));
	});
var $ryannhg$date_format$DateFormat$monthNumber_ = F2(
	function (zone, posix) {
		return 1 + function (_v0) {
			var i = _v0.a;
			var m = _v0.b;
			return i;
		}(
			A2($ryannhg$date_format$DateFormat$monthPair, zone, posix));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).eV;
	});
var $ryannhg$date_format$DateFormat$dayOfYear = F2(
	function (zone, posix) {
		var monthsBeforeThisOne = A2(
			$elm$core$List$take,
			A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix) - 1,
			$ryannhg$date_format$DateFormat$months);
		var daysBeforeThisMonth = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				$ryannhg$date_format$DateFormat$daysInMonth(
					A2($elm$time$Time$toYear, zone, posix)),
				monthsBeforeThisOne));
		return daysBeforeThisMonth + A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix);
	});
var $ryannhg$date_format$DateFormat$quarter = F2(
	function (zone, posix) {
		return (A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix) / 4) | 0;
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $ryannhg$date_format$DateFormat$toFixedLength = F2(
	function (totalChars, num) {
		var numStr = $elm$core$String$fromInt(num);
		var numZerosNeeded = totalChars - $elm$core$String$length(numStr);
		var zeros = A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				function (_v0) {
					return '0';
				},
				A2($elm$core$List$range, 1, numZerosNeeded)));
		return _Utils_ap(zeros, numStr);
	});
var $elm$core$String$toLower = _String_toLower;
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $ryannhg$date_format$DateFormat$toNonMilitary = function (num) {
	return (!num) ? 12 : ((num <= 12) ? num : (num - 12));
};
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$core$String$toUpper = _String_toUpper;
var $ryannhg$date_format$DateFormat$millisecondsPerYear = $elm$core$Basics$round((((1000 * 60) * 60) * 24) * 365.25);
var $ryannhg$date_format$DateFormat$firstDayOfYear = F2(
	function (zone, time) {
		return $elm$time$Time$millisToPosix(
			$ryannhg$date_format$DateFormat$millisecondsPerYear * A2($elm$time$Time$toYear, zone, time));
	});
var $ryannhg$date_format$DateFormat$weekOfYear = F2(
	function (zone, posix) {
		var firstDay = A2($ryannhg$date_format$DateFormat$firstDayOfYear, zone, posix);
		var firstDayOffset = A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, firstDay);
		var daysSoFar = A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix);
		return (((daysSoFar + firstDayOffset) / 7) | 0) + 1;
	});
var $ryannhg$date_format$DateFormat$year = F2(
	function (zone, time) {
		return $elm$core$String$fromInt(
			A2($elm$time$Time$toYear, zone, time));
	});
var $ryannhg$date_format$DateFormat$piece = F4(
	function (language, zone, posix, token) {
		switch (token.$) {
			case 0:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 1:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.ay(num));
				}(
					A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 2:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 3:
				return language.f7(
					A2($elm$time$Time$toMonth, zone, posix));
			case 4:
				return language.f8(
					A2($elm$time$Time$toMonth, zone, posix));
			case 17:
				return $elm$core$String$fromInt(
					1 + A2($ryannhg$date_format$DateFormat$quarter, zone, posix));
			case 18:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.ay(num));
				}(
					1 + A2($ryannhg$date_format$DateFormat$quarter, zone, posix));
			case 5:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 6:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.ay(num));
				}(
					A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 7:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 8:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 9:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.ay(num));
				}(
					A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 10:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					3,
					A2($ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 11:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
			case 12:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.ay(num));
				}(
					A2($ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
			case 13:
				return language.ga(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 14:
				return language.gb(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 19:
				return $elm$core$String$fromInt(
					A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 20:
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.ay(num));
				}(
					A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 21:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 15:
				return A2(
					$elm$core$String$right,
					2,
					A2($ryannhg$date_format$DateFormat$year, zone, posix));
			case 16:
				return A2($ryannhg$date_format$DateFormat$year, zone, posix);
			case 22:
				return $elm$core$String$toUpper(
					A3($ryannhg$date_format$DateFormat$amPm, language, zone, posix));
			case 23:
				return $elm$core$String$toLower(
					A3($ryannhg$date_format$DateFormat$amPm, language, zone, posix));
			case 24:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toHour, zone, posix));
			case 25:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toHour, zone, posix));
			case 26:
				return $elm$core$String$fromInt(
					$ryannhg$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 27:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					$ryannhg$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 28:
				return $elm$core$String$fromInt(
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 29:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 30:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMinute, zone, posix));
			case 31:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toMinute, zone, posix));
			case 32:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toSecond, zone, posix));
			case 33:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toSecond, zone, posix));
			case 34:
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMillis, zone, posix));
			case 35:
				return A2(
					$ryannhg$date_format$DateFormat$toFixedLength,
					3,
					A2($elm$time$Time$toMillis, zone, posix));
			default:
				var string = token.a;
				return string;
		}
	});
var $ryannhg$date_format$DateFormat$formatWithLanguage = F4(
	function (language, tokens, zone, time) {
		return A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				A3($ryannhg$date_format$DateFormat$piece, language, zone, time),
				tokens));
	});
var $ryannhg$date_format$DateFormat$format = $ryannhg$date_format$DateFormat$formatWithLanguage($ryannhg$date_format$DateFormat$Language$english);
var $ryannhg$date_format$DateFormat$MonthNameFull = {$: 4};
var $ryannhg$date_format$DateFormat$monthNameFull = $ryannhg$date_format$DateFormat$MonthNameFull;
var $ryannhg$date_format$DateFormat$Text = function (a) {
	return {$: 36, a: a};
};
var $ryannhg$date_format$DateFormat$text = $ryannhg$date_format$DateFormat$Text;
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $ryannhg$date_format$DateFormat$YearNumber = {$: 16};
var $ryannhg$date_format$DateFormat$yearNumber = $ryannhg$date_format$DateFormat$YearNumber;
var $author$project$Utils$Time$formatDate = A2(
	$ryannhg$date_format$DateFormat$format,
	_List_fromArray(
		[
			$ryannhg$date_format$DateFormat$monthNameFull,
			$ryannhg$date_format$DateFormat$text(' '),
			$ryannhg$date_format$DateFormat$dayOfMonthNumber,
			$ryannhg$date_format$DateFormat$text(', '),
			$ryannhg$date_format$DateFormat$yearNumber
		]),
	$elm$time$Time$utc);
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Pages$Article$Slug_String$ClickedDeleteArticle = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Pages$Article$Slug_String$ClickedFavorite = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Pages$Article$Slug_String$ClickedFollow = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Pages$Article$Slug_String$ClickedUnfavorite = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Pages$Article$Slug_String$ClickedUnfollow = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Components$IconButton$FilledGray = 3;
var $author$project$Components$IconButton$FilledGreen = 4;
var $author$project$Components$IconButton$Heart = 1;
var $author$project$Components$IconButton$OutlinedGray = 0;
var $author$project$Components$IconButton$OutlinedGreen = 1;
var $author$project$Components$IconButton$OutlinedRed = 2;
var $author$project$Components$IconButton$Plus = 0;
var $author$project$Components$IconButton$Trash = 2;
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Components$IconButton$view = function (options) {
	var toIconClass = function (icon) {
		switch (icon) {
			case 0:
				return 'ion-plus-round';
			case 1:
				return 'ion-heart';
			default:
				return 'ion-trash-a';
		}
	};
	var toButtonClass = function (color) {
		switch (color) {
			case 1:
				return 'btn-outline-primary';
			case 0:
				return 'btn-outline-secondary';
			case 2:
				return 'btn-outline-danger';
			case 4:
				return 'btn-primary';
			default:
				return 'btn-secondary';
		}
	};
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Events$onClick(options.eb),
				$elm$html$Html$Attributes$class(
				'btn btn-sm ' + toButtonClass(options.dB))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$i,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						toIconClass(options.dV))
					]),
				_List_Nil),
				$elm$html$Html$text(options.d1)
			]));
};
var $author$project$Pages$Article$Slug_String$viewControls = F2(
	function (article, user) {
		return _Utils_eq(article.e$.cy, user.cy) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('btn btn-outline-secondary btn-sm'),
						$elm$html$Html$Attributes$href('/editor/' + article.Q)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ion-edit')
							]),
						_List_Nil),
						$elm$html$Html$text('Edit article')
					])),
				$author$project$Components$IconButton$view(
				{
					dB: 2,
					dV: 2,
					d1: 'Delete article',
					eb: A2($author$project$Pages$Article$Slug_String$ClickedDeleteArticle, user, article)
				})
			]) : _List_fromArray(
			[
				article.e$.fk ? $author$project$Components$IconButton$view(
				{
					dB: 3,
					dV: 0,
					d1: 'Unfollow ' + article.e$.cy,
					eb: A2($author$project$Pages$Article$Slug_String$ClickedUnfollow, user, article.e$)
				}) : $author$project$Components$IconButton$view(
				{
					dB: 0,
					dV: 0,
					d1: 'Follow ' + article.e$.cy,
					eb: A2($author$project$Pages$Article$Slug_String$ClickedFollow, user, article.e$)
				}),
				article.fg ? $author$project$Components$IconButton$view(
				{
					dB: 4,
					dV: 1,
					d1: 'Unfavorite Post (' + ($elm$core$String$fromInt(article.fh) + ')'),
					eb: A2($author$project$Pages$Article$Slug_String$ClickedUnfavorite, user, article)
				}) : $author$project$Components$IconButton$view(
				{
					dB: 1,
					dV: 1,
					d1: 'Favorite Post (' + ($elm$core$String$fromInt(article.fh) + ')'),
					eb: A2($author$project$Pages$Article$Slug_String$ClickedFavorite, user, article)
				})
			]);
	});
var $author$project$Pages$Article$Slug_String$viewArticleMeta = F2(
	function (model, article) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('article-meta')
				]),
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('/profile/' + article.e$.cy)
								]),
							_List_fromArray(
								[
									A2($elm$html$Html$img, _List_Nil, _List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('info')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('author'),
											$elm$html$Html$Attributes$href('/profile/' + article.e$.cy)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(article.e$.cy)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('date')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Utils$Time$formatDate(article.e7))
										]))
								]))
						]),
						function () {
						var _v0 = model.V;
						if (!_v0.$) {
							var user = _v0.a;
							return A2($author$project$Pages$Article$Slug_String$viewControls, article, user);
						} else {
							return _List_Nil;
						}
					}()
					])));
	});
var $author$project$Pages$Article$Slug_String$ClickedDeleteComment = F3(
	function (a, b, c) {
		return {$: 9, a: a, b: b, c: c};
	});
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Utils$Maybe$view = F2(
	function (maybe, toView) {
		if (!maybe.$) {
			var value = maybe.a;
			return toView(value);
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Pages$Article$Slug_String$viewComment = F3(
	function (currentUser, article, comment) {
		var viewCommentActions = A2(
			$author$project$Utils$Maybe$view,
			currentUser,
			function (user) {
				return _Utils_eq(user.cy, comment.e$.cy) ? A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mod-options'),
							$elm$html$Html$Events$onClick(
							A3($author$project$Pages$Article$Slug_String$ClickedDeleteComment, user, article, comment))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ion-trash-a')
								]),
							_List_Nil)
						])) : $elm$html$Html$text('');
			});
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-block')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(comment.ak)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-footer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('comment-author'),
									$elm$html$Html$Attributes$href('/profile/' + comment.e$.cy)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(comment.e$.cy)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('date-posted')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$author$project$Utils$Time$formatDate(comment.e7))
								])),
							viewCommentActions
						]))
				]));
	});
var $author$project$Pages$Article$Slug_String$SubmittedCommentForm = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$Pages$Article$Slug_String$UpdatedCommentText = function (a) {
	return {$: 13, a: a};
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$html$Html$Events$onSubmit = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'submit',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Pages$Article$Slug_String$viewCommentForm = F3(
	function (model, user, article) {
		return A2(
			$elm$html$Html$form,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card comment-form'),
					$elm$html$Html$Events$onSubmit(
					A2($author$project$Pages$Article$Slug_String$SubmittedCommentForm, user, article))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-block')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$textarea,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-control'),
									$elm$html$Html$Attributes$placeholder('Write a comment...'),
									A2($elm$html$Html$Attributes$attribute, 'rows', '3'),
									$elm$html$Html$Attributes$value(model.Y),
									$elm$html$Html$Events$onInput($author$project$Pages$Article$Slug_String$UpdatedCommentText)
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-footer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-sm btn-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Post Comment')
								]))
						]))
				]));
	});
var $author$project$Pages$Article$Slug_String$viewCommentSection = F2(
	function (model, article) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col-xs-12 col-md-8 offset-md-2')
						]),
					$elm$core$List$concat(
						_List_fromArray(
							[
								function () {
								var _v0 = model.V;
								if (!_v0.$) {
									var user = _v0.a;
									return _List_fromArray(
										[
											A3($author$project$Pages$Article$Slug_String$viewCommentForm, model, user, article)
										]);
								} else {
									return _List_Nil;
								}
							}(),
								function () {
								var _v1 = model.L;
								if (_v1.$ === 3) {
									var comments = _v1.a;
									return A2(
										$elm$core$List$map,
										A2($author$project$Pages$Article$Slug_String$viewComment, model.V, article),
										comments);
								} else {
									return _List_Nil;
								}
							}()
							])))
				]));
	});
var $author$project$Pages$Article$Slug_String$viewArticle = F2(
	function (model, article) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('article-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('banner')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(article.dq)
										])),
									A2($author$project$Pages$Article$Slug_String$viewArticleMeta, model, article)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container page')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row article-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-md-12')
										]),
									_List_fromArray(
										[
											A2($elm_explorations$markdown$Markdown$toHtml, _List_Nil, article.ak)
										])),
									$elm$core$List$isEmpty(article.eF) ? $elm$html$Html$text('') : A2(
									$elm$html$Html$ul,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('tag-list')
										]),
									A2(
										$elm$core$List$map,
										function (tag) {
											return A2(
												$elm$html$Html$li,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('tag-default tag-pill tag-outline')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(tag)
													]));
										},
										article.eF))
								])),
							A2($elm$html$Html$hr, _List_Nil, _List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('article-actions')
								]),
							_List_fromArray(
								[
									A2($author$project$Pages$Article$Slug_String$viewArticleMeta, model, article)
								])),
							A2($author$project$Pages$Article$Slug_String$viewCommentSection, model, article)
						]))
				]));
	});
var $author$project$Pages$Article$Slug_String$view = function (model) {
	var _v0 = model.X;
	if (_v0.$ === 3) {
		var article = _v0.a;
		return {
			ak: _List_fromArray(
				[
					A2($author$project$Pages$Article$Slug_String$viewArticle, model, article)
				]),
			dq: article.dq
		};
	} else {
		return {ak: _List_Nil, dq: 'Article'};
	}
};
var $author$project$Pages$Article$Slug_String$page = $author$project$Spa$Page$application(
	{fs: $author$project$Pages$Article$Slug_String$init, fw: $author$project$Pages$Article$Slug_String$load, fZ: $author$project$Pages$Article$Slug_String$save, f2: $author$project$Pages$Article$Slug_String$subscriptions, gd: $author$project$Pages$Article$Slug_String$update, gf: $author$project$Pages$Article$Slug_String$view});
var $author$project$Pages$Editor$init = F2(
	function (shared, _v0) {
		return _Utils_Tuple2(
			{
				X: $author$project$Api$Data$NotAsked,
				bw: {ak: '', cN: '', eF: '', dq: ''},
				fu: shared.fu,
				V: shared.V
			},
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Editor$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $author$project$Utils$Auth$protected = F2(
	function (view, model) {
		var _v0 = model.V;
		if (!_v0.$) {
			var user = _v0.a;
			return A2(view, user, model);
		} else {
			return {
				ak: _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('container page')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Not signed in.')
									])),
								A2(
								$elm$html$Html$h5,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Please '),
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href('/login')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('sign in')
											])),
										$elm$html$Html$text(' to view this page.')
									]))
							]))
					]),
				dq: '401'
			};
		}
	});
var $author$project$Pages$Editor$save = F2(
	function (_v0, shared) {
		return shared;
	});
var $author$project$Pages$Editor$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Editor$GotArticle = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Api$Article$create = function (options) {
	var body = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'article',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'title',
							$elm$json$Json$Encode$string(options.X.dq)),
							_Utils_Tuple2(
							'description',
							$elm$json$Json$Encode$string(options.X.cN)),
							_Utils_Tuple2(
							'body',
							$elm$json$Json$Encode$string(options.X.ak)),
							_Utils_Tuple2(
							'tagList',
							A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, options.X.eF))
						])))
			]));
	return A2(
		$author$project$Api$Token$post,
		$elm$core$Maybe$Just(options.S),
		{
			ak: $elm$http$Http$jsonBody(body),
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'article', $author$project$Api$Article$decoder)),
			U: 'https://conduit.productionready.io/api/articles'
		});
};
var $elm$core$String$trim = _String_trim;
var $author$project$Components$Editor$updateField = F3(
	function (field, value, form) {
		switch (field) {
			case 0:
				return _Utils_update(
					form,
					{dq: value});
			case 1:
				return _Utils_update(
					form,
					{cN: value});
			case 2:
				return _Utils_update(
					form,
					{ak: value});
			default:
				return _Utils_update(
					form,
					{eF: value});
		}
	});
var $author$project$Pages$Editor$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 1:
				var field = msg.a;
				var value = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bw: A3($author$project$Components$Editor$updateField, field, value, model.bw)
						}),
					$elm$core$Platform$Cmd$none);
			case 0:
				var user = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$create(
						{
							X: {
								ak: model.bw.ak,
								cN: model.bw.cN,
								eF: A2(
									$elm$core$List$map,
									$elm$core$String$trim,
									A2($elm$core$String$split, ',', model.bw.eF)),
								dq: model.bw.dq
							},
							O: $author$project$Pages$Editor$GotArticle,
							S: user.S
						}));
			default:
				var article = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{X: article}),
					function () {
						if (article.$ === 3) {
							var newArticle = article.a;
							return A2(
								$author$project$Utils$Route$navigate,
								model.fu,
								$author$project$Spa$Generated$Route$Article__Slug_String(
									{Q: newArticle.Q}));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}());
		}
	});
var $author$project$Pages$Editor$SubmittedForm = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Editor$Updated = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Components$Editor$Body = 2;
var $author$project$Components$Editor$Description = 1;
var $author$project$Components$Editor$Tags = 3;
var $author$project$Components$Editor$Title = 0;
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Components$Editor$view = function (options) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('editor-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container page')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-6 offset-md-3 col-xs-12')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h1,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-xs-center')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(options.dq)
											])),
										A2($elm$html$Html$br, _List_Nil, _List_Nil),
										A2(
										$elm$html$Html$form,
										_List_fromArray(
											[
												$elm$html$Html$Events$onSubmit(options.fJ)
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$fieldset,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$fieldset,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$input,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('form-control form-control-lg'),
																		$elm$html$Html$Attributes$placeholder('Article Title'),
																		$elm$html$Html$Attributes$type_('text'),
																		$elm$html$Html$Attributes$value(options.bw.dq),
																		$elm$html$Html$Events$onInput(
																		options.b_(0))
																	]),
																_List_Nil)
															])),
														A2(
														$elm$html$Html$fieldset,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$input,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('form-control'),
																		$elm$html$Html$Attributes$placeholder('What\'s this article about?'),
																		$elm$html$Html$Attributes$type_('text'),
																		$elm$html$Html$Attributes$value(options.bw.cN),
																		$elm$html$Html$Events$onInput(
																		options.b_(1))
																	]),
																_List_Nil)
															])),
														A2(
														$elm$html$Html$fieldset,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$textarea,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('form-control'),
																		$elm$html$Html$Attributes$placeholder('Write your article (in markdown)'),
																		A2($elm$html$Html$Attributes$attribute, 'rows', '8'),
																		$elm$html$Html$Attributes$value(options.bw.ak),
																		$elm$html$Html$Events$onInput(
																		options.b_(2))
																	]),
																_List_Nil)
															])),
														A2(
														$elm$html$Html$fieldset,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$input,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('form-control'),
																		$elm$html$Html$Attributes$placeholder('Enter tags (separated by commas)'),
																		$elm$html$Html$Attributes$type_('text'),
																		$elm$html$Html$Attributes$value(options.bw.eF),
																		$elm$html$Html$Events$onInput(
																		options.b_(3))
																	]),
																_List_Nil),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('tag-list')
																	]),
																_List_Nil)
															])),
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('btn btn-lg pull-xs-right btn-primary')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(options.e1)
															]))
													])),
												function () {
												var _v0 = options.X;
												if (_v0.$ === 2) {
													var reasons = _v0.a;
													return A2(
														$elm$html$Html$ul,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('error-messages')
															]),
														A2(
															$elm$core$List$map,
															function (message) {
																return A2(
																	$elm$html$Html$li,
																	_List_Nil,
																	_List_fromArray(
																		[
																			$elm$html$Html$text(message)
																		]));
															},
															reasons));
												} else {
													return $elm$html$Html$text('');
												}
											}()
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Editor$view = F2(
	function (user, model) {
		return {
			ak: _List_fromArray(
				[
					$author$project$Components$Editor$view(
					{
						X: model.X,
						e1: 'Publish',
						bw: model.bw,
						fJ: $author$project$Pages$Editor$SubmittedForm(user),
						b_: $author$project$Pages$Editor$Updated,
						dq: 'New Article'
					})
				]),
			dq: 'New Article'
		};
	});
var $author$project$Pages$Editor$page = $author$project$Spa$Page$application(
	{
		fs: $author$project$Pages$Editor$init,
		fw: $author$project$Pages$Editor$load,
		fZ: $author$project$Pages$Editor$save,
		f2: $author$project$Pages$Editor$subscriptions,
		gd: $author$project$Pages$Editor$update,
		gf: $author$project$Utils$Auth$protected($author$project$Pages$Editor$view)
	});
var $author$project$Pages$Editor$ArticleSlug_String$LoadedInitialArticle = function (a) {
	return {$: 3, a: a};
};
var $author$project$Pages$Editor$ArticleSlug_String$init = F2(
	function (shared, _v0) {
		var params = _v0.fS;
		return _Utils_Tuple2(
			{X: $author$project$Api$Data$Loading, bw: $elm$core$Maybe$Nothing, fu: shared.fu, Q: params.cG, V: shared.V},
			$author$project$Api$Article$get(
				{
					O: $author$project$Pages$Editor$ArticleSlug_String$LoadedInitialArticle,
					Q: params.cG,
					S: A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.S;
						},
						shared.V)
				}));
	});
var $author$project$Pages$Editor$ArticleSlug_String$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Editor$ArticleSlug_String$save = F2(
	function (_v0, shared) {
		return shared;
	});
var $author$project$Pages$Editor$ArticleSlug_String$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Editor$ArticleSlug_String$UpdatedArticle = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$Token$put = F2(
	function (token, options) {
		return A4($author$project$Api$Token$request, 'PUT', options.ak, token, options);
	});
var $author$project$Api$Article$update = function (options) {
	var body = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'article',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'title',
							$elm$json$Json$Encode$string(options.X.dq)),
							_Utils_Tuple2(
							'description',
							$elm$json$Json$Encode$string(options.X.cN)),
							_Utils_Tuple2(
							'body',
							$elm$json$Json$Encode$string(options.X.ak))
						])))
			]));
	return A2(
		$author$project$Api$Token$put,
		$elm$core$Maybe$Just(options.S),
		{
			ak: $elm$http$Http$jsonBody(body),
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'article', $author$project$Api$Article$decoder)),
			U: 'https://conduit.productionready.io/api/articles/' + options.Q
		});
};
var $author$project$Pages$Editor$ArticleSlug_String$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 3:
				var article = msg.a;
				if (article.$ === 3) {
					var a = article.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bw: $elm$core$Maybe$Just(
									{
										ak: a.ak,
										cN: a.cN,
										eF: A2($elm$core$String$join, ', ', a.eF),
										dq: a.dq
									})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 1:
				var field = msg.a;
				var value = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bw: A2(
								$elm$core$Maybe$map,
								A2($author$project$Components$Editor$updateField, field, value),
								model.bw)
						}),
					$elm$core$Platform$Cmd$none);
			case 0:
				var user = msg.a;
				var form = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$update(
						{
							X: {
								ak: form.ak,
								cN: form.cN,
								eF: A2(
									$elm$core$List$map,
									$elm$core$String$trim,
									A2($elm$core$String$split, ',', form.eF)),
								dq: form.dq
							},
							O: $author$project$Pages$Editor$ArticleSlug_String$UpdatedArticle,
							Q: model.Q,
							S: user.S
						}));
			default:
				var article = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{X: article}),
					function () {
						if (article.$ === 3) {
							var newArticle = article.a;
							return A2(
								$author$project$Utils$Route$navigate,
								model.fu,
								$author$project$Spa$Generated$Route$Article__Slug_String(
									{Q: newArticle.Q}));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}());
		}
	});
var $author$project$Pages$Editor$ArticleSlug_String$SubmittedForm = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Pages$Editor$ArticleSlug_String$Updated = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Pages$Editor$ArticleSlug_String$view = F2(
	function (user, model) {
		return {
			ak: function () {
				var _v0 = model.bw;
				if (!_v0.$) {
					var form = _v0.a;
					return _List_fromArray(
						[
							$author$project$Components$Editor$view(
							{
								X: model.X,
								e1: 'Save',
								bw: form,
								fJ: A2($author$project$Pages$Editor$ArticleSlug_String$SubmittedForm, user, form),
								b_: $author$project$Pages$Editor$ArticleSlug_String$Updated,
								dq: 'Edit Article'
							})
						]);
				} else {
					return _List_Nil;
				}
			}(),
			dq: 'Editing Article'
		};
	});
var $author$project$Pages$Editor$ArticleSlug_String$page = $author$project$Spa$Page$application(
	{
		fs: $author$project$Pages$Editor$ArticleSlug_String$init,
		fw: $author$project$Pages$Editor$ArticleSlug_String$load,
		fZ: $author$project$Pages$Editor$ArticleSlug_String$save,
		f2: $author$project$Pages$Editor$ArticleSlug_String$subscriptions,
		gd: $author$project$Pages$Editor$ArticleSlug_String$update,
		gf: $author$project$Utils$Auth$protected($author$project$Pages$Editor$ArticleSlug_String$view)
	});
var $author$project$Pages$Login$Model = F4(
	function (user, key, email, password) {
		return {aI: email, fu: key, c4: password, V: user};
	});
var $author$project$Pages$Login$init = F2(
	function (shared, _v0) {
		var key = _v0.fu;
		return _Utils_Tuple2(
			A4(
				$author$project$Pages$Login$Model,
				function () {
					var _v1 = shared.V;
					if (!_v1.$) {
						var user = _v1.a;
						return $author$project$Api$Data$Success(user);
					} else {
						return $author$project$Api$Data$NotAsked;
					}
				}(),
				key,
				'',
				''),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Login$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Api$Data$toMaybe = function (data) {
	if (data.$ === 3) {
		var value = data.a;
		return $elm$core$Maybe$Just(value);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Pages$Login$save = F2(
	function (model, shared) {
		return _Utils_update(
			shared,
			{
				V: function () {
					var _v0 = $author$project$Api$Data$toMaybe(model.V);
					if (!_v0.$) {
						var user = _v0.a;
						return $elm$core$Maybe$Just(user);
					} else {
						return shared.V;
					}
				}()
			});
	});
var $author$project$Pages$Login$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Login$GotUser = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$User$loginUrl = '/auth';
var $elm$http$Http$multipartBody = function (parts) {
	return A2(
		_Http_pair,
		'',
		_Http_toFormData(parts));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{ak: r.ak, N: r.N, fm: _List_Nil, fx: 'POST', f5: $elm$core$Maybe$Nothing, gc: $elm$core$Maybe$Nothing, U: r.U});
};
var $elm$http$Http$stringPart = _Http_pair;
var $author$project$Api$User$authentication = function (options) {
	var body = $elm$http$Http$multipartBody(
		_List_fromArray(
			[
				A2($elm$http$Http$stringPart, 'username', options.V.aI),
				A2($elm$http$Http$stringPart, 'password', options.V.c4)
			]));
	return $elm$http$Http$post(
		{
			ak: body,
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'user', $author$project$Api$User$decoder)),
			U: $author$project$Api$User$loginUrl
		});
};
var $author$project$Api$Token$encode = function (_v0) {
	var token = _v0;
	return $elm$json$Json$Encode$string(token);
};
var $author$project$Api$User$encode = function (user) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'username',
				$elm$json$Json$Encode$string(user.cy)),
				_Utils_Tuple2(
				'email',
				$elm$json$Json$Encode$string(user.aI)),
				_Utils_Tuple2(
				'token',
				$author$project$Api$Token$encode(user.S))
			]));
};
var $author$project$Ports$outgoing = _Platform_outgoingPort(
	'outgoing',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'data',
					$elm$core$Basics$identity($.cL)),
					_Utils_Tuple2(
					'tag',
					$elm$json$Json$Encode$string($.$7))
				]));
	});
var $author$project$Ports$saveUser = function (user) {
	return $author$project$Ports$outgoing(
		{
			cL: $author$project$Api$User$encode(user),
			$7: 'saveUser'
		});
};
var $author$project$Pages$Login$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				if (!msg.a) {
					var _v1 = msg.a;
					var email = msg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aI: email}),
						$elm$core$Platform$Cmd$none);
				} else {
					var _v2 = msg.a;
					var password = msg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{c4: password}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				return _Utils_Tuple2(
					model,
					$author$project$Api$User$authentication(
						{
							O: $author$project$Pages$Login$GotUser,
							V: {aI: model.aI, c4: model.c4}
						}));
			default:
				var user = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: user}),
					function () {
						var _v3 = $author$project$Api$Data$toMaybe(user);
						if (!_v3.$) {
							var user_ = _v3.a;
							return $elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Ports$saveUser(user_),
										A2($author$project$Utils$Route$navigate, model.fu, $author$project$Spa$Generated$Route$Top)
									]));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}());
		}
	});
var $author$project$Pages$Login$AttemptedSignIn = {$: 1};
var $author$project$Pages$Login$Email = 0;
var $author$project$Pages$Login$Password = 1;
var $author$project$Pages$Login$Updated = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Components$ErrorList$view = function (reasons) {
	return $elm$core$List$isEmpty(reasons) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$ul,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('error-messages')
			]),
		A2(
			$elm$core$List$map,
			function (message) {
				return A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(message)
						]));
			},
			reasons));
};
var $author$project$Components$UserForm$viewField = function (options) {
	return A2(
		$elm$html$Html$fieldset,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('form-group')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-control form-control-lg'),
						$elm$html$Html$Attributes$placeholder(options.d1),
						$elm$html$Html$Attributes$type_(options.eP),
						$elm$html$Html$Attributes$value(options.eQ),
						$elm$html$Html$Events$onInput(options.ec)
					]),
				_List_Nil)
			]));
};
var $author$project$Components$UserForm$view = function (options) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('auth-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container page')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-6 offset-md-3 col-xs-12')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h1,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-xs-center')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(options.d1)
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-xs-center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href(
														$author$project$Spa$Generated$Route$toString(options.du.fX))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(options.du.d1)
													]))
											])),
										function () {
										var _v0 = options.V;
										if (_v0.$ === 2) {
											var reasons = _v0.a;
											return $author$project$Components$ErrorList$view(reasons);
										} else {
											return $elm$html$Html$text('');
										}
									}(),
										A2(
										$elm$html$Html$form,
										_List_fromArray(
											[
												$elm$html$Html$Events$onSubmit(options.fJ)
											]),
										$elm$core$List$concat(
											_List_fromArray(
												[
													A2($elm$core$List$map, $author$project$Components$UserForm$viewField, options.fi),
													_List_fromArray(
													[
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('btn btn-lg btn-primary pull-xs-right')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(options.d1)
															]))
													])
												])))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Login$view = function (model) {
	return {
		ak: _List_fromArray(
			[
				$author$project$Components$UserForm$view(
				{
					du: {d1: 'Need an account?', fX: $author$project$Spa$Generated$Route$Register},
					fi: _List_fromArray(
						[
							{
							d1: 'Email',
							ec: $author$project$Pages$Login$Updated(0),
							eP: 'text',
							eQ: model.aI
						},
							{
							d1: 'Password',
							ec: $author$project$Pages$Login$Updated(1),
							eP: 'password',
							eQ: model.c4
						}
						]),
					d1: 'Sign in',
					fJ: $author$project$Pages$Login$AttemptedSignIn,
					V: model.V
				})
			]),
		dq: 'Sign in'
	};
};
var $author$project$Pages$Login$page = $author$project$Spa$Page$application(
	{fs: $author$project$Pages$Login$init, fw: $author$project$Pages$Login$load, fZ: $author$project$Pages$Login$save, f2: $author$project$Pages$Login$subscriptions, gd: $author$project$Pages$Login$update, gf: $author$project$Pages$Login$view});
var $author$project$Spa$Page$ignoreEffect = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $author$project$Spa$Page$static = function (page) {
	return {
		fs: F2(
			function (_v0, url) {
				return _Utils_Tuple2(url, $elm$core$Platform$Cmd$none);
			}),
		fw: $elm$core$Basics$always(
			A2($elm$core$Basics$composeR, $elm$core$Basics$identity, $author$project$Spa$Page$ignoreEffect)),
		fZ: $elm$core$Basics$always($elm$core$Basics$identity),
		f2: function (_v1) {
			return $elm$core$Platform$Sub$none;
		},
		gd: F2(
			function (_v2, model) {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}),
		gf: page.gf
	};
};
var $author$project$Components$NotFound$view = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container page')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h2,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Page not found.')
				])),
			A2(
			$elm$html$Html$h5,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('But here\'s the '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('/')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('homepage')
						])),
					$elm$html$Html$text('!')
				]))
		]));
var $author$project$Pages$NotFound$view = function (_v0) {
	return {
		ak: _List_fromArray(
			[$author$project$Components$NotFound$view]),
		dq: '404'
	};
};
var $author$project$Pages$NotFound$page = $author$project$Spa$Page$static(
	{gf: $author$project$Pages$NotFound$view});
var $author$project$Pages$Profile$Username_String$GotProfile = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Profile$Username_String$MyArticles = 0;
var $author$project$Pages$Profile$Username_String$GotArticles = function (a) {
	return {$: 1, a: a};
};
var $author$project$Api$Article$Filters$Filters = $elm$core$Basics$identity;
var $author$project$Api$Article$Filters$byAuthor = F2(
	function (username, _v0) {
		var filters = _v0;
		return _Utils_update(
			filters,
			{
				e$: $elm$core$Maybe$Just(username)
			});
	});
var $author$project$Api$Article$Filters$create = {e$: $elm$core$Maybe$Nothing, fg: $elm$core$Maybe$Nothing, $7: $elm$core$Maybe$Nothing};
var $author$project$Api$Article$itemsPerPage = 25;
var $author$project$Api$Article$paginatedDecoder = function (page) {
	var multipleArticles = F2(
		function (articles, count) {
			return {be: articles, av: page, eM: (count / $author$project$Api$Article$itemsPerPage) | 0};
		});
	return A3(
		$elm$json$Json$Decode$map2,
		multipleArticles,
		A2(
			$elm$json$Json$Decode$field,
			'articles',
			$elm$json$Json$Decode$list($author$project$Api$Article$decoder)),
		A2($elm$json$Json$Decode$field, 'articlesCount', $elm$json$Json$Decode$int));
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Api$Article$Filters$pageQueryParameters = function (page_) {
	var limit = 25;
	return A2(
		$elm$core$String$join,
		'&',
		_List_fromArray(
			[
				'?limit=' + $elm$core$String$fromInt(limit),
				'offset=' + $elm$core$String$fromInt((page_ - 1) * limit)
			]));
};
var $author$project$Api$Article$Filters$toQueryString = F2(
	function (page, _v0) {
		var filters = _v0;
		var optionalFilters = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					A2(
					$elm$core$Maybe$map,
					$elm$core$String$append('tag='),
					filters.$7),
					A2(
					$elm$core$Maybe$map,
					$elm$core$String$append('author='),
					filters.e$),
					A2(
					$elm$core$Maybe$map,
					$elm$core$String$append('favorited='),
					filters.fg)
				]));
		return _Utils_ap(
			$author$project$Api$Article$Filters$pageQueryParameters(page),
			$elm$core$String$concat(
				A2(
					$elm$core$List$map,
					$elm$core$String$append('&'),
					optionalFilters)));
	});
var $author$project$Api$Article$list = function (options) {
	return A2(
		$author$project$Api$Token$get,
		options.S,
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				$author$project$Api$Article$paginatedDecoder(options.av)),
			U: 'https://conduit.productionready.io/api/articles/' + A2($author$project$Api$Article$Filters$toQueryString, options.av, options.fj)
		});
};
var $author$project$Pages$Profile$Username_String$fetchArticlesBy = F3(
	function (token, username, page_) {
		return $author$project$Api$Article$list(
			{
				fj: A2($author$project$Api$Article$Filters$byAuthor, username, $author$project$Api$Article$Filters$create),
				O: $author$project$Pages$Profile$Username_String$GotArticles,
				av: page_,
				S: token
			});
	});
var $author$project$Api$Profile$get = function (options) {
	return A2(
		$author$project$Api$Token$get,
		options.S,
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'profile', $author$project$Api$Profile$decoder)),
			U: 'https://conduit.productionready.io/api/profiles/' + options.cy
		});
};
var $author$project$Pages$Profile$Username_String$init = F2(
	function (shared, _v0) {
		var params = _v0.fS;
		var token = A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.S;
			},
			shared.V);
		return _Utils_Tuple2(
			{F: $author$project$Api$Data$Loading, av: 1, b7: $author$project$Api$Data$Loading, aw: 0, V: shared.V, cy: params.cy},
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Api$Profile$get(
						{O: $author$project$Pages$Profile$Username_String$GotProfile, S: token, cy: params.cy}),
						A3($author$project$Pages$Profile$Username_String$fetchArticlesBy, token, params.cy, 1)
					])));
	});
var $author$project$Pages$Profile$Username_String$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Profile$Username_String$save = F2(
	function (_v0, shared) {
		return shared;
	});
var $author$project$Pages$Profile$Username_String$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Profile$Username_String$FavoritedArticles = 1;
var $author$project$Pages$Profile$Username_String$UpdatedArticle = function (a) {
	return {$: 5, a: a};
};
var $author$project$Api$Article$Filters$favoritedBy = F2(
	function (username, _v0) {
		var filters = _v0;
		return _Utils_update(
			filters,
			{
				fg: $elm$core$Maybe$Just(username)
			});
	});
var $author$project$Pages$Profile$Username_String$fetchArticlesFavoritedBy = F3(
	function (token, username, page_) {
		return $author$project$Api$Article$list(
			{
				fj: A2($author$project$Api$Article$Filters$favoritedBy, username, $author$project$Api$Article$Filters$create),
				O: $author$project$Pages$Profile$Username_String$GotArticles,
				av: page_,
				S: token
			});
	});
var $author$project$Api$Article$updateArticle = F2(
	function (article, listing) {
		var articles = A2(
			$elm$core$List$map,
			function (a) {
				return _Utils_eq(a.Q, article.Q) ? article : a;
			},
			listing.be);
		return _Utils_update(
			listing,
			{be: articles});
	});
var $author$project$Pages$Profile$Username_String$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var profile = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b7: profile}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var user = msg.a;
				var profile = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Profile$follow(
						{O: $author$project$Pages$Profile$Username_String$GotProfile, S: user.S, cy: profile.cy}));
			case 7:
				var user = msg.a;
				var profile = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Profile$unfollow(
						{O: $author$project$Pages$Profile$Username_String$GotProfile, S: user.S, cy: profile.cy}));
			case 1:
				var listing = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: listing}),
					$elm$core$Platform$Cmd$none);
			case 2:
				if (!msg.a) {
					var _v1 = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: $author$project$Api$Data$Loading, av: 1, aw: 0}),
						A3(
							$author$project$Pages$Profile$Username_String$fetchArticlesBy,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.S;
								},
								model.V),
							model.cy,
							1));
				} else {
					var _v2 = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: $author$project$Api$Data$Loading, av: 1, aw: 1}),
						A3(
							$author$project$Pages$Profile$Username_String$fetchArticlesFavoritedBy,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.S;
								},
								model.V),
							model.cy,
							1));
				}
			case 3:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$favorite(
						{O: $author$project$Pages$Profile$Username_String$UpdatedArticle, Q: article.Q, S: user.S}));
			case 4:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$unfavorite(
						{O: $author$project$Pages$Profile$Username_String$UpdatedArticle, Q: article.Q, S: user.S}));
			case 8:
				var page_ = msg.a;
				var fetch = function () {
					var _v3 = model.aw;
					if (!_v3) {
						return $author$project$Pages$Profile$Username_String$fetchArticlesBy;
					} else {
						return $author$project$Pages$Profile$Username_String$fetchArticlesFavoritedBy;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: $author$project$Api$Data$Loading, av: page_}),
					A3(
						fetch,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.S;
							},
							model.V),
						model.cy,
						page_));
			default:
				if (msg.a.$ === 3) {
					var article = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: A2(
									$author$project$Api$Data$map,
									$author$project$Api$Article$updateArticle(article),
									model.F)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Profile$Username_String$Clicked = function (a) {
	return {$: 2, a: a};
};
var $author$project$Pages$Profile$Username_String$ClickedFavorite = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Pages$Profile$Username_String$ClickedFollow = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Pages$Profile$Username_String$ClickedPage = function (a) {
	return {$: 8, a: a};
};
var $author$project$Pages$Profile$Username_String$ClickedUnfavorite = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Pages$Profile$Username_String$ClickedUnfollow = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$Components$ArticleList$viewArticlePreview = F2(
	function (options, article) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('article-preview')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('article-meta')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('/profile/' + article.e$.cy)
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('info')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('author'),
											$elm$html$Html$Attributes$href('/profile/' + article.e$.cy)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(article.e$.cy)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('date')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Utils$Time$formatDate(article.e7))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pull-xs-right')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Utils$Maybe$view,
									options.V,
									function (user) {
										return _Utils_eq(user.cy, article.e$.cy) ? $elm$html$Html$text('') : (article.fg ? $author$project$Components$IconButton$view(
											{
												dB: 4,
												dV: 1,
												d1: ' ' + $elm$core$String$fromInt(article.fh),
												eb: A2(options.fN, user, article)
											}) : $author$project$Components$IconButton$view(
											{
												dB: 1,
												dV: 1,
												d1: ' ' + $elm$core$String$fromInt(article.fh),
												eb: A2(options.fI, user, article)
											}));
									})
								]))
						])),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('preview-link'),
							$elm$html$Html$Attributes$href('/article/' + article.Q)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(article.dq)
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(article.cN)
								])),
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Read more...')
								])),
							$elm$core$List$isEmpty(article.eF) ? $elm$html$Html$text('') : A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('tag-list')
								]),
							A2(
								$elm$core$List$map,
								function (tag) {
									return A2(
										$elm$html$Html$li,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('tag-default tag-pill tag-outline')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(tag)
											]));
								},
								article.eF))
						]))
				]));
	});
var $author$project$Components$ArticleList$view = function (options) {
	var _v0 = options.e_;
	switch (_v0.$) {
		case 1:
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('article-preview')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Loading...')
						]))
				]);
		case 3:
			var listing = _v0.a;
			var viewPage = function (page) {
				return A2(
					$elm$html$Html$li,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-item'),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'active',
									_Utils_eq(listing.av, page))
								]))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('page-link'),
									$elm$html$Html$Events$onClick(
									options.fK(page))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(page))
								]))
						]));
			};
			return $elm$core$List$concat(
				_List_fromArray(
					[
						A2(
						$elm$core$List$map,
						$author$project$Components$ArticleList$viewArticlePreview(options),
						listing.be),
						_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pagination')
								]),
							A2(
								$elm$core$List$map,
								viewPage,
								A2($elm$core$List$range, 1, listing.eM)))
						])
					]));
		default:
			return _List_Nil;
	}
};
var $author$project$Pages$Profile$Username_String$viewProfile = F2(
	function (profile, model) {
		var viewTab = function (tab) {
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-item')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-link'),
								$elm$html$Html$Events$onClick(
								$author$project$Pages$Profile$Username_String$Clicked(tab)),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'active',
										_Utils_eq(tab, model.aw))
									]))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								function () {
									if (!tab) {
										return 'My Articles';
									} else {
										return 'Favorited Articles';
									}
								}())
							]))
					]));
		};
		var viewTabRow = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('articles-toggle')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav nav-pills outline-active')
						]),
					A2(
						$elm$core$List$map,
						viewTab,
						_List_fromArray(
							[0, 1])))
				]));
		var isViewingOwnProfile = _Utils_eq(
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.cy;
				},
				model.V),
			$elm$core$Maybe$Just(profile.cy));
		var viewUserInfo = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('user-info')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-xs-12 col-md-10 offset-md-1')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h4,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(profile.cy)
												])),
											isViewingOwnProfile ? $elm$html$Html$text('') : A2(
											$author$project$Utils$Maybe$view,
											model.V,
											function (user) {
												return profile.fk ? $author$project$Components$IconButton$view(
													{
														dB: 3,
														dV: 0,
														d1: 'Unfollow ' + profile.cy,
														eb: A2($author$project$Pages$Profile$Username_String$ClickedUnfollow, user, profile)
													}) : $author$project$Components$IconButton$view(
													{
														dB: 0,
														dV: 0,
														d1: 'Follow ' + profile.cy,
														eb: A2($author$project$Pages$Profile$Username_String$ClickedFollow, user, profile)
													});
											})
										]))
								]))
						]))
				]));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('profile-page')
				]),
			_List_fromArray(
				[
					viewUserInfo,
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('col-xs-12 col-md-10 offset-md-1')
										]),
									A2(
										$elm$core$List$cons,
										viewTabRow,
										$author$project$Components$ArticleList$view(
											{e_: model.F, fI: $author$project$Pages$Profile$Username_String$ClickedFavorite, fK: $author$project$Pages$Profile$Username_String$ClickedPage, fN: $author$project$Pages$Profile$Username_String$ClickedUnfavorite, V: model.V})))
								]))
						]))
				]));
	});
var $author$project$Pages$Profile$Username_String$view = function (model) {
	return {
		ak: function () {
			var _v0 = model.b7;
			switch (_v0.$) {
				case 3:
					var profile = _v0.a;
					return _List_fromArray(
						[
							A2($author$project$Pages$Profile$Username_String$viewProfile, profile, model)
						]);
				case 2:
					return _List_fromArray(
						[$author$project$Components$NotFound$view]);
				default:
					return _List_Nil;
			}
		}(),
		dq: 'Profile'
	};
};
var $author$project$Pages$Profile$Username_String$page = $author$project$Spa$Page$application(
	{fs: $author$project$Pages$Profile$Username_String$init, fw: $author$project$Pages$Profile$Username_String$load, fZ: $author$project$Pages$Profile$Username_String$save, f2: $author$project$Pages$Profile$Username_String$subscriptions, gd: $author$project$Pages$Profile$Username_String$update, gf: $author$project$Pages$Profile$Username_String$view});
var $author$project$Pages$Register$Model = F5(
	function (user, key, username, email, password) {
		return {aI: email, fu: key, c4: password, V: user, cy: username};
	});
var $author$project$Pages$Register$init = F2(
	function (shared, _v0) {
		var key = _v0.fu;
		return _Utils_Tuple2(
			A5(
				$author$project$Pages$Register$Model,
				function () {
					var _v1 = shared.V;
					if (!_v1.$) {
						var user = _v1.a;
						return $author$project$Api$Data$Success(user);
					} else {
						return $author$project$Api$Data$NotAsked;
					}
				}(),
				key,
				'',
				'',
				''),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Register$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Register$save = F2(
	function (model, shared) {
		return _Utils_update(
			shared,
			{
				V: function () {
					var _v0 = $author$project$Api$Data$toMaybe(model.V);
					if (!_v0.$) {
						var user = _v0.a;
						return $elm$core$Maybe$Just(user);
					} else {
						return shared.V;
					}
				}()
			});
	});
var $author$project$Pages$Register$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Register$GotUser = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$User$registration = function (options) {
	var body = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'user',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'username',
							$elm$json$Json$Encode$string(options.V.cy)),
							_Utils_Tuple2(
							'email',
							$elm$json$Json$Encode$string(options.V.aI)),
							_Utils_Tuple2(
							'password',
							$elm$json$Json$Encode$string(options.V.c4))
						])))
			]));
	return $elm$http$Http$post(
		{
			ak: $elm$http$Http$jsonBody(body),
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'user', $author$project$Api$User$decoder)),
			U: 'https://conduit.productionready.io/api/users'
		});
};
var $author$project$Pages$Register$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				switch (msg.a) {
					case 0:
						var _v1 = msg.a;
						var username = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{cy: username}),
							$elm$core$Platform$Cmd$none);
					case 1:
						var _v2 = msg.a;
						var email = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aI: email}),
							$elm$core$Platform$Cmd$none);
					default:
						var _v3 = msg.a;
						var password = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{c4: password}),
							$elm$core$Platform$Cmd$none);
				}
			case 1:
				return _Utils_Tuple2(
					model,
					$author$project$Api$User$registration(
						{
							O: $author$project$Pages$Register$GotUser,
							V: {aI: model.aI, c4: model.c4, cy: model.cy}
						}));
			default:
				var user = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: user}),
					function () {
						var _v4 = $author$project$Api$Data$toMaybe(user);
						if (!_v4.$) {
							var user_ = _v4.a;
							return $elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Ports$saveUser(user_),
										A2($author$project$Utils$Route$navigate, model.fu, $author$project$Spa$Generated$Route$Top)
									]));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}());
		}
	});
var $author$project$Pages$Register$AttemptedSignUp = {$: 1};
var $author$project$Pages$Register$Email = 1;
var $author$project$Pages$Register$Password = 2;
var $author$project$Pages$Register$Updated = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Pages$Register$Username = 0;
var $author$project$Pages$Register$view = function (model) {
	return {
		ak: _List_fromArray(
			[
				$author$project$Components$UserForm$view(
				{
					du: {d1: 'Have an account?', fX: $author$project$Spa$Generated$Route$Login},
					fi: _List_fromArray(
						[
							{
							d1: 'Your Name',
							ec: $author$project$Pages$Register$Updated(0),
							eP: 'text',
							eQ: model.cy
						},
							{
							d1: 'Email',
							ec: $author$project$Pages$Register$Updated(1),
							eP: 'email',
							eQ: model.aI
						},
							{
							d1: 'Password',
							ec: $author$project$Pages$Register$Updated(2),
							eP: 'password',
							eQ: model.c4
						}
						]),
					d1: 'Sign up',
					fJ: $author$project$Pages$Register$AttemptedSignUp,
					V: model.V
				})
			]),
		dq: 'Sign up'
	};
};
var $author$project$Pages$Register$page = $author$project$Spa$Page$application(
	{fs: $author$project$Pages$Register$init, fw: $author$project$Pages$Register$load, fZ: $author$project$Pages$Register$save, f2: $author$project$Pages$Register$subscriptions, gd: $author$project$Pages$Register$update, gf: $author$project$Pages$Register$view});
var $author$project$Pages$Settings$init = F2(
	function (shared, _v0) {
		return _Utils_Tuple2(
			function () {
				var _v1 = shared.V;
				if (!_v1.$) {
					var user = _v1.a;
					return {aI: user.aI, am: _List_Nil, as: $elm$core$Maybe$Nothing, c4: $elm$core$Maybe$Nothing, V: shared.V, cy: user.cy};
				} else {
					return {aI: '', am: _List_Nil, as: $elm$core$Maybe$Nothing, c4: $elm$core$Maybe$Nothing, V: shared.V, cy: ''};
				}
			}(),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Settings$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Settings$save = F2(
	function (model, shared) {
		return _Utils_update(
			shared,
			{V: model.V});
	});
var $author$project$Pages$Settings$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Settings$GotUser = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$User$update = function (options) {
	var body = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'user',
				$elm$json$Json$Encode$object(
					$elm$core$List$concat(
						_List_fromArray(
							[
								_List_fromArray(
								[
									_Utils_Tuple2(
									'username',
									$elm$json$Json$Encode$string(options.V.cy)),
									_Utils_Tuple2(
									'email',
									$elm$json$Json$Encode$string(options.V.aI))
								]),
								function () {
								var _v0 = options.V.c4;
								if (!_v0.$) {
									var password = _v0.a;
									return _List_fromArray(
										[
											_Utils_Tuple2(
											'password',
											$elm$json$Json$Encode$string(password))
										]);
								} else {
									return _List_Nil;
								}
							}()
							]))))
			]));
	return A2(
		$author$project$Api$Token$put,
		$elm$core$Maybe$Just(options.S),
		{
			ak: $elm$http$Http$jsonBody(body),
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2($elm$json$Json$Decode$field, 'user', $author$project$Api$User$decoder)),
			U: 'https://conduit.productionready.io/api/user'
		});
};
var $author$project$Pages$Settings$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				switch (msg.a) {
					case 0:
						var _v1 = msg.a;
						var value = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{cy: value}),
							$elm$core$Platform$Cmd$none);
					case 1:
						var _v2 = msg.a;
						var value = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aI: value}),
							$elm$core$Platform$Cmd$none);
					default:
						var _v3 = msg.a;
						var value = msg.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									c4: $elm$core$Maybe$Just(value)
								}),
							$elm$core$Platform$Cmd$none);
				}
			case 1:
				var user = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{am: _List_Nil, as: $elm$core$Maybe$Nothing}),
					$author$project$Api$User$update(
						{O: $author$project$Pages$Settings$GotUser, S: user.S, V: model}));
			default:
				switch (msg.a.$) {
					case 3:
						var user = msg.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									as: $elm$core$Maybe$Just('User updated!'),
									V: $elm$core$Maybe$Just(user)
								}),
							$author$project$Ports$saveUser(user));
					case 2:
						var reasons = msg.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{am: reasons}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Settings$Email = 1;
var $author$project$Pages$Settings$Password = 2;
var $author$project$Pages$Settings$SubmittedForm = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Settings$Updated = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Pages$Settings$Username = 0;
var $author$project$Pages$Settings$view = F2(
	function (user, model) {
		return {
			ak: _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('settings-page')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('container page')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col-md-6 offset-md-3 col-xs-12')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$h1,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('text-xs-center')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Your Settings')
														])),
													A2($elm$html$Html$br, _List_Nil, _List_Nil),
													$author$project$Components$ErrorList$view(model.am),
													A2(
													$author$project$Utils$Maybe$view,
													model.as,
													function (message) {
														return A2(
															$elm$html$Html$p,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('text-success')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(message)
																]));
													}),
													A2(
													$elm$html$Html$form,
													_List_fromArray(
														[
															$elm$html$Html$Events$onSubmit(
															$author$project$Pages$Settings$SubmittedForm(user))
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$fieldset,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$fieldset,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('form-group')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('form-control form-control-lg'),
																					$elm$html$Html$Attributes$placeholder('Your Username'),
																					$elm$html$Html$Attributes$type_('text'),
																					$elm$html$Html$Attributes$value(model.cy),
																					$elm$html$Html$Events$onInput(
																					$author$project$Pages$Settings$Updated(0))
																				]),
																			_List_Nil)
																		])),
																	A2(
																	$elm$html$Html$fieldset,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('form-group')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('form-control form-control-lg'),
																					$elm$html$Html$Attributes$placeholder('Email'),
																					$elm$html$Html$Attributes$type_('text'),
																					$elm$html$Html$Attributes$value(model.aI),
																					$elm$html$Html$Events$onInput(
																					$author$project$Pages$Settings$Updated(1))
																				]),
																			_List_Nil)
																		])),
																	A2(
																	$elm$html$Html$fieldset,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('form-group')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('form-control form-control-lg'),
																					$elm$html$Html$Attributes$placeholder('Password'),
																					$elm$html$Html$Attributes$type_('password'),
																					$elm$html$Html$Attributes$value(
																					A2($elm$core$Maybe$withDefault, '', model.c4)),
																					$elm$html$Html$Events$onInput(
																					$author$project$Pages$Settings$Updated(2))
																				]),
																			_List_Nil)
																		])),
																	A2(
																	$elm$html$Html$button,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('btn btn-lg btn-primary pull-xs-right')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Update Settings')
																		]))
																]))
														]))
												]))
										]))
								]))
						]))
				]),
			dq: 'Settings'
		};
	});
var $author$project$Pages$Settings$page = $author$project$Spa$Page$application(
	{
		fs: $author$project$Pages$Settings$init,
		fw: $author$project$Pages$Settings$load,
		fZ: $author$project$Pages$Settings$save,
		f2: $author$project$Pages$Settings$subscriptions,
		gd: $author$project$Pages$Settings$update,
		gf: $author$project$Utils$Auth$protected($author$project$Pages$Settings$view)
	});
var $author$project$Pages$Top$FeedFor = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Top$Global = {$: 1};
var $author$project$Pages$Top$GotTags = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Top$GotArticles = function (a) {
	return {$: 0, a: a};
};
var $author$project$Api$Article$feed = function (options) {
	return A2(
		$author$project$Api$Token$get,
		$elm$core$Maybe$Just(options.S),
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				$author$project$Api$Article$paginatedDecoder(options.av)),
			U: 'https://conduit.productionready.io/api/articles/feed' + $author$project$Api$Article$Filters$pageQueryParameters(options.av)
		});
};
var $author$project$Api$Article$Filters$withTag = F2(
	function (tag, _v0) {
		var filters = _v0;
		return _Utils_update(
			filters,
			{
				$7: $elm$core$Maybe$Just(tag)
			});
	});
var $author$project$Pages$Top$fetchArticlesForTab = function (model) {
	var _v0 = model.W;
	switch (_v0.$) {
		case 1:
			return $author$project$Api$Article$list(
				{
					fj: $author$project$Api$Article$Filters$create,
					O: $author$project$Pages$Top$GotArticles,
					av: model.av,
					S: A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.S;
						},
						model.V)
				});
		case 0:
			var user = _v0.a;
			return $author$project$Api$Article$feed(
				{O: $author$project$Pages$Top$GotArticles, av: model.av, S: user.S});
		default:
			var tag = _v0.a;
			return $author$project$Api$Article$list(
				{
					fj: A2($author$project$Api$Article$Filters$withTag, tag, $author$project$Api$Article$Filters$create),
					O: $author$project$Pages$Top$GotArticles,
					av: model.av,
					S: A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.S;
						},
						model.V)
				});
	}
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{ak: $elm$http$Http$emptyBody, N: r.N, fm: _List_Nil, fx: 'GET', f5: $elm$core$Maybe$Nothing, gc: $elm$core$Maybe$Nothing, U: r.U});
};
var $author$project$Api$Article$Tag$list = function (options) {
	return $elm$http$Http$get(
		{
			N: A2(
				$author$project$Api$Data$expectJson,
				options.O,
				A2(
					$elm$json$Json$Decode$field,
					'tags',
					$elm$json$Json$Decode$list($elm$json$Json$Decode$string))),
			U: 'https://conduit.productionready.io/api/tags'
		});
};
var $author$project$Pages$Top$init = F2(
	function (shared, _v0) {
		var activeTab = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Pages$Top$Global,
			A2($elm$core$Maybe$map, $author$project$Pages$Top$FeedFor, shared.V));
		var model = {W: activeTab, F: $author$project$Api$Data$Loading, av: 1, eF: $author$project$Api$Data$Loading, V: shared.V};
		return _Utils_Tuple2(
			model,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Pages$Top$fetchArticlesForTab(model),
						$author$project$Api$Article$Tag$list(
						{O: $author$project$Pages$Top$GotTags})
					])));
	});
var $author$project$Pages$Top$load = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Top$save = F2(
	function (_v0, shared) {
		return shared;
	});
var $author$project$Pages$Top$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Pages$Top$UpdatedArticle = function (a) {
	return {$: 6, a: a};
};
var $author$project$Pages$Top$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var listing = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: listing}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var tags = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{eF: tags}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var tab = msg.a;
				var newModel = _Utils_update(
					model,
					{W: tab, F: $author$project$Api$Data$Loading, av: 1});
				return _Utils_Tuple2(
					newModel,
					$author$project$Pages$Top$fetchArticlesForTab(newModel));
			case 3:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$favorite(
						{O: $author$project$Pages$Top$UpdatedArticle, Q: article.Q, S: user.S}));
			case 4:
				var user = msg.a;
				var article = msg.b;
				return _Utils_Tuple2(
					model,
					$author$project$Api$Article$unfavorite(
						{O: $author$project$Pages$Top$UpdatedArticle, Q: article.Q, S: user.S}));
			case 5:
				var page_ = msg.a;
				var newModel = _Utils_update(
					model,
					{F: $author$project$Api$Data$Loading, av: page_});
				return _Utils_Tuple2(
					newModel,
					$author$project$Pages$Top$fetchArticlesForTab(newModel));
			default:
				if (msg.a.$ === 3) {
					var article = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: A2(
									$author$project$Api$Data$map,
									$author$project$Api$Article$updateArticle(article),
									model.F)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Top$view = function (model) {
	return {
		ak: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('home-page')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('banner')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('container')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('container page')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-9')
											]),
										_List_Nil)
									]))
							]))
					]))
			]),
		dq: ''
	};
};
var $author$project$Pages$Top$page = $author$project$Spa$Page$application(
	{fs: $author$project$Pages$Top$init, fw: $author$project$Pages$Top$load, fZ: $author$project$Pages$Top$save, f2: $author$project$Pages$Top$subscriptions, gd: $author$project$Pages$Top$update, gf: $author$project$Pages$Top$view});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$Spa$Url$toQueryDict = function (queryString) {
	var second = A2(
		$elm$core$Basics$composeR,
		$elm$core$List$drop(1),
		$elm$core$List$head);
	var toTuple = function (list) {
		return A2(
			$elm$core$Maybe$map,
			function (first) {
				return _Utils_Tuple2(
					first,
					A2(
						$elm$core$Maybe$withDefault,
						'',
						second(list)));
			},
			$elm$core$List$head(list));
	};
	var decode = A2(
		$elm$core$Basics$composeR,
		$elm$url$Url$percentDecode,
		$elm$core$Maybe$withDefault(''));
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			A2($elm$core$Tuple$mapBoth, decode, decode),
			A2(
				$elm$core$List$filterMap,
				toTuple,
				A2(
					$elm$core$List$map,
					$elm$core$String$split('='),
					A2($elm$core$String$split, '&', queryString)))));
};
var $author$project$Spa$Url$create = F3(
	function (params, key, url) {
		return {
			fu: key,
			fS: params,
			c8: A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Dict$empty,
				A2($elm$core$Maybe$map, $author$project$Spa$Url$toQueryDict, url.c8)),
			en: url
		};
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Spa$Document$map = F2(
	function (fn, doc) {
		return {
			ak: A2(
				$elm$core$List$map,
				$elm$html$Html$map(fn),
				doc.ak),
			dq: doc.dq
		};
	});
var $author$project$Spa$Generated$Pages$upgrade = F3(
	function (toModel, toMsg, page) {
		var update_ = F2(
			function (msg, model) {
				return A3(
					$elm$core$Tuple$mapBoth,
					toModel,
					$elm$core$Platform$Cmd$map(toMsg),
					A2(page.gd, msg, model));
			});
		var load_ = F2(
			function (model, shared) {
				return A3(
					$elm$core$Tuple$mapBoth,
					toModel,
					$elm$core$Platform$Cmd$map(toMsg),
					A2(page.fw, shared, model));
			});
		var init_ = F2(
			function (params, shared) {
				return A3(
					$elm$core$Tuple$mapBoth,
					toModel,
					$elm$core$Platform$Cmd$map(toMsg),
					A2(
						page.fs,
						shared,
						A3($author$project$Spa$Url$create, params, shared.fu, shared.U)));
			});
		var bundle_ = function (model) {
			return {
				fw: load_(model),
				fZ: page.fZ(model),
				f2: A2(
					$elm$core$Platform$Sub$map,
					toMsg,
					page.f2(model)),
				gf: A2(
					$author$project$Spa$Document$map,
					toMsg,
					page.gf(model))
			};
		};
		return {x: bundle_, fs: init_, gd: update_};
	});
var $author$project$Spa$Generated$Pages$pages = {
	bd: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Article__Slug_String__Model, $author$project$Spa$Generated$Pages$Article__Slug_String__Msg, $author$project$Pages$Article$Slug_String$page),
	bu: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Editor__Model, $author$project$Spa$Generated$Pages$Editor__Msg, $author$project$Pages$Editor$page),
	bv: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Editor__ArticleSlug_String__Model, $author$project$Spa$Generated$Pages$Editor__ArticleSlug_String__Msg, $author$project$Pages$Editor$ArticleSlug_String$page),
	bL: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Login__Model, $author$project$Spa$Generated$Pages$Login__Msg, $author$project$Pages$Login$page),
	bP: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$NotFound__Model, $author$project$Spa$Generated$Pages$NotFound__Msg, $author$project$Pages$NotFound$page),
	b8: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Profile__Username_String__Model, $author$project$Spa$Generated$Pages$Profile__Username_String__Msg, $author$project$Pages$Profile$Username_String$page),
	ck: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Register__Model, $author$project$Spa$Generated$Pages$Register__Msg, $author$project$Pages$Register$page),
	cr: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Settings__Model, $author$project$Spa$Generated$Pages$Settings__Msg, $author$project$Pages$Settings$page),
	cv: A3($author$project$Spa$Generated$Pages$upgrade, $author$project$Spa$Generated$Pages$Top__Model, $author$project$Spa$Generated$Pages$Top__Msg, $author$project$Pages$Top$page)
};
var $author$project$Spa$Generated$Pages$init = function (route) {
	switch (route.$) {
		case 0:
			return $author$project$Spa$Generated$Pages$pages.cv.fs(0);
		case 1:
			return $author$project$Spa$Generated$Pages$pages.bu.fs(0);
		case 2:
			return $author$project$Spa$Generated$Pages$pages.bL.fs(0);
		case 3:
			return $author$project$Spa$Generated$Pages$pages.bP.fs(0);
		case 4:
			return $author$project$Spa$Generated$Pages$pages.ck.fs(0);
		case 5:
			return $author$project$Spa$Generated$Pages$pages.cr.fs(0);
		case 6:
			var params = route.a;
			return $author$project$Spa$Generated$Pages$pages.bd.fs(params);
		case 7:
			var params = route.a;
			return $author$project$Spa$Generated$Pages$pages.bv.fs(params);
		default:
			var params = route.a;
			return $author$project$Spa$Generated$Pages$pages.b8.fs(params);
	}
};
var $author$project$Main$init = F3(
	function (flags, url, key) {
		var _v0 = A3($author$project$Shared$init, flags, url, key);
		var shared = _v0.a;
		var sharedCmd = _v0.b;
		var _v1 = A2(
			$author$project$Spa$Generated$Pages$init,
			$author$project$Utils$Route$fromUrl(url),
			shared);
		var page = _v1.a;
		var pageCmd = _v1.b;
		return _Utils_Tuple2(
			A2($author$project$Main$Model, shared, page),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd)
					])));
	});
var $author$project$Shared$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Spa$Generated$Pages$bundle = function (bigModel) {
	switch (bigModel.$) {
		case 0:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.cv.x(model);
		case 1:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.bu.x(model);
		case 2:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.bL.x(model);
		case 3:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.bP.x(model);
		case 4:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.ck.x(model);
		case 5:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.cr.x(model);
		case 6:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.bd.x(model);
		case 7:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.bv.x(model);
		default:
			var model = bigModel.a;
			return $author$project$Spa$Generated$Pages$pages.b8.x(model);
	}
};
var $author$project$Spa$Generated$Pages$subscriptions = A2(
	$elm$core$Basics$composeR,
	$author$project$Spa$Generated$Pages$bundle,
	function ($) {
		return $.f2;
	});
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$Shared,
				$author$project$Shared$subscriptions(model.z)),
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$Pages,
				$author$project$Spa$Generated$Pages$subscriptions(model.av))
			]));
};
var $author$project$Spa$Document$toBrowserDocument = function (doc) {
	return {ak: doc.ak, dq: doc.dq};
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$Spa$Generated$Pages$load = A2(
	$elm$core$Basics$composeR,
	$author$project$Spa$Generated$Pages$bundle,
	function ($) {
		return $.fw;
	});
var $author$project$Spa$Generated$Pages$save = A2(
	$elm$core$Basics$composeR,
	$author$project$Spa$Generated$Pages$bundle,
	function ($) {
		return $.fZ;
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.em;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.dO,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.c8,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.eh,
					_Utils_ap(http, url.dR)),
				url.ef)));
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Ports$clearUser = $author$project$Ports$outgoing(
	{cL: $elm$json$Json$Encode$null, $7: 'clearUser'});
var $author$project$Shared$update = F2(
	function (msg, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{V: $elm$core$Maybe$Nothing}),
			$author$project$Ports$clearUser);
	});
var $author$project$Spa$Generated$Pages$update = F2(
	function (bigMsg, bigModel) {
		var _v0 = _Utils_Tuple2(bigMsg, bigModel);
		_v0$9:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.cv.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.bu.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.bL.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 3:
					if (_v0.b.$ === 3) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.bP.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 4:
					if (_v0.b.$ === 4) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.ck.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 5:
					if (_v0.b.$ === 5) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.cr.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 6:
					if (_v0.b.$ === 6) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.bd.gd, msg, model);
					} else {
						break _v0$9;
					}
				case 7:
					if (_v0.b.$ === 7) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.bv.gd, msg, model);
					} else {
						break _v0$9;
					}
				default:
					if (_v0.b.$ === 8) {
						var msg = _v0.a.a;
						var model = _v0.b.a;
						return A2($author$project$Spa$Generated$Pages$pages.b8.gd, msg, model);
					} else {
						break _v0$9;
					}
			}
		}
		return _Utils_Tuple2(bigModel, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				if (!msg.a.$) {
					var url = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.z.fu,
							$elm$url$Url$toString(url)));
				} else {
					var href = msg.a.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			case 1:
				var url = msg.a;
				var original = model.z;
				var shared = _Utils_update(
					original,
					{U: url});
				var _v1 = _Utils_eq(url.ef, model.z.U.ef) ? A2($author$project$Spa$Generated$Pages$load, model.av, shared) : A2(
					$author$project$Spa$Generated$Pages$init,
					$author$project$Utils$Route$fromUrl(url),
					shared);
				var page = _v1.a;
				var pageCmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							av: page,
							z: A2($author$project$Spa$Generated$Pages$save, page, shared)
						}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd));
			case 2:
				var sharedMsg = msg.a;
				var _v2 = A2($author$project$Shared$update, sharedMsg, model.z);
				var shared = _v2.a;
				var sharedCmd = _v2.b;
				var _v3 = A2($author$project$Spa$Generated$Pages$load, model.av, shared);
				var page = _v3.a;
				var pageCmd = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{av: page, z: shared}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd),
								A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd)
							])));
			default:
				var pageMsg = msg.a;
				var _v4 = A2($author$project$Spa$Generated$Pages$update, pageMsg, model.av);
				var page = _v4.a;
				var pageCmd = _v4.b;
				var shared = A2($author$project$Spa$Generated$Pages$save, page, model.z);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{av: page, z: shared}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$Pages, pageCmd));
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Shared$ClickedSignOut = 0;
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $author$project$Shared$slogan = 'Highly flexible Application Runtime Platform';
var $rundis$elm_bootstrap$Bootstrap$CDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
		]),
	_List_Nil);
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $author$project$Components$Footer$view = A2(
	$elm$html$Html$footer,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('footer')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container text-center')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-muted')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('© 2020 Copyright sahli.net')
						]))
				]))
		]));
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $author$project$Components$Navbar$stringProperty = F2(
	function (name, string) {
		return A2(
			$elm$html$Html$Attributes$property,
			name,
			$elm$json$Json$Encode$string(string));
	});
var $author$project$Components$Navbar$ariaControls = function (value) {
	return A2($author$project$Components$Navbar$stringProperty, 'aria-controls', value);
};
var $author$project$Components$Navbar$ariaExpanded = function (value) {
	return A2($author$project$Components$Navbar$stringProperty, 'aria-expanded', value);
};
var $author$project$Components$Navbar$ariaLabel = function (value) {
	return A2($author$project$Components$Navbar$stringProperty, 'aria-label', value);
};
var $author$project$Components$Navbar$dataTarget = function (value) {
	return A2($author$project$Components$Navbar$stringProperty, 'data-target', value);
};
var $author$project$Components$Navbar$dataToggle = function (value) {
	return A2($author$project$Components$Navbar$stringProperty, 'data-toggle', value);
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Components$Navbar$viewLink = F2(
	function (currentRoute, _v0) {
		var label = _v0.a;
		var route = _v0.b;
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-link'),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'active',
									_Utils_eq(currentRoute, route))
								])),
							$elm$html$Html$Attributes$href(
							$author$project$Spa$Generated$Route$toString(route))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						]))
				]));
	});
var $author$project$Components$Navbar$view = function (options) {
	return A2(
		$elm$html$Html$nav,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('navbar navbar-expand-lg  navbar-light')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navbar-brand'),
						$elm$html$Html$Attributes$href(
						$author$project$Spa$Generated$Route$toString($author$project$Spa$Generated$Route$Top)),
						A2($elm$html$Html$Attributes$style, 'color', '#FF5733')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Tumbo')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navbar-toggler'),
						$elm$html$Html$Attributes$type_('button'),
						$author$project$Components$Navbar$dataToggle('collapse'),
						$author$project$Components$Navbar$dataTarget('#navbarTogglerDemo02'),
						$author$project$Components$Navbar$ariaControls('navbarTogglerDemo02'),
						$author$project$Components$Navbar$ariaExpanded('false'),
						$author$project$Components$Navbar$ariaLabel('Toggle navigation')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('navbar-toggler-icon')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('collapse navbar-collapse'),
						$elm$html$Html$Attributes$id('navbarTogglerDemo02')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav navbar-nav ml-auto')
							]),
						function () {
							var _v0 = options.V;
							if (!_v0.$) {
								return $elm$core$List$concat(
									_List_fromArray(
										[
											A2(
											$elm$core$List$map,
											$author$project$Components$Navbar$viewLink(options.dE),
											_List_fromArray(
												[
													_Utils_Tuple2('Home', $author$project$Spa$Generated$Route$Top),
													_Utils_Tuple2('Settings', $author$project$Spa$Generated$Route$Settings)
												])),
											_List_fromArray(
											[
												A2(
												$elm$html$Html$li,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('nav-item')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$a,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('nav-link'),
																$elm$html$Html$Events$onClick(options.fM)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Sign out')
															]))
													]))
											])
										]));
							} else {
								return A2(
									$elm$core$List$map,
									$author$project$Components$Navbar$viewLink(options.dE),
									_List_fromArray(
										[
											_Utils_Tuple2('Home', $author$project$Spa$Generated$Route$Top),
											_Utils_Tuple2('Sign in', $author$project$Spa$Generated$Route$Login),
											_Utils_Tuple2('Sign up', $author$project$Spa$Generated$Route$Register)
										]));
							}
						}()),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$target('blank'),
								$elm$html$Html$Attributes$href('https://github.com/sahlinet/go-tumbo3')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fa fa-github'),
										A2($elm$html$Html$Attributes$style, 'color', 'black')
									]),
								_List_Nil)
							]))
					]))
			]));
};
var $author$project$Shared$view = F2(
	function (_v0, model) {
		var page = _v0.av;
		var toMsg = _v0.f9;
		return {
			ak: _List_fromArray(
				[
					A3(
					$elm$html$Html$node,
					'link',
					_List_fromArray(
						[
							$elm$html$Html$Attributes$rel('stylesheet'),
							$elm$html$Html$Attributes$href('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
						]),
					_List_Nil),
					$rundis$elm_bootstrap$Bootstrap$CDN$stylesheet,
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('layout')
						]),
					_List_fromArray(
						[
							$author$project$Components$Navbar$view(
							{
								dE: $author$project$Utils$Route$fromUrl(model.U),
								fM: toMsg(0),
								V: model.V
							}),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('jumbotron')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text($author$project$Shared$slogan)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('page')
								]),
							page.ak),
							$author$project$Components$Footer$view
						]))
				]),
			dq: $elm$core$String$isEmpty(page.dq) ? 'Conduit' : (page.dq + ' | Conduit')
		};
	});
var $author$project$Spa$Generated$Pages$view = A2(
	$elm$core$Basics$composeR,
	$author$project$Spa$Generated$Pages$bundle,
	function ($) {
		return $.gf;
	});
var $author$project$Main$view = function (model) {
	return A2(
		$author$project$Shared$view,
		{
			av: A2(
				$author$project$Spa$Document$map,
				$author$project$Main$Pages,
				$author$project$Spa$Generated$Pages$view(model.av)),
			f9: $author$project$Main$Shared
		},
		model.z);
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		fs: $author$project$Main$init,
		fO: $author$project$Main$UrlChanged,
		fP: $author$project$Main$LinkClicked,
		f2: $author$project$Main$subscriptions,
		gd: $author$project$Main$update,
		gf: A2($elm$core$Basics$composeR, $author$project$Main$view, $author$project$Spa$Document$toBrowserDocument)
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));