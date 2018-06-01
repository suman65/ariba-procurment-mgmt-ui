<!doctype html>
<html>
<head>
    	<% 
   			String contextPath  =   request.getContextPath();
   			String message 		=   request.getAttribute("message") != null ? "*"+(String) request.getAttribute("message") : "";
		%>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>:: ARIBA ::</title>
       <link rel="shortcut icon" href="./images/logo.png"  type="image/jpg" />
       <link rel="stylesheet" type="text/css" href="/../css/login.css" media="screen" />
		<script type="text/javascript" src="/../js/modules/login/login.js"></script>
</head>

<body>
	<div class="container">
		<form action="home" method="post" name="loginForm" onsubmit="return validate()"  enctype="application/json">
			<div class="login_bg">
				<div class="login_he">
					<div class='logo'> </div>
					<div class="inlog_pd">
						<p>Login</p>
					</div><br>
					<div id="errorMsg" class="alert"><%= message%></div>
					<div><input type="text" name="userName" class="text_filed" placeholder="User Name"/></div>
					<div><input type="password" name="password" class="text_filed" placeholder="Password"/></div>
					<div><button type = "submit" class="login_btn">Login</button></div>
					</div>
				</div>
		</form>
	</div>
</body>
</html>