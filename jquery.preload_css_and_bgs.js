/*
 * presentationLoader - Preload a set of external styles and his backgrounds
 *
 * Copyright (c) 2007 Leandro Nascimento Camargo <leandroico@gmail.com>, http://www.websaudavel.com
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Version: 2007-02-10 +r2
 */

jQuery.presentationLoader = {
	exceptions: [],
	initialMsg: 'Aguarde. Carregando estilos...',
	loadingImagesMsgPattern: function($_images_list, $_n_images_loaded, $_current_image_uri)
	{
		return 'Carregando imagens: ' + $_n_images_loaded + '/' + $_images_list.length + " (" + $_current_image_uri + ")";
	},
	loadingStylesMsgPattern: function($_styles_list, $_n_styles_loaded, $_current_style_uri)
	{
		return 'Carregando estilos: ' + $_n_styles_loaded + "/" + $_styles_list.length + " (" + $_current_style_uri + ")";
	},
	preload: function($_callback, $_params)
	{
		var
			_0ims = [],
			_0imst,
			_0imsl = _0imst = 0,
			_0body,
			_0html,
			_0css1,
			_0css2,
			_0sts = [],
			_0stst,
			_0stsl = _0stst = 0,
			_0fn,
			_0fne,
			_0fns,
			_0ipos = 0,
			_0lnk = [],
			_0i = 0,
			_0style_uri,
			_0obj = jQuery.presentationLoader;

		if(!(_0obj.exceptions instanceof Array)) _0obj.exceptions = [_0obj.exceptions];

		$(document).ready(function() {
			var _1i = 0;

			jQuery('link').each(function() {
				var _2s;
				if(!(_2s = this.getAttribute('media')) || _2s.indexOf('all') > -1 || _2s.indexOf('screen') > -1)
				{
					if(in_array(_0obj.exceptions, this.href) == -1) {
						_0lnk[_0lnk.length] = this.href;
						this.parentNode.removeChild(this);
					}
				}
			});

			/* gerando o loader status */
			jQuery([(_0html = (_0body = document.body).parentNode), _0body]).css(_0css1 = {height:'1px', overflow: 'hidden'});
			jQuery('<div id="lpao-loading"></div><div id="lpao-body"></div>').appendTo(_0body);
			jQuery(_0body.childNodes).not(jQuery('#lpao-loading')[0]).not(jQuery('#lpao-body')[0]).appendTo('#lpao-body');
			jQuery('#lpao-body').css(_0css1);
			jQuery([(_0html = (_0body).parentNode), _0body]).css(_0css2 = {height:'', overflow: ''});
			jQuery('#lpao-loading').html(_0obj.initialMsg);

			jQuery.ajax({
				type: 'GET',
				url: _0style_uri = _0lnk[_0i],
				error: _0fne = function($_r) { _0stsl++; ++_1i != _0stst && jQuery.ajax({url: _0sts[_1i], success: _1i == 1 ? _0fns : _0fn, error: _0fne}); },
				success: _0fns = function($_r)
				{
					$_r = $_r instanceof String ? $_r : $_r.responseText;
					var
						_2re = new RegExp("@import.*?[\"'](.*?)[\"']"),
						_2re2 = new RegExp("url\\([\"']?(.*?)[\"']?\\)"), 
						_2lin,
						_2t = (_2lin = $_r.split('\n')).length,
						_2i = 0,
						_2rer,
						_2path = _0style_uri.substr(0, _0style_uri.lastIndexOf('/') + 1);

					_0sts[_0sts.length] = _0style_uri;

					for(; _2i < _2t; _2i++)
					{
						(_2rer = _2lin[_2i].match(_2re)) && (in_array(_0obj.exceptions, _2rer[1])) && (_0sts[_0sts.length] = _2path + _2rer[1]);
						!_2rer && (_2rer = _2lin[_2i].match(_2re2)) && (++_0imst) && (_0ims[_0ims.length] = _2path + _2rer[1]);
					}
					_2t = _0lnk.length;
					_0sts = _0sts.concat(_0lnk.slice(1));

					_0stst = _0sts.length;
					_1i = 1;

					jQuery.ajax({
						url: _0sts[_1i],
						success: _0fn = function($_r)
						{
							$_r = $_r instanceof String ? $_r : $_r.responseText;
							var
								_3re = new RegExp("@import.*?[\"'](.*?)[\"']"),
								_3re2 = new RegExp("url\\([\"']?(.*?)[\"']?\\)"),
								_3lin,
								_3t = (_3lin = $_r.split('\n')).length,
								_3rer,
								_3path = _0sts[_1i].substr(0, _0sts[_1i].lastIndexOf('/') + 1),
								_3j = 0;

							for(; _3j < _3t; _3j++)
							{
								(_3rer = _3lin[_3j].match(_3re)) && (in_array(_0obj.exceptions, _3rer[1])) && (_0sts[_0sts.length] = path + _3rer[1]);
								!_3rer && (_3rer = _3lin[_3j].match(_3re2)) && (++_0imst) && (_0ims[_0ims.length] = _3path + _3rer[1]);
							}

							for(var _3k = _0ipos; _3k < _0imst; _3k++) {
								//var _4ti;

								//(_4ti = new Image()).src = _0ims[_0ipos++];

								load_image(_0ims[_0ipos++], function(a)
								{
									jQuery('#lpao-loading').html(_0obj.loadingImagesMsgPattern.apply(false, [_0ims, ++_0imsl, a && a.src || this.src]));
									if(_0imsl == _0imst) {
										var
											_6o = document.createElement('link'),
											_6i = 0,
											_6t = _0lnk.length;

										for(; _6i < _6t; _6i++)
										{
											_6o.href = _0lnk[_6i];
											_6o.rel = "stylesheet";
											_6o.type = "text/css";
											document.body.previousSibling.appendChild(_6o);
										}
										jQuery('#lpao-loading').css('display','none');
										setTimeout(function() {
											jQuery('#lpao-body').css(_0css2);
											$_callback && ($_params && $_callback.apply(false, $_params instanceof Array ? $_params : [$_params]) || !$_params && $_callback());
										}, 500);
									}
								});
							}
							jQuery('#lpao-loading').html(
								_0obj.loadingStylesMsgPattern.apply(false, [_0sts, ++_0stsl, _0sts[_1i]]) +
								"<br />" + _0obj.loadingImagesMsgPattern.apply(false, [_0ims, _0imsl, '--'])
							);
							++_1i != _0stst && jQuery.ajax({url: _0sts[_1i], success: _0fn, error: _0fne});
						}
					});
				}
			});
		});
	}
}

function in_array(arr, string)
{
	if(!(arr instanceof Array)) return -1;

	var
		i = 0;
		t = arr.length;

	for(; i < t; i++)
	{
		if(arr[i] instanceof RegExp && string.match(arr[i]))
			return i;
		else if(arr[i] instanceof String && string == arr[i])
			return i;
	}
	return -1;
}

function load_image($_image_uri, $_on_load_callback)
{
	var
		_0agt = navigator.userAgent.toLowerCase(),
		_0timer,
		_0ni = new Image();

	_0ni.src = $_image_uri;
	if(_0agt.indexOf('opera') > -1 || _0agt.indexOf('msie') > -1)
		_0timer = setInterval(function() { if(_0ni.complete) $_on_load_callback.call(false, _0ni); clearInterval(_0timer); }, 10);
	else
		jQuery(_0ni).load($_on_load_callback);
}