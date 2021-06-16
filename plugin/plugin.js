/*
Copyright 2020 APLY Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var flightHistorySource;
var flightHistoryView;
var langset = "KR";
var parent_url;  	
var pluginid;


$(function() {
	setCommonText();
  initPilotPlugin();
  mixpanel.identify("anonymous");
});


function setCommonText() {
	var langt = getQueryVariable("lang");
	if (isSet(langt))
		langset = langt;
		
	document.title = LANG_JSON_DATA[langset]['page_center_title'];	
		
	$("#r_count_label").text(LANG_JSON_DATA[langset]["r_count_label"]);	
	$("#a_time_label").text(LANG_JSON_DATA[langset]["a_time_label"]);
	$("#a_time_min_label").text(LANG_JSON_DATA[langset]["a_time_min_label"]);
	$("#callsign_pre_label").text(LANG_JSON_DATA[langset]["callsign_pre_label"]);
}


function initPilotPlugin() {
	showLoader();    
  parent_url = getQueryVariable("parent_url");  	
  pluginid = getQueryVariable("code");  
  	
  if (!isSet(pluginid)) {
  	hideLoader();  	
    return;
  }  
  
  mixpanel.identify(pluginid);  
	GATAGM("plugin_loaded_" + pluginid + "_" + parent_url, "PLUGIN", langset);
  
	flightHistoryMapInit();
  flightViewInit();   
  getProfile(pluginid);
}

function flightViewInit() {
	document.title = LANG_JSON_DATA[langset]['page_flight_rec_view_title'];
	$("#head_title").text(document.title);	    
}

function flightHistoryMapInit() {
	var dpoint = ol.proj.fromLonLat([0, 0]);

  flightHistoryView = new ol.View({
      center: dpoint,
      zoom: 4
    });

  flightHistorySource = new ol.source.Vector();
  
  var clusterSource = new ol.source.Cluster({
		  distance: 40,
		  source: flightHistorySource,
		  geometryFunction: function(feature) {
        var geom = feature.getGeometry();
    		return geom.getType() == 'Point' ? geom : null;
    	},
		});

	var styleCache = {};
  var vVectorLayer = new ol.layer.Vector({
      source: clusterSource,
      zIndex: 1000,
      style:  function (feature) {
        	if (!feature) return;
        	
			    var size = feature.get('features').length;
			    var radius;
			    size == 1 ? radius = 8 : radius = 10 + (size * 0.1);
			    var style = styleCache[size];
			    if (!style) {
			       style = [new ol.style.Style({
                image: new ol.style.Circle({
		            radius: radius,
		            fill: new ol.style.Fill({ color: '#a03e8bd2' }), 
		            stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
                }),
                text: new ol.style.Text({
                  text: size.toString(),
                  fill: new ol.style.Fill({ color: '#fff' }),
                  scale: 1.5,
                })
              })];
    
            styleCache[size] = style
			    }
			    return style;
			  },
    });

  var bingLayer = new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.BingMaps({
        // We need a key to get the layer from the provider.
        // Sign in with Bing Maps and you will get your key (for free)
        key: 'AgMfldbj_9tx3cd298eKeRqusvvGxw1EWq6eOgaVbDsoi7Uj9kvdkuuid-bbb6CK',
        imagerySet: 'AerialWithLabels', // or 'Road', 'AerialWithLabels', etc.
        // use maxZoom 19 to see stretched tiles instead of the Bing Maps
        // "no photos at this zoom level" tiles
        maxZoom: 19
    })
	});

  var vMap = new ol.Map({
      target: 'historyMap',
      layers: [
          bingLayer, vVectorLayer
      ],
      // Improve user experience by loading tiles while animating. Will make
      // animations stutter on mobile or slow devices.
      loadTilesWhileAnimating: true,
      view: flightHistoryView
    });
        
	  vMap.on('click', function(e) {
				GATAGM("plugin_map_click_" + pluginid + "_" + parent_url, "PLUGIN", langset);
		});
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function getProfile(pluginid) {		
  var jdata = {"action" : "plugin", "pluginid" : pluginid};

  showLoader();
  ajaxRequest(jdata, function (r) {
    if(r.result == "success") {
      hideLoader();
      //setChart(r);
		  setDashBoard(r);
		  setMap(r);
    }
    else {    	
      hideLoader();      
    }
  }, function(request,status,error) {
    hideLoader();    
  });
}

function makeForFlightListMap(index, name, flat, flng) {
	var dpoint = ol.proj.fromLonLat([flng, flat]);
  var icon = createNewIcon(index, {name: name, lat:flat, lng:flng, alt:0});    
  flightHistorySource.addFeature(icon);  
}

function setMap(r) {
	r.locations.forEach(function(val, index, array) {
		makeForFlightListMap(index, val.name, val.flat, val.flng);
	});
	
	if (r.locations.length > 0) {
		moveFlightHistoryMap(r.locations[0].flat, r.locations[0].flng);
	}
}

function setDashBoard(r) {
	var rcount = r.record_count;
	var mcount = 0;
	var alltime = r.alltime;
	var callsign = r.callsign;
				
	const coptions = {
			duration: 5,
	};
	
	$("#callsign").text(callsign);
	
	var rlabel = new CountUp('r_count_label_time', rcount, coptions);
	if (!rlabel.error) {
		rlabel.start();
	} else {
		console.error(rlabel.error);
	}
	
	var mmin = Math.round(alltime / 60);
	
	var alabel = new CountUp('a_time_label_time', mmin, coptions);
	if (!alabel.error) {
		alabel.start();
	} else {
		console.error(alabel.error);
	}
}

function setChart(r) {
	
		var rcount = r.record_count;
		var mcount = 0;
		var alltime = r.alltime;
					
		if (rcount == 0 && mcount == 0) {			
			rcount = 1;
			mcount = 1;
		}
								
		// Set new default font family and font color to mimic Bootstrap's default styling
		Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
		Chart.defaults.global.defaultFontColor = '#858796';

		// Pie Chart Example
		var ctx = document.getElementById("myPieChart");
		var myPieChart = new Chart(ctx, {
		  type: 'doughnut',
		  data: {
		    labels: [LANG_JSON_DATA[langset]["r_count_label"], ""],
		    datasets: [{
		      data: [rcount, mcount],
		      backgroundColor: ['#4e73df', '#1cc88a'],
		      hoverBackgroundColor: ['#2e59d9', '#17a673'],
		      hoverBorderColor: "rgba(234, 236, 244, 1)",
		    }],
		  },
		  options: {
		    maintainAspectRatio: false,
		    tooltips: {
		      backgroundColor: "rgb(255,255,255)",
		      bodyFontColor: "#858796",
		      borderColor: '#dddfeb',
		      borderWidth: 1,
		      xPadding: 15,
		      yPadding: 15,
		      displayColors: false,
		      caretPadding: 10,
		    },
		    legend: {
		      display: false
		    },
		    cutoutPercentage: 80,
		  },
		});						
}

function createNewIcon(i, item) {
	var pos_icon = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng * 1, item.lat * 1])),
          name: "lat: " + item.lat + ", lng: " + item.lng + ", alt: " + item.alt,
          mindex : i,
          titlename : item.name
      });
 	
 	var pos_icon_image = '../center/imgs/position4.png';
 	
  var icon_style = new ol.style.Style({
	      image: new ol.style.Icon(({
	      	opacity: 0.55,
	        crossOrigin: 'anonymous',
	        src: pos_icon_image
	      	}))	      	      
	});

  pos_icon.setStyle(icon_style);    

  return pos_icon;
}

function isSet(value) {
  if (value == "" || value == null || value == "undefined") return false;

  return true;
}


function moveFlightHistoryMap(lat, lng) {
	var npos = ol.proj.fromLonLat([lng * 1, lat * 1]);
	flightHistoryView.setCenter(npos);
}

function ajaxRequest(data, callback, errorcallback) {
    $.ajax({url : "https://api.duni.io/v1/",
           dataType : "json",
           crossDomain: true,
           cache : false,
           data : JSON.stringify(data),
           type : "POST",
           contentType: "application/json; charset=utf-8",           
           success : function(r) {
             callback(r);
           },
           error:function(request,status,error){
               monitor("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
               errorcallback(request,status,error);
           }
    });
}

function showLoader() {
  $("#loading").show();
}

function hideLoader() {
  $("#loading").fadeOut(800);
}

function GATAGM(label, category, language) {
  gtag(
      'event', label + "_" + language, {
        'event_category' : category,
        'event_label' : label
      }
    );

  mixpanel.track(
    label + "_" + language,
    {"event_category": category, "event_label": label}
  );
}

function isSet(value) {
  if (value == "" || value == null || value == "undefined") return false;

  return true;
}