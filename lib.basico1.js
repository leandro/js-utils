//<|fnc:cMC;data:2006.05.26;autor:Leandro N. Camargo|>
function cMC() { //(un)checkMultipleCheckboxes
       var inps, t = (inps = document.getElementsByTagName('input')).length,
i = 0, inp, pressed = 0;
       for(; t;) {
               if((inp = inps[--t]).type == 'checkbox') {
                       addEvent(inp, 'mousedown', function() { pressed = 1; } );
                       addEvent(document, 'mouseup', function() { pressed = 0; } );
                       addEvent(inp, 'mouseover', function() { if(pressed) this.checked = !this.checked; } );
               }
       }
}
//<|@fnc:cMC;|>
//<|fnc:noAccents;data:2006.05.16;autor:Leandro N. Camargo|>
function noAccents(str) {
	var a = 'áãâàäÁÃÂÀÄéêèëÉÊÈËíîìïÍÎÌÏóõôòöÓÕÔÒÖúûüùÚÛÜÙçÇñÑ', pos,  rstr = '',
		b = 'aaaaaAAAAAeeeeEEEEiiiiIIIIoooooOOOOOuuuuUUUUcCnN', t = str.length, i = 0;
	for(; i < t; rstr += (pos = a.indexOf(str.charAt(i))) > -1 ? b.charAt(pos) : str.charAt(i), i++);
	return rstr;
}
//<|@fnc:noAccents;|>
//<|obj:AjaxList;data:2006.05.15;autor:Leandro N. Camargo|>
var AjaxList = function(inputElement, itensRecipient) {
	/*dependencies: addEvent(), has_class(), add_class(), remove_class() loadXML(), noAccents(),
	gFETN(), removeEvent(), pDAOK()*/
	var s = this, d = document, tmp, o, u;
	s.changeRecipientId = function(id) { s.recipient.id = id; }
	s.createRecipient = function(id) {
		d.body.appendChild(((tmp = d.createElement('div')).id = id, tmp));
		return tmp;
	}
	s.positionateRecipient = function() {
		o = s.recipient;
		o.style.position = 'absolute';
		o.style.top = (u = s.input).offsetTop + 20 + "px";
		o.style.left = u.offsetLeft + "px";
		o.style.width = u.offsetWidth + "px";
	}
	s.recipientHide = function() {
		o = s.recipient;
		o.style.display = (s.recipientDisplay = 0, 'none');
		o.innerHTML = '';
	}
	s.recipientShow = function() {
		o = s.recipient;
		o.style.display = (s.recipientDisplay = 1, '');
	}
	s.run = function() {
		s.FN[3] = function() {
			s.xhr = new XHRObj();
			s.recipientShow();
			s.recipient.innerHTML = '';
			s.showLoadingEffect();
			loadXML(s.serverPage + '?' + noAccents(s.value), s.xhr, function() {
				if(s.onLoadList)
					s.onLoadList(s);
				else {
					var t, i = 0;
					s.hideLoadingEffect();
					s.recipient.innerHTML = s.xhr.responseText;
					s.recipientShow();
					if(s.itensAbout.className)
						t = (s.itens = gFETN(s.itensAbout.tagName, ['className=' + s.itensAbout.className], 0)).length;
					else
						t = (s.itens = d.getElementsByTagName(s.itensAbout.tagName)).length;
					if(t) {
						max_height(s.itens[0].parentNode, s.maxHeightList);
						s.selectedItem = s.itens[s.itemPos = 0];
						!has_class(s.selectedItem, s.linkOverClass) && add_class(s.selectedItem, s.linkOverClass);
						for(; i < t; i++) {
							s.itens[i].pos = i;
							addEvent(s.itens[i], 'mouseover', function() {
								if(s.changeValueOnCursor)
									s.input.value = this.innerHTML;
								!has_class(this, s.linkOverClass) && add_class(this, s.linkOverClass);
							});
							addEvent(s.itens[i], 'mouseout', function() {
								remove_class(this, s.linkOverClass);
							});
							addEvent(s.itens[i], 'click', function() {
								s.input.value = this.innerHTML;
								s.selectedItem = this;
								s.setValueOnHiddenInput();
								s.recipientHide();
							});
						}
					} else
						s.recipientHide();
				}
			});
		}
		if(s.inputHidden) {
			addEvent(s.input, 'blur', s.FN[1] = function() {
				s.setValueOnHiddenInput();
			});
		}
		if(!s.minLengthValue) {
			addEvent(s.input, 'focus', s.FN[2] = function() {
				s.value != s.input.value && (s.value = s.input.value);
				s.FN[3]();
			});
		}
		if(s.FN[0]) removeEvent(s.input, 'keyup', s.FN[0]);
		s.recipientHide();
		s.positionateRecipient();
		addEvent(s.input, 'keyup', s.FN[0] = function(e) {
			if(!e) var e = window.event;
			var kc = e.keyCode || e.which;
			if(kc != 38 && kc != 40 && kc != 13 ) {
				if(s.value != s.input.value && (s.value = s.input.value).length >= s.minLengthValue) {
					s.FN[3]();
				} else if(s.value.length < s.minLengthValue)
					s.recipientHide();
				
			} else if(s.recipientDisplay) {
				var t = s.itens.length, i = 0;
				if(kc == 38)
					s.selectedItem = s.itens[s.itemPos = --s.itemPos < 0 ? t - 1 : s.itemPos];
				else if(kc == 40)
					s.selectedItem = s.itens[s.itemPos = ++s.itemPos ^ t ? s.itemPos : 0];
				else {
					if(kc == 13) s.input.value = s.itens[s.itemPos].innerHTML;
					s.recipientHide();
				}
				if(s.changeValueOnCursor)
					s.input.value = s.selectedItem.innerHTML;
				for(; i < t; i++) {
					if(i == s.itemPos) {
						!has_class(s.itens[i], s.linkOverClass) && add_class(s.itens[i], s.linkOverClass);
					} else
						remove_class(s.itens[i], s.linkOverClass);
				}
			}
		});
		pDAOK(s.input, 13);
		elementsOnEvent([s.recipient, s.input], 'click', function(ev,obj) {}, function(ev,obj) {
			s.recipientHide();
		});
		elementsOnEvent(document, 'keyup', function(ev,obj) {
			if((ev.keyCode || e.ehich) == 9) {
				s.recipientHide();
			}
		});
	}
	s.hideLoadingEffect = function(cn) {
		if(cn = cn || s.classNameLoading) {
			s.classNameLoading = cn;
			remove_class(s.objLoading, cn);
		}
	}
	s.showLoadingEffect = function(cn, msg) {
		if(cn = cn || s.classNameLoading) {
			s.classNameLoading = cn;
			add_class(s.objLoading, cn);
		}
		if(s.loadingMsg = msg || s.loadingMsg) s.objLoading.innerHTML = s.loadingMsg;
	}
	s.setValueOnHiddenInput = function() {
		if(noAccents(s.selectedItem.innerHTML).toLowerCase() == noAccents(s.input.value).toLowerCase()) {
			var numId = /[0-9]+/.exec(s.selectedItem.id);
			s.inputHidden && (s.inputHidden.value = numId);
		} else
			s.inputHidden && (s.inputHidden.value = '');
	}
	s.classNameLoading = '';
	s.FN = [];
	s.input = inputElement;
	s.inputHidden = null;
	s.itemPos = -1;
	s.itens = {};
	s.itensAbout = {'tagName':'', 'className':''};
	s.linkOverClass = 'over';
	s.loadingMsg = 'carregando...';
	s.maxHeightList = 120;
	s.minLengthValue = 3;
	s.onLoadList = null;
	s.recipient = itensRecipient || s.createRecipient('ajax-itens' + Math.random()*1000);
	s.objLoading = s.recipient;
	s.recipientDisplay = 0;
	s.serverPage = '';
	s.selectedItem = null;
	s.changeValueOnCursor = false;
	s.value = s.input.value;
	s.xhr = {};
}
//<|@obj:AjaxList;|>
//<|fnc:elementsOnEvent;data:2006.05.13;autor:Leandro N. Camargo|>
function elementsOnEvent(els, ev, fnok, fnerr)
{
//dependecies: getSrc();
	els = els instanceof Array ? els : [els]
	addEvent(document, ev, function(e) {
		if(!e) var e = window.event;
		var ta = getSrc(e), i = 0, t = els.length;
		while(ta) {
			for( i = 0; i < t; i++) {
				if(ta === els[i]) {
					fnok && fnok(e,ta);
					return true;
				}
			}
			ta = ta.parentNode;
		}
		fnerr && fnerr(e);
		return false;
	});
}
//<|@fnc:elementsOnEvent;|>
//<|fnc:getSrc;data:2006.05.13;autor:Leandro N. Camargo|>
function getSrc(e)
{
	return e.target || e.srcElement || false;
}
//<|@fnc:getSrc;|>
//<|fnc:max_height_IE;data:2006.05.13;autor:Leandro N. Camargo|>
function max_height(els, max_height)
{
	var t = (els = els instanceof Array ? els : [els]).length, i = 0;
	for(; i < t; i++)
		if(els[i].offsetHeight > max_height)
			els[i].style.height = (els[i].style.overflow = 'auto', max_height + "px");
}
//<|@fnc:max_height_IE;|>
//<|fnc:isIE;data:2006.05.13;autor:Leandro N. Camargo|>
function isIE() {
	var tmp;
	return ( tmp = navigator.userAgent.toLowerCase() ).indexOf( 'msie' ) > -1 && tmp.indexOf( 'opera' ) == -1;
}
//<|@fnc:isIE;|>
//<|fnc:pDAOK;data:2006.05.13;autor:Leandro N. Camargo|>
function pDAOK(iL, keys ) { // preventDefaultActionOnKeys(iL:itensList{arr},keys:keycode{int|array})
//dependencies: addEvent(), Array.has()
	var t = (iL = !(iL instanceof Array) ? [iL] : iL).length, i = 0;
	keys = keys instanceof Array ? keys : [keys];
	for(; i < t; i++) {
		addEvent(iL[i], 'keydown', function(e) {
			if(!e) var e = window.event;
			var tecla = e.which || e.keyCode;
			if(keys.has(tecla)) {
				(window.event && !(e.returnValue = false)) || e.preventDefault();
				return false;
			}
			return true;
		} );
	}
}
//<|@fnc:pDAOK|>
//<|fnc:pDA;data:2006.04.25;autor:Leandro N. Camargo|>
function pDA(iL, ev) { // preventDefaultAction(iL:itensList{arr},ev:event{str})
//dependencies: addEvent()
	var t = (iL = !(iL instanceof Array) ? [iL] : iL).length, i = 0;
	for(; i < t; i++) {
		addEvent(iL[i], ev, function(e) {
			if(!e) var e = window.event;
			(window.event && !(e.returnValue = false)) || e.preventDefault();
			return false;
		} );
	}
}
//<|@fnc:pDA|>
//<|fnc:gFETN;data:2006.04.24;autor:Diego Nunes [dnunes.com]|>
function gFETN(tTN, tFs, isER) { //getFilteredElements[by]TagName -- [str] TagName, [arr] theFilters, [bool] isERFilter
	var tEs, i, n, ii, nn, tF, tER, tR=new Array(); tEs=document.getElementsByTagName(tTN);
	if (!tFs) { return (tEs.length) ? tEs : false; }
	for (n=tEs.length, i=0; i<n; i++) { passed=1;
	for (nn=tFs.length, ii=0; ii<nn; ii++) { tF=tFs[ii].split('=');
	if (isER) { tER=new RegExp(tF[1], 'g'); if (!tER.test(tEs[i][tF[0]])) { passed=0; }
	} else { if (tEs[i][tF[0]] != tF[1]) passed=0; }
	} if (passed) tR[tR.length]=tEs[i]; // compatível com IE 5.1
	} return (tR.length) ? tR : false;
} 
//<|@fnc:gFETN|>
//<|fnc:open_popup;data:2006.04.13;autor:Leandro N. Camargo|>
function open_popup( namespace, params ) {
//dependencies: addEvent(), gFETN()
	var els = gFETN( 'a', ['className=^(.* )?' + namespace + '([0-9]*)(-[0-9]+)?(-[0-9]+)?( .*)?$'], 1 ), r = [],
		t = els.length, i = 0, re = new RegExp('^(.* )?' + namespace + '([0-9]*)(-[0-9]+)?(-[0-9]+)?( .*)?$');
	for( ; i < t; i++ ) {
		addEvent( els[i], 'click', function(e) {
			if(!e) var e = window.event;
			if( !e.altKey && !e.ctrlKey && !e.shiftKey ) {
				( window.event && !( e.returnValue = false ) ) || e.preventDefault();
				var rea = re.exec(this.className), A = params[ rea[2] || 0 ],
				w = +rea[3].substr(1) || screen.availWidth, h = +rea[4].substr(1) || screen.availHeight, c;
				c = A[1] !== false && ( ",left=" + ( A[1] === true ? parseInt( Math.abs(screen.availWidth - w) / 2 ) : A[1] ) ) || '';
				c += A[2] !== false && ( ",top=" + ( A[2] === true ? parseInt( Math.abs(screen.availHeight - h) / 2 ) : A[2] ) ) || '';
				r[r.length] = window.open( this.href, '_blank', A[0] + c + ',width=' + w + ',height=' + h );
			}
		} );
	}
	return r;
}
//<|@fnc:open_popup|>
//<|obj:Carregando;data:2006.04.11;autor:Leandro N. Camargo|>
Carregando = function(id, msg, father_node) {
	var tmp, inDoc = true, s = this;
	s.obj = crossObj( id ) || ( tmp = document.createElement('div'),
		tmp.appendChild( document.createTextNode( msg ) ), tmp.id = id, inDoc = false, tmp );
	if( !inDoc )
		father_node.appendChild( tmp );
	s.show = function() { s.obj.style.display = ''; }
	s.hide = function() { s.obj.style.display = 'none'; }
	s.changeMsg = function(m) { s.obj.innerHTML = m; }
}
//<|@obj:Carregando|>
//<|fnc:has_class;data:2006.03.24;autor:Leandro N. Camargo|>
function has_class( obj, cn )
{
	var cns = obj.className, re = new RegExp( "^(.* )?" + cn + "( .*)?$", "g" );
	return re.test( cns );
}
//<|@fnc:has_class|>
//<|fnc:remove_class;data:2006.03.10;autor:Leandro N. Camargo|>
function remove_class( obj, cn )
{
	var cns = obj.className, re = new RegExp( "^(.* )?" + cn + "( .*)?$", "g" );
	obj.className = cns.replace( re, '$1$2' );
	return obj.className = obj.className.replace( '  ', ' ' );
}
//<|@fnc:remove_class|>
//<|fnc:add_class;data:2006.03.10;autor:Leandro N. Camargo|>
function add_class( obj, cn )
{
	var cns = ( obj.className = obj.className.replace( '  ', ' ' ) );
	obj.className += cns.substr( cns.length - 1 ) == ' ' ? cn : ' ' + cn;
	return obj.className;
}
//<|@fnc:add_class|>
//<|fnc:not_multiple_opt;data:2006.03.07;autor:Leandro N. Camargo|>
function not_multiple_opt( obj, keys ) // keys = { 'value': [], 'index': [] };
{
	keys.index = keys.index instanceof Array ? keys.index : [keys.index];
	keys.value = keys.value instanceof Array ? keys.value : [keys.value];
	if( !obj || !keys.value && !keys.index )
		return false;
	var ti, opts = new get_multiple_opt( obj ), tmp;
	if( !obj.type || ( obj.type != (ti = "checkbox") && obj.nodeName.toLowerCase() != (ti = "select") ) )
		return false;
	if( keys.index )
		( tmp = opts.indexes.has( keys.index ) ) !== false && ( obj.options.selectedIndex = opts.indexes[tmp] );
	if( keys.value )
		( tmp = opts.values.has( keys.value ) ) !==false && ( obj.options.selectedIndex = opts.indexes[tmp] );
	return true;
}
//<|@fnc:not_multiple_opt|>
//<|fnc:get_multiple_opt;data:2006.03.07;autor:Leandro N. Camargo|>
get_multiple_opt = function( obj )
{
	var ti, o = this;
	o.opts = [];
	o.values = [];
	o.indexes = [];
	if( !obj.type || ( obj.type != (ti = "checkbox") && obj.nodeName.toLowerCase() != (ti = "select") ) )
		return false;
	var att, opt, t = ( opt = ti == 'select' ? ( att = 'selected', obj.options ) : ( att = 'checked', obj ) ).length,
		r = [], i = 0;
	for( ; i < t; opt[i][att] ? o.values[o.values.length] = ( ( o.indexes[o.indexes.length] =  opt[i].index, o.opts[o.opts.length] = opt[i++] ).value ) : i++ );
	return true;
}
//<|@fnc:get_multiple_opt|>
//<|fnc:one_active;data:2006.03.01;autor:Leandro N. Camargo|>
function one_active( obj_collec, event, style_class, parent_lvl )
{
	var t = obj_collec.length, aux, obj;
	for( ; t; addEvent( obj_collec[--t], event, function()
		{
			var t2 = obj_collec.length;
			for( ; t2; ) {
				if( obj_collec[--t2] === ( obj = getAncestorNode( this, !parent_lvl ? 0 : parent_lvl ), this ) ) {
					if( !has_class(obj, style_class) ) {
						add_class(obj, style_class);
					}
				} else
					remove_class(getAncestorNode( obj_collec[t2], !parent_lvl ? 0 : parent_lvl ), style_class);
			}
		} ) );
}
//<|@fnc:one_active|>
//<|fnc:switch_content;data:2006.03.01;autor:Leandro N. Camargo|>
function switch_content( el_ctner, el_trigger, el_hidden )
{
	el_ctner = typeof el_ctner == "string" ? crossObj( el_ctner ) : el_ctner;
	el_trigger = typeof el_trigger == "string" ? crossObj( el_trigger ) : el_trigger;
	el_hidden = typeof el_hidden == "string" ? crossObj( el_hidden ) : el_hidden;
	addEvent( el_trigger, 'click', function(e)
	{
		if( !e ) var e = window.event;
		( window.event && !( e.returnValue = false ) ) || e.preventDefault() || e.stopPropagation();
		el_ctner.innerHTML = el_hidden.innerHTML;
	} );
}
//<|@fnc:switch_content|>
//<|fnc:equalizer_height;data:2006.02.23;autor:Leandro N. Camargo|>
function equalizer_height( a )
{
	var els, t, t2 = t = ( els = a.split( ',' ) ).length, max = crossObj( els[0] ).offsetHeight, aux;
	for( ; t; max = ( aux = crossObj( els[--t] ).offsetHeight ) > max ? aux : max );
	for( ; t2; crossObj( els[--t2] ).style.height = max + 'px' );
}
//<|@fnc:equalizer_height|>
//<|fnc:addEvent;data:2005.11.30;autor:Peter Paul|>
function addEvent( obj, type, fn )
{
	if( !obj ) return false;
	if (obj.addEventListener)
		obj.addEventListener( type, fn, false );
	else if (obj.attachEvent)
	{
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
	}
}
//<|@fnc:addEvent|>
//<|fnc:removeEvent;data:2005.11.30;autor:Peter Paul|>
function removeEvent( obj, type, fn )
{
	if( !obj ) return false;
	if (obj.removeEventListener)
		obj.removeEventListener( type, fn, false );
	else if (obj.detachEvent)
	{
		if(obj[type+fn]) {
			obj.detachEvent( "on"+type, obj[type+fn] );
			obj[type+fn] = null;
			obj["e"+type+fn] = null;
		}
	}
}
//<|@fnc:removeEvent|>
//<|fnc:array.has;data:2005.08.10;autor:Leandro N. Camargo|>
Array.prototype.has = function() {
	var a, t = ( a = this.has.arguments ).length, t2 = this.length;
	for( var i = 0; i < t2; i++ ) {
		for( var j = 0; j < t; j++ ) {
			if( a[j] == this[i] ) return i;
		}
	}
	return false;
}
//<|@fnc:array.has|>
//<|fnc:getCloserAncestorElement;data:2005;autor:Leandro N. Camargo|>
function getCloserAncestorElement(a,b) { // pega o mais proximo elemento 'b' ancestral de 'a'
	a=typeof a=="string"?crossObj(a):a;if(!a)return false;b=b.toLowerCase();
	for(var c=false;(a=a.parentNode).nodeName!='BODY';a.nodeName.toLowerCase()==b?(c=!c?a:c):null);
	return c;
}
//<|@fnc:getCloserAncestorElement|>
//<|fnc:getAncestorNode;data:2005;autor:Leandro N. Camargo|>
function getAncestorNode(obj,lvl) { for(var i=0;i<lvl;i++) { if(!obj.parentNode)return false;obj=obj.parentNode; } return obj; }
//<|@fnc:getAncestorNode;|>
//<|fnc:crossObj;data:2005;autor:Leandro N. Camargo|>
function crossObj(/*string ID [,stringId]+*/)
{
	var args = crossObj.arguments;
	var n_args = args.length;
	if(!n_args) return 0;
	
	if(n_args == 1)
	{
		if(document.getElementById) return document.getElementById(args[0]);
		else if(document.all) return document.all[args[0]];
		else return 0;
	}
	else
	{
		var objCollec = new Array(n_args);

		for(var i = 0; i < n_args; i++)
		{
			if(document.getElementById) objCollec[i] = document.getElementById(args[i]);
			else if(document.all) objCollec[i] = document.all[args[i]];
			else objCollec[i] = 0;
		}
	}
}
//<|@fnc:crossObj|>