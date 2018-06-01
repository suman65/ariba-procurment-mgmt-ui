var token = token;
var PRUPLOAD =	
{
	init: function()
	{
	}
	,synching: false
	,syncingEntity: null
	,getTpl: function()
	{
		return new Ext.XTemplate(
			'<div class="datasync-heading">',
				'<span>Upload Purchase Requisation Data from Spreadsheets</span>',
			'</div>',
			'<div class="datasync-view">',
				'<tpl for=".">',
					
				'</tpl>',
			'</div>'
		);
	}
	,getViwePart : function()
	{
		var me = this;
		var view = Ext.create('Ext.view.View',
				{
					 tpl		: me.getTpl()
					,itemSelector: 'div.datasync-section'
					,style		: 'background-color: #a8a8a8;'
					,width: '50%'
				});
		return view;
	}
	,getView: function()
	{
		var me = this;
		var viwePart = me.getViwePart();
		var formPart = me.getForm();
		var cont = Ext.create('Ext.container.Container', 
		{
		    layout: {
		        type: 'vbox'
		    },
		    width: '100%',
		    border: 1,
		    items: 
		    	[	
		    		formPart
		    	]
		});
		return cont;
	}
	,getForm : function()
	{
		var me  = this;
		var uploadForm = Ext.create('Ext.form.Panel', 
			   	{
		            frame			: false
		            ,renderTo 		: Ext.getBody()
		            ,bodyPadding	: 25
		            ,border			: false
		            ,width          : '100%'
		            ,layout			: 'hbox'
			        ,items		: [
			        				me.getViwePart(),
			        				{ xtype: 'tbspacer'  ,width :50},
					                {
					                	xtype 		: 'filefield',
					    				buttonOnly  : true,
					    				name 		: 'filess',
					    				style		: 'border-color:orange;border-radius:2px;font-weight:bold;',
					    				buttonConfig : 
					    				{
					    					width 		: 160,
					    					text 		: '<b>Select Excel File(s)</b>',
					    					textAlign 	: 'center',
					    					height		: 50,
					    					ui			: 'default-toolbar',
					    					margin 		: '3 3 3 3',
					    					style		: 'border:5px solid orange;border-radius:2px;font-weight:bold;background-color:orange;',
					    				},
					    				 listeners:
					    				 {
					    				        afterrender:function(cmp)
					    				        {
					    				            cmp.fileInputEl.set({
					    				                multiple:'multiple'
					    				            });
					    				        },
					    				        change: function(s)
					    				        {
					    				        	 var form = this.up('form').getForm();
					    				                if(form.isValid())
					    				                {
					    				                    form.submit({
					    				                    	url: 'http://localhost:8092/v1/uploadFile',
					    				                        waitMsg: 'Uploading your file...',
					    				                        success: function(form, action) 
					    				                        {
					    				                            Ext.Msg.alert('Success', action.result.message);
					    				                        },
					    				                        failure: function(form, action) 
					    				                        {
					    				                            Ext.Msg.alert('Success', 'Uploaded');
					    				                        }
					    				                });
					    		                }
					    				    }
					                   }
					                }
					           ]
			   	});
		return uploadForm;
	}
};
PRUPLOAD.init();
