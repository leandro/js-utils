// Useful when you don't want to use JS frameworks for ajax
// ps.: choose getHTTPObject or XHRObj function, they do the same thing

function getHTTPObject() {
  return (window.ActiveXObject
    && (new ActiveXObject("Msxml2.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTTP")))
    || (window.XMLHttpRequest && new XMLHttpRequest()) || false;
}

function XHRObj()
{
	req = false;
	if(window.XMLHttpRequest) {
		try {
		req = new XMLHttpRequest();
		} catch(e) {
		req = false;
		}
	} else if(window.ActiveXObject) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				req = false;
			}
		}
	}
	return req;
}
loadXML=function(u,o,f) {
	if(o) {
		o.onreadystatechange=function () {
			if(o.readyState==4&&o.status==200)
				f();
		}
		o.open("GET",u,true);
		if(window.XMLHttpRequest) o.send(null);
		else o.send();
	}
}
loadXML2=function(u,o,f) {
	if(o) {
		o.onreadystatechange=function () {
			f();
		}
		o.open("GET",u,true);
		if(window.XMLHttpRequest) o.send(null);
		else o.send();
	}
}
sendPost = function(fo,o,uri,fnok,fnerr) {
	var els, t = ( els = fo.elements ).length, i = 0, str_post = "", vl;
	for( ; i < t; i++ )
	{
		var str_tmp = "";
		if( els[i].nodeName.toLowerCase() == 'select' || els[i].type == 'checkbox' )
		{
			var t1 = ( vl = ( new get_multiple_opt ( els[i] ) ).values ).length, i1, nome;
			if( ( nome = els[i].name ).substr( nome.length - 2 ) == '[]' )
			{
				nome = nome.substr( 0, nome.length - 2 );
				for( i1 = 0 ; i1 < t1; i1++ )
					str_tmp += nome + '[' + i1 + ']=' + escape( vl[i1] ) + '&';
			}
		}
		else
			vl = els[i].value;
		if( els[i].nodeName.toLowerCase() != 'fieldset' )
			str_post += ( str_tmp ? str_tmp : els[i].name + "=" + escape( vl ) + "&" );
	}
	str_post = str_post.slice( 0, -1 );
	o.onreadystatechange=function () {
		if( o.readyState == 4 && o.status == 200 )
			fnok();
		else
			fnerr && fnerr();
	}
	o.open('POST',uri,true);
	o.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
	o.setRequestHeader("Content-length", str_post.length);
	o.setRequestHeader("Connection", "close");
	o.send(str_post);
}


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
