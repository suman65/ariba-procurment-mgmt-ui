if(document.location.href != window.parent.document.location.href)
{
    window.top.location=document.location.href;//("<%=request.getContextPath()%>/login.htm");
}

/**
 * 
 */
var RE_USER = /^(\w+[\-\.])*\w+@(\w+\.)+[A-Za-z]+$/;
var RE_PASS =/^[A-Za-z0-9 ]{8,20}$/;
function validate()
{
	hideValidationMsg();
	document.getElementById("errorMsg").innerHTML =   "";
	document.getElementById("errorMsg").innerHTML   =   "";

	var pwd     = document.loginForm.password.value;
	var uname   = document.loginForm.userName.value;

	uname   =   uname   ?   uname.replace(/^\s+|\s+$/g, "") :   uname;

	if((uname!="")&&(pwd!=""))
	{
		return true;
	}
	else
	{
		if(uname=="" && pwd!="")   document.getElementById("errorMsg").innerHTML = "* User Name should not be empty";
		else if(pwd=="" && uname!="")     document.getElementById("errorMsg").innerHTML = "* Password should not be empty";
		else document.getElementById("errorMsg").innerHTML = "* Please Enter User name and Password";
		showValidationMsg();
		return false;
	}
	hideValidationMsg();
	return true;
}

function capLock(e)
{
	var kc = e.keyCode?e.keyCode:e.which;
	var sk = e.shiftKey?e.shiftKey:((kc == 16)?true:false);
	if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
		document.getElementById('divMayus').style.visibility = 'visible';
	else
		document.getElementById('divMayus').style.visibility = 'hidden';
}

function showValidationMsg()
{
	document.getElementById("errorMsg").style.display = "block";
	document.getElementById("errorMsg").style.backgroundColor = "red";
	document.getElementById("errorMsg").style.color = "white";
}

function hideValidationMsg()
{
	document.getElementById("errorMsg").style.display = "none";
	document.getElementById("errorMsg").style.backgroundColor = "";
	document.getElementById("errorMsg").innerHTML = "";
}
