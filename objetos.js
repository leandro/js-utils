function Range($_1_str_range)
{
	var
		_1_o = this,
		_1_range = [];

	function _1_each(callback, params)
	{
		var
			_2_i = 0,
			_2_t = _1_range.length;

		for(; _2_i < _2_t; _2_i++)
			callback.apply(false, [_1_range[_2_i]].concat(params || []));
	}

	function _1_reverse() { return _1_range.reverse(); }

	function _1_to_array($_1_str)
	{
		var 
			_2_tmp,
			_2_iterator,
			_2_i = 0,
			_2_return = [],
			_2_include_end = $_1_str.indexOf("...") > -1 || $_1_str.indexOf("-") > -1 || false,
			_2_edges = (_2_tmp = $_1_str.split("...")).length > 1 && _2_tmp ||
				(_2_tmp = $_1_str.split("-")).length > 1 && _2_tmp ||
				(_2_tmp = $_1_str.split("..")).length > 1 && _2_tmp || false;

		if(!_2_edges) return false;

		_2_tmp = Math.abs((_2_edges[1] = +_2_edges[1]) - (_2_edges[0] = +_2_edges[0]));
		_2_iterator = _2_edges[1] < _2_edges[0] ? -1 : 1;

		for(; _2_i < _2_tmp; _2_i++)
			_2_return[_2_return.length] = _2_edges[0] + _2_i * _2_iterator;

		if(_2_include_end)
			_2_return[_2_return.length] = _2_edges[0] + _2_i * _2_iterator;

		return _2_return;
	}

	this.array = function() { return _1_range; }
	this.each = _1_each;
	this.is_range = function($_1_str) { return $_1_str.match(/-|\.\.\.?/); }
	this.reverse = _1_reverse;

	_1_range = _1_to_array($_1_str_range);
}
Range.is_range = function($_1_str) { return $_1_str.match(/^-?\d+(-|\.\.\.?)-?\d+$/); }
