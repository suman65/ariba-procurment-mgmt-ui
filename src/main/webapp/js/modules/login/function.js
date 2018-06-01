Ext.onReady(function()
{	
   var logInform = Ext.create('Ext.form.Panel',
	{
         frame			: false
        ,id 			: 'logInform'
        ,bodyPadding	: 15
        ,width			: 500
        ,height			: 200
        ,url 			: 'home.htm'
        	,border     : true
        ,bodyPadding    : 10
        ,renderTo		: Ext.getBody()
        ,fieldDefaults	: {
			               labelAlign	: 'left'
			               ,labelWidth	: 150
			               ,anchor		: '100%'
			               ,labelStyle	: 'font-weight:bold'
			              },
        items: [
                 {
	                xtype			: 'textfield'
	               ,id				: 'userName'
	               ,name			: 'userName'
	               ,fieldLabel		: 'User Name'
                 }
                ,{
	               xtype			: 'textfield'
	               ,id				: 'password'
	               ,name			: 'password'
	               ,fieldLabel		: 'Password'
	            	,inputType: 'password'
                 } 
                ,{
 	               xtype			: 'textarea'
 	               ,hidden			:  true
 	               ,id				: 'actionName'
 	               ,name			: 'actionName'
 	               ,fieldLabel		: 'actionName'
 	               ,value           : 'login'
                  } 
              ]
                ,buttons : [
                             {    text     :'LogIn' 
                            	 ,formBind : true
                            	 ,iconCls  : 'LogIn'
                            	 ,handler  : function (btn, evt) { logInform.getForm().submit()}
                            	 }
                            ]
    });
});

 
/*function submit()
{
	var form  = 	Ext.getCmp('logInform').getValues();
	var jsonStr  = 	Ext.encode(form);
	  Ext.Ajax.request(
			    {
			       url 		: 'home.htm'
			      ,method	: 'POST'
			      ,waitMsg 	: 'Saving...'
			      ,headers	: { 'Content-Type': 'application/json' }                     
			      ,jsonData	: jsonStr
			      ,params   : {"actionName":'login'}
			      ,success	: function (response) 
			        {
			            console.log(response);
			        }
			      ,failure: function (response) {
			    	  console.log(response);
			           }
			 });
}*/
