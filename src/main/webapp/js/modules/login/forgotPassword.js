Ext.onReady(function()
{
	var forgotPwdForm  = Ext.create('Ext.form.Panel',
	{
			width		: 450
		    ,bodyPadding: 10
		    ,id         : 'forgotPwdForm'
		    ,frame      : true
		    ,items	:[
		          	  {
		                  xtype      : 'textfield'
		                 ,name       : 'emailId'
		                 ,fieldLabel : '<b>Email Id</b>'
		                 ,labelWidth : 100
		                 ,id         : 'emailId'
		                 ,msgTarget  : 'side'
		                 ,allowBlank : false
		                 ,anchor     : '100%'
		          	  }
		          	  ]
		 	,buttons:[
		 	           {	text	: '<b>Submit</b>'	,formBind : true,iconCls  : 'upload'  ,iconAlign: 'right'  ,handler  : forgotPwd	}
		 	         ]
	});

	
	var forgotPwdWin = Ext.create('Ext.Window',
    {
	         id     	: 'forgotPwdWin'
	        ,title    	: 'Forgot Password'
	        ,width  	: 450
	        ,height 	: 150
	        ,renderTo	: Ext.getBody()
	        ,closeAction: 'destroy'
	        ,layout 	: 'fit'
	        ,items  	: forgotPwdForm
    }).show();
})

function forgotPwd()
{
	Ext.Ajax.request(
	{
            url: 'rest/Users/forgotPassword?emailId='+Ext.getCmp('emailId').getValue('emailId')
            ,method: 'POST'
            ,waitMsg: 'Saving...'
            ,success: function (response) 
            {
            	if(response.responseText == "Success")
            	{
            		Ext.Msg.minWidth = 430;
            		Utilities.showAlert('Re-Login', 'Password reset successfully and mail has been sent. Please Re-Login with new password.',
                    function (btn, text) {
                        if (btn == 'ok') {var redirect = 'loginController.htm';window.location = redirect;}
                    });
            	}
            	else
            	{
            		Ext.getCmp('emailId').markInvalid('The provided email id does not exist.')
            	}
            },
            failure: function (response) 
            {
            	Utilities.showAlert('Failure', 'Unable To Process.');
            }
     });
}
