var PURCHASE_INTENTION = {
	init	: function()
	{
		this.definePurchaseIntention();
	}
	,definePurchaseIntention : function()
	{
		Ext.define('PurchaseIntention', 
		{
			extend	: 'Ext.data.Model',
			fields	:
			[
				 {	name: 'id'														}
				,{	name: 'mdrName'					,mapping: 'mdrInfo.name'		}
				,{	name: 'mdrId'					,mapping: 'mdrInfo.id'			}
				,{	name: 'seasonName'				,mapping: 'season.name'			}
				,{	name: 'season'					,mapping: 'season.id'			}
				,{	name: 'cropName'				,mapping: 'crop.name'			}
				,{	name: 'crop'					,mapping: 'crop.id'				}
				,{	name: 'regionName'				,mapping: 'region.name'			}
				,{	name: 'region'					,mapping: 'region.id'			}
				,{	name: 'tblName'					,mapping: 'tbl.name'			}
				,{	name: 'tbl'						,mapping: 'tbl.id'				}
				,{	name: 'wasSampleIssuedLastSeason'								}
				,{	name: 'sampleHybridName'		,mapping: 'sampleHybridInfo.name'}
				,{	name: 'farmerName'												}
				,{	name: 'farmerMobileNo'											}
				,{	name: 'cropArea'												}
				,{	name: 'hybridCropArea'											}
				,{	name: 'otherCropArea'											}
				,{	name: 'pioneerHybrid1'											}
				,{	name: 'pioneerHybrid2'											}
				,{	name: 'pioneerHybrid1Area'										}
				,{	name: 'pioneerHybrid2Area'										}
				,{	name: 'competitorHybrid1Area'									}
				,{	name: 'competitorHybrid2Area'									}
				,{	name: 'competitorHybrid3Area'									}
				,{	name: 'competitorHybrid4Area'									}
				,{	name: 'competitorHybrid5Area'									}
				,{	name: 'geoLocation'												}
				,{	name: 'year'													}
				,{	name: 'date'													}
				,{	name: 'transactedOn'											}
			 ]
		});
	}
	,getPurchaseIntentionStore: function(extraParams)
	{
		var proxy = {
				type		: 'ajax'
				,url		: ATP.Urls.gridData
				,extraParams: {actionType : 'purchaseIntentionService'}
				,reader		: 'jsonreader'
			}

		if (extraParams) proxy.extraParams.extraParams = extraParams;

		return Ext.create('Ext.data.GridStore',
			{
				 model	: 'PurchaseIntention'
				,proxy	: proxy
			});
	}
	,getPurchaseIntentionGrid : function()
	{
		var me			=	this;
		var purchaseIntentionGrid	=	{
			xtype		: 'customgrid'
			,title		: getLabel('ATP.PDA.GRID.TITLE')
			,itemId		: 'purchaseIntentionGrid'
			,store		: me.getPurchaseIntentionStore()
			,flex		: 1
			,columns	: 
			[
				 {	text : 'MDR Name'					,dataIndex : 'mdrName'							}
				,{	text : 'Season'						,dataIndex : 'seasonName'						}
				,{	text : 'Crop'						,dataIndex : 'cropName'							,width: 50}
				,{	text : 'Sample Issued Last in Season'	,dataIndex : 'wasSampleIssuedLastSeason'	,hidden: true	,renderer : U.YesNoRenderer}
				,{	text : 'Sample Hybrid'				,dataIndex : 'sampleHybridName'					}
				,{	text : 'Farmer'						,dataIndex : 'farmerName'						}
				,{	text : 'Farmer Mobile No'			,dataIndex : 'farmerMobileNo'					}
				/*,{	text : 'Crop Area'					,dataIndex : 'cropArea'							}
				,{	text : 'Hybrid Crop Area'			,dataIndex : 'hybridCropArea'					}
				,{	text : 'Pioneer Hybrid1'			,dataIndex : 'pioneerHybrid1'					}
				,{	text : 'Pioneer Hybrid2'			,dataIndex : 'pioneerHybrid2'					}
				,{	text : 'Pioneer Hybrid1 Area'		,dataIndex : 'pioneerHybrid1Area'				}
				,{	text : 'Pioneer Hybrid2 Area'		,dataIndex : 'pioneerHybrid1Area'				}
				,{	text : 'Competitor Hybrid1 Area'	,dataIndex : 'competitorHybrid1Area'			}
				,{	text : 'Competitor Hybrid2 Area'	,dataIndex : 'competitorHybrid2Area'			}
				,{	text : 'Competitor Hybrid3 Area'	,dataIndex : 'competitorHybrid3Area'			}
				,{	text : 'Competitor Hybrid4 Area'	,dataIndex : 'competitorHybrid4Area'			}
				,{	text : 'Competitor Hybrid5 Area'	,dataIndex : 'competitorHybrid5Area'			}*/
				,{	text : 'Geo Location'				,dataIndex : 'geoLocation'						}
				,{	text : 'Year'						,dataIndex : 'year'								,width: 50}
				,{	text : 'Date'						,dataIndex : 'date'								,hidden: true	,filter : 'date'	,renderer : U.renderFormattedDate}
				,{	text : 'Transacted On'				,dataIndex : 'transactedOn'						,hidden: true	,filter : 'date'	,renderer : U.renderFormattedDate}
			]
			,listeners	: 
			{
				selectionchange	: function(selModel, records)
				{
					var container = selModel.view.grid.next('container');
					if (records.length)
					{
						container.unmask();
						me.updateDetails(container, records[0]);
					}
					else
					{
						container.mask();
					}
				}
			}
		};

		return purchaseIntentionGrid;
	}
	,getPurchaseIntentionPanel: function()
	{
		var me	=	this,
			panel = {
				xtype		: 'panel'
				,layout		: {type: 'hbox'}
				,defaults	: {height: '100%'}
				,items		:
				[
					me.getPurchaseIntentionGrid()
					,{
						xtype		: 'container'
						,width		: 350
						,scrollable	: true
						,border		: '0 1 1 1'
						,style		: {borderColor: '#CCC',	borderStyle: 'solid', backgroundColor: '#f2f2f2'}
						,tpl		: me.getTemplate()
						/*,data	:
						{
							actual: {}
							,plan : {}
						}*/
						,listeners	:
						{
							afterlayout: function()
							{
								this.mask();
							}
							,single: true
						}
						,mask: function (msg, msgCls, elHeight)
						{
							var box = this.lastBox,
								target = this.getMaskTarget() || this.el;

							if (box) {elHeight = box.height;}
							target.mask('Select a record from left.', 'purchaseIntentionMaskCls', elHeight);
							this.setMasked(true);
						}
					}
				]
			};

		return panel;
	}
	,getTemplate: function()
	{
		return new Ext.XTemplate(
			'<table class="purchaseIntention">'
			,'<tbody>'
				,'<tr style="background-color: #a1968a; font-size: 15px;">'
					,'<th colSpan="5" style="border: 1px solid #BFBFBF;">Purchase Intention Summary</th>'
				,'</tr>'
				,'<tr class="highlight">'
					,'<th>Data</th>'
					,'<th>Y {actual.year}<br>(Actual)</th>'
					,'<th>Y {plan.year}<br>(Plan)</th>'
					,'<th>Change</th>'
					,'<th>Change %</th>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">{cropName} Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.cropArea}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.cropArea}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "cropArea")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "cropArea")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Hybrid {cropName} Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.hybridCropArea}</td>'
					,'<td style="text-align: right; padding-right: 6px; background-color: yellowgreen;">{plan.hybridCropArea}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "hybridCropArea")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "hybridCropArea")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Other Crop Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.otherCropArea}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.otherCropArea}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "otherCropArea")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "otherCropArea")]}</td>'
				,'</tr>'
				,'<tr class="highlight">'
					,'<td style="text-align: left; padding-left: 5px;">Total Farm Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[values.actual.cropArea + values.actual.hybridCropArea + values.actual.otherCropArea]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[values.plan.cropArea + values.plan.hybridCropArea + values.plan.otherCropArea]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "cropArea", "hybridCropArea", "otherCropArea")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "cropArea", "hybridCropArea", "otherCropArea")]}</td>'
				,'</tr>'
				,'<tr <tpl if="actual.pioneerHybrid1 != \'NA\' && plan.pioneerHybrid1 != \'NA\' && (actual.pioneerHybrid1 != plan.pioneerHybrid1)">class="highlightInvalidComparision" data-qtip="Actual vs Plan Hybrids are different"</tpl>>'
					,'<td style="text-align: left; padding-left: 5px;">{actual.pioneerHybrid1}/{plan.pioneerHybrid1} Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.pioneerHybrid1Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.pioneerHybrid1Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "pioneerHybrid1Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "pioneerHybrid1Area")]}</td>'
				,'</tr>'
				,'<tr <tpl if="actual.pioneerHybrid2 != \'NA\' && plan.pioneerHybrid2 != \'NA\' && (actual.pioneerHybrid2 != plan.pioneerHybrid2)">class="highlightInvalidComparision" data-qtip="Actual vs Plan Hybrids are different"</tpl>>'
					,'<td style="text-align: left; padding-left: 5px;">{actual.pioneerHybrid2}/{plan.pioneerHybrid2} Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.pioneerHybrid2Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.pioneerHybrid2Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "pioneerHybrid2Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "pioneerHybrid2Area")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Competitor Hybrid1</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.competitorHybrid1Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.competitorHybrid1Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "competitorHybrid1Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "competitorHybrid1Area")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Competitor Hybrid2</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.competitorHybrid2Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.competitorHybrid2Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "competitorHybrid2Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "competitorHybrid2Area")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Competitor Hybrid3</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.competitorHybrid3Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.competitorHybrid3Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "competitorHybrid3Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "competitorHybrid3Area")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Competitor Hybrid4</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.competitorHybrid4Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.competitorHybrid4Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "competitorHybrid4Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "competitorHybrid4Area")]}</td>'
				,'</tr>'
				,'<tr>'
					,'<td style="text-align: left; padding-left: 5px;">Competitor Hybrid5</td>'
					,'<td style="text-align: right; padding-right: 6px;">{actual.competitorHybrid5Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{plan.competitorHybrid5Area}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "competitorHybrid5Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "competitorHybrid5Area")]}</td>'
				,'</tr>'
				,'<tr class="highlight">'
					,'<td style="text-align: left; padding-left: 5px;">Total Hybrid {cropName} Acres</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[values.actual.pioneerHybrid1Area + values.actual.pioneerHybrid2Area + values.actual.competitorHybrid1Area + values.actual.competitorHybrid2Area + values.actual.competitorHybrid3Area + values.actual.competitorHybrid4Area + values.actual.competitorHybrid5Area]}</td>'
					,'<td style="text-align: right; padding-right: 6px; background-color: yellowgreen;">{[values.plan.pioneerHybrid1Area + values.plan.pioneerHybrid2Area + values.plan.competitorHybrid1Area + values.plan.competitorHybrid2Area + values.plan.competitorHybrid3Area + values.plan.competitorHybrid4Area + values.plan.competitorHybrid5Area]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChange(values, "pioneerHybrid1Area", "pioneerHybrid2Area", "competitorHybrid1Area", "competitorHybrid2Area", "competitorHybrid3Area", "competitorHybrid4Area", "competitorHybrid5Area")]}</td>'
					,'<td style="text-align: right; padding-right: 6px;">{[this.getChangePer(values, "pioneerHybrid1Area", "pioneerHybrid2Area", "competitorHybrid1Area", "competitorHybrid2Area", "competitorHybrid3Area", "competitorHybrid4Area", "competitorHybrid5Area")]}</td>'
				,'</tr>'
			,'</tbody>'
			,'</table>'
			,{
				disableFormats: true
				,getChange: function(values, key)
				{
					// return (values.plan[key] - values.actual[key]);
					var argumentLen = arguments.length;
					var values = arguments[0];
					var value1 = 0;
					var value2 = 0;
					var change = 0;

					for (var i = 1; i < argumentLen; i ++)
					{
						value1 += values.actual[arguments[i]];
						value2 += values.plan[arguments[i]];
					}

					change = value2 - value1;
					return (change >= 0 ? ('<span style="color: green;">' + change + '</span>') : ('<span style="color: red;">' + change + '</span>'));
				}
				,getChangePer: function()
				{
					var argumentLen = arguments.length;
					var values = arguments[0];
					var value1 = 0;
					var value2 = 0;

					for (var i = 1; i < argumentLen; i ++)
					{
						value1 += values.actual[arguments[i]];
						value2 += values.plan[arguments[i]];
					}

					var changePercentage = value1 != 0 ? ((value2 - value1) / value1 * 100).toFixed(2) : null;
					return changePercentage != null ? (changePercentage >= 0 ? ('<span style="color: green;">' + changePercentage + '%</span>') : ('<span style="color: red;">' + changePercentage + '%</span>')) : 'NA';
				}
			}
		);
	}
	,updateDetails: function(container, record)
	{
		container.setLoading(true);
		Ext.Ajax.request(
		{
			url 		: ATP.Urls.getPurchaseIntentionSummary
			,method		: 'GET'
			,params		: {mdrId: record.get('mdrId'), year: record.get('year'), seasonId: record.get('season'), cropId: record.get('crop'), farmerMobileNo: record.get('farmerMobileNo'), regionId: record.get('region'), tblId: record.get('tbl')}
			,success	: function (response) 
			{
				var responseData = Ext.decode(response.responseText);
				responseData.cropName = record.get('cropName');
				container.update(responseData);
				container.setLoading(false);
			}
			,failure: function (response) 
			{
				container.update({});
				container.setLoading(false);
			}
		});
	}
};

PURCHASE_INTENTION.init();
