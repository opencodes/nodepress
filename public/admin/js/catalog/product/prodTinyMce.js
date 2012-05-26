  tinyMCE.init({
    mode: "exact",
    theme: "advanced",
    elements: "prodDesc,prodSDesc",
    plugins: "advhr,table,advimage,advlink,inlinepopups,insertdatetime,preview,print,contextmenu,nonbreaking,xhtmlxtras",

    theme_advanced_buttons1: "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
    theme_advanced_buttons2: "bullist,numlist,|,link,image,code,|,insertdate,inserttime,preview,|,forecolor,backcolor|,print,|,tablecontrols",
    theme_advanced_buttons3: "",
    theme_advanced_toolbar_location: "top",
    theme_advanced_toolbar_align: "left",
    theme_advanced_statusbar_location: "bottom",
    theme_advanced_resizing: true,
    relative_urls : false
  });