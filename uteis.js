Array.prototype.indexesOf = function(value) { // 2008-01-30
	var i = 0, t = this.length, r = [];
	for(; i < t; i++) { if(this[i] === value) r[r.length] = i; }
	return r;
}

Array.prototype.remove = function(indexes) { // 2008-01-30
	indexes = indexes instanceof Array ? indexes : [indexes];
	var t = indexes.length, r = [];
	for(; --t > -1;) r[r.length] = this.splice(indexes[t], 1);
	return r.reverse();
}

function sequence(a, b) { // 2008-01-30
	if(isNaN(a) || isNaN(b)) return [];
	a = +a;
	b = +b;
	for(var i = a, r = []; i < a + b; r[r.length] = i++);
	return r;
}

function arrayfy_arguments($_1_args)
{
	var
		_1_i = 0,
		_1_return = [],
		_1_t = $_1_args.length;

	for(; _1_i < _1_t; _1_i++)
		$_1_args[_1_i] instanceof Array && (_1_return = _1_return.concat($_1_args[_1_i])) ||
			(_1_return[_1_return.length] = $_1_args[_1_i]);

	return _1_return;
}

Array.prototype.map = function(callback, params) {
	var
		_1_i = 0,
		_1_t = this.length;

	for(; _1_i < _1_t; _1_i++)
		callback.apply(false, [this, _1_i].concat(params || []));
	return this;
}
Array.prototype.unique = function() {
	var
		_1_i = 0,
		_1_return = [],
		_1_t = this.length,
		_1_tmp;

	for(; _1_i < _1_t; _1_i++)
		_1_return.has(this[_1_i]) == -1 && (_1_return[_1_return.length] = this[_1_i]);
	return _1_return.length && _1_return || false;
}
Array.prototype.has = function() {
	var
		_1_i = 0,
		_1_j,
		_1_args = arrayfy_arguments(arguments),
		_1_t = _1_args.length,
		_1_t2 = this.length;

	for(; _1_i < _1_t2; _1_i++ ) {
		for(_1_j = 0; _1_j < _1_t; _1_j++ ) {
			if( _1_args[_1_j] == this[_1_i] ) return _1_i;
		}
	}
	return -1;
}
