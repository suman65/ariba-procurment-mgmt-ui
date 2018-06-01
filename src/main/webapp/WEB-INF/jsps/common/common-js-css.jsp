<%
    String contextPath      =   request.getContextPath();
	String token 		=   request.getAttribute("token") != null ? (String) request.getAttribute("token") : "";
%>
<style type="text/css" title="currentStyle" media="screen">
    @import "<%=contextPath %>/js/lib/ExtJs-5.1.1/packages/ext-theme-neptune/resources/ext-theme-neptune-all.css";
    @import "<%=contextPath %>/js/lib/ExtJs-5.1.1/packages/sencha-charts/neptune/resources/sencha-charts-all.css";
    @import "<%=contextPath %>/css/iconCls.css";
    @import "<%=contextPath %>/css/override.css";
</style>

<script type="text/javascript" src="<%=contextPath %>/js/lib/ExtJs-5.1.1/ext-all.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/lib/ExtJs-5.1.1/sencha-charts.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/lib/ExtJs-5.1.1/packages/ext-theme-neptune/ext-theme-neptune.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/common/overrides.js"></script>
<script type="text/javascript">
	var ATP = window.ATP || { };
	ATP.APPLICATION_MODE = 'DEVELOPMENT'; //DEPLOYMENT/DEVELOPMENT
	var contextPath = '<%=contextPath%>';
	var token 		= '<%=token%>';
	Ext.Loader.setConfig({enabled: true, disableCaching: false});
	Ext.Loader.setPath('Ext.ux', contextPath + '/js/lib/ExtJs-5.1.1/ux');
</script>

<script type="text/javascript" src="<%=contextPath %>/js/common/Utilities.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/common/appLabels.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/common/appURLs.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/common/ext-custom-components.js"></script>
<script type="text/javascript" src="<%=contextPath %>/js/common/ext-common.js"></script>
