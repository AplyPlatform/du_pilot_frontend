;(function () {
	
	'use strict';

	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#gtco-offcanvas, .js-gtco-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	    	$('.js-gtco-nav-toggle').addClass('');

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-gtco-nav-toggle').removeClass('active');
				
	    	}
	    
	    	
	    }
		});

	};


	var offcanvasMenu = function() {

		$('#page').prepend('<div id="gtco-offcanvas" />');
		$('#page').prepend('<a href="#" class="js-gtco-nav-toggle gtco-nav-toggle "><i></i></a>');
		var clone1 = $('.menu-1 > ul').clone();
		$('#gtco-offcanvas').append(clone1);
		var clone2 = $('.menu-2 > ul').clone();
		$('#gtco-offcanvas').append(clone2);

		$('#gtco-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
		$('#gtco-offcanvas')
			.find('li')
			.removeClass('has-dropdown');

		// Hover dropdown menu on mobile
		$('.offcanvas-has-dropdown').mouseenter(function(){
			var $this = $(this);

			$this
				.addClass('active')
				.find('ul')
				.slideDown(500, 'easeOutExpo');				
		}).mouseleave(function(){

			var $this = $(this);
			$this
				.removeClass('active')
				.find('ul')
				.slideUp(500, 'easeOutExpo');				
		});


		$(window).resize(function(){

			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-gtco-nav-toggle').removeClass('active');
				
	    	}
		});
	};


	var burgerMenu = function() {

		$('body').on('click', '.js-gtco-nav-toggle', function(event){
			var $this = $(this);


			if ( $('body').hasClass('overflow offcanvas') ) {
				$('body').removeClass('overflow offcanvas');
			} else {
				$('body').addClass('overflow offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};



	var contentWayPoint = function() {
		var i = 0;

		// $('.gtco-section').waypoint( function( direction ) {


			$('.animate-box').waypoint( function( direction ) {

				if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
					
					i++;

					$(this.element).addClass('item-animate');
					setTimeout(function(){

						$('body .animate-box.item-animate').each(function(k){
							var el = $(this);
							setTimeout( function () {
								var effect = el.data('animate-effect');
								if ( effect === 'fadeIn') {
									el.addClass('fadeIn animated-fast');
								} else if ( effect === 'fadeInLeft') {
									el.addClass('fadeInLeft animated-fast');
								} else if ( effect === 'fadeInRight') {
									el.addClass('fadeInRight animated-fast');
								} else {
									el.addClass('fadeInUp animated-fast');
								}

								el.removeClass('item-animate');
							},  k * 50, 'easeInOutExpo' );
						});
						
					}, 100);
					
				}

			} , { offset: '85%' } );
		// }, { offset: '90%'} );
	};



	var changeWayPoint = function() {
		var i = 0;

		// $('.gtco-section').waypoint( function( direction ) {


			$('.animate-change').waypoint( function( direction ) {

				if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
					
					i++;

					$(this.element).addClass('item-animate');
					setTimeout(function(){

						$('body .animate-change.item-animate').each(function(k){
							var el = $(this);
							setTimeout( function () {
								el.addClass('changed animated-fast');
								el.removeClass('item-animate');
							},  k * 100, 'easeInOutExpo' );
						});
						
					}, 100);
					
				}

			} , { offset: '85%' } );
		// }, { offset: '90%'} );
	};


	var dropdown = function() {

		$('.has-dropdown').mouseenter(function(){

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function(){
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};


	var owlCarousel = function(){
		
		var owl = $('.owl-carousel-carousel');
		owl.owlCarousel({
			items: 3,
			loop: true,
			margin: 40,
			nav: true,
			dots: true,
			navText: [
		      "<i class='ti-arrow-left owl-direction'></i>",
		      "<i class='ti-arrow-right owl-direction'></i>"
	     	],
	     	responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:2
	        },
	        1000:{
	            items:3
	        }
	    	}
		});


		var owl = $('.owl-carousel-fullwidth');
		owl.owlCarousel({
			items: 1,
			loop: true,
			margin: 20,
			nav: true,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			navText: [
		      "<i class='ti-arrow-left owl-direction'></i>",
		      "<i class='ti-arrow-right owl-direction'></i>"
	     	]
		});


		

	};

	var tabs = function() {

		// Auto adjust height
		$('.gtco-tab-content-wrap').css('height', 0);
		var autoHeight = function() {

			setTimeout(function(){

				var tabContentWrap = $('.gtco-tab-content-wrap'),
					tabHeight = $('.gtco-tab-nav').outerHeight(),
					formActiveHeight = $('.tab-content.active').outerHeight(),
					totalHeight = parseInt(tabHeight + formActiveHeight + 90);

					tabContentWrap.css('height', totalHeight );

				$(window).resize(function(){
					var tabContentWrap = $('.gtco-tab-content-wrap'),
						tabHeight = $('.gtco-tab-nav').outerHeight(),
						formActiveHeight = $('.tab-content.active').outerHeight(),
						totalHeight = parseInt(tabHeight + formActiveHeight + 90);

						tabContentWrap.css('height', totalHeight );
				});

			}, 100);
			
		};

		autoHeight();


		// Click tab menu
		$('.gtco-tab-nav a').on('click', function(event){
			
			var $this = $(this),
				tab = $this.data('tab');

			$('.tab-content')
				.addClass('animated-fast fadeOutDown');

			$('.tab-content')
				.removeClass('active');

			$('.gtco-tab-nav li').removeClass('active');
			
			$this
				.closest('li')
					.addClass('active')

			$this
				.closest('.gtco-tabs')
					.find('.tab-content[data-tab-content="'+tab+'"]')
					.removeClass('animated-fast fadeOutDown')
					.addClass('animated-fast active fadeIn');


			autoHeight();
			event.preventDefault();

		}); 
	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".gtco-loader").fadeOut("slow");
	};

	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	var counterWayPoint = function() {
		if ($('#gtco-counter').length > 0 ) {
			$('#gtco-counter').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	
	var flightRecArray = [];
	var tableCount = 0;
	var pos_icon_image = './center/imgs/position4.png';
	function isSet(value) {
	  if (value == "" || value == null || value == "undefined") return false;
	
	  return true;
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

	function styleFunction(textMsg) {
	  return [
	    new ol.style.Style(
	    	{
		      image: new ol.style.Icon(({
		      	opacity: 0.55,
		        crossOrigin: 'anonymous',
		        scale: 1.5,
		        src: pos_icon_image
		      	}))
		      ,
		      text: new ol.style.Text({
		        font: '12px Calibri,sans-serif',
		        fill: new ol.style.Fill({ color: '#000' }),
		        stroke: new ol.style.Stroke({
		          color: '#fff', width: 2
		        }),
		        // get the text from the feature - `this` is ol.Feature
		        // and show only under certain resolution
		        text: textMsg
		      	})
	    	})
	  ];
	}
	
	function createNewIconFor2DMap(i, item) {
		var pos_icon = new ol.Feature({
	          geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng * 1, item.lat * 1])),
	          name: "lat: " + item.lat + ", lng: " + item.lng + ", alt: " + item.alt,
	          mindex : i
	      });
	
	  pos_icon.setStyle(styleFunction((i + 1) + ""));
	
	  return pos_icon;
	}

	function makeForFlightListMap(index, flat, flng) {
		var dpoint = ol.proj.fromLonLat([flng, flat]);
	
	  var c_view = new ol.View({
	      center: dpoint,
	      zoom: 14
	    });
	
	  var vSource = new ol.source.Vector();
	
	  var vVectorLayer = new ol.layer.Vector({
	      source: vSource,
	      zIndex: 10000,
	      style: new ol.style.Style({
	            fill: new ol.style.Fill({
	              color: 'rgba(255, 255, 255, 0.2)'
	            }),
	            stroke: new ol.style.Stroke({
	              color: '#ff0000',
	              width: 2
	            }),
	            image: new ol.style.Circle({
	              radius: 7,
	              fill: new ol.style.Fill({
	                color: '#ff0000'
	              })
	            })
	          })
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
		      target: 'map_' + index,
		      layers: [
		          bingLayer, vVectorLayer
		      ],
		      // Improve user experience by loading tiles while animating. Will make
		      // animations stutter on mobile or slow devices.
		      loadTilesWhileAnimating: true,
		      view: c_view
		    });
		
		  var icon = createNewIconFor2DMap(index, {lat:flat, lng:flng, alt:0});
		  vSource.addFeature(icon);
		
		  return vSource;
	}
			
	function setAddressAndCada(address_id, address, cada, wsource) {		 
		var _features = [];
		var _addressText = "";				
	
	  for(var idx=0; idx< cada.length; idx++) {
	    try{
	      var geojson_Feature = cada[idx];
	      var geojsonObject = geojson_Feature.geometry;
	
	      var features =  (new ol.format.GeoJSON()).readFeatures(geojsonObject);
	      for(var i=0; i< features.length; i++) {
	        try{
	          var feature = features[i];
	          feature["id_"] = geojson_Feature.id;
	          feature["properties"] = {};
	          for (var key in geojson_Feature.properties) {
	            try{
	              var value = geojson_Feature.properties[key];
	
	              if (_addressText == "" && key == "addr") {
	              	_addressText = value;
	              }
	
	              feature.values_[key] = value;
	              feature.properties[key] = value;
	            }catch (e){
	            }
	          }
	          _features.push(feature)
	        }catch (e){
	        }
	      }
	    }catch (e){
	    }
	  }
	
	
	  wsource.addFeatures(_features);
	
	  if (isSet($(address_id)))
	  	$(address_id).text(address);
	}

	function appendFlightListTable(item) {
		var name = item.name;
		var dtimestamp = item.dtime;
		var data = item.data;
		var flat = item.flat;
		var flng = item.flng;
		var address = item.address;
		var cada = item.cada;				
	
	  var appendRow = "<div class='service' id='flight-list-" + tableCount + "'><div class='row'><div class='col-md-6'><div id='map_" + tableCount + "' style='height:100px;width:100%;'></div>";	  		
	  appendRow = appendRow + "</div><div class='col-md-6'>";//row	  	  
		appendRow = appendRow
						+ "<a onclick='GATAGM(\"flight_list_public_title_click_"
						+ name + "\", \"CONTENT\", \""
						+ langset + "\");' href='/center/main.html?page_action=publicflightview_detail&record_name="
						+ encodeURIComponent(name) + "'>" + name + "</a><hr size=1 color=#eeeeee>";	
	
	  if (isSet(flat)) {
	  		appendRow = appendRow + "<span class='text-xs' id='map_address_" + tableCount + "'></span>";
	  }
	
	  appendRow = appendRow + "<br><span class='col-sm text-xs font-weight-bold mb-1'>" + dtimestamp + "</span>";	
		  
	  appendRow = appendRow + "</div></div></div>"; //col, row, service, 
	
	  $('#dataTable-Flight_list').append(appendRow);
	
		var curIndex = tableCount;							
		
		var retSource;
		if (isSet(flat)) {
	  	retSource = makeForFlightListMap(curIndex, flat, flng);
	  }
	
	  if (isSet(address) && address != "") {
	  	setAddressAndCada("#map_address_" + curIndex, address, cada, retSource);	  	
	  }	  
	
	  tableCount++;
	}
	
	function setFlightlistHistory(data) {
	  if (data == null || data.length == 0)
	    return;
	
	  data.forEach(function(item) {
	    appendFlightListTable(item);
	    flightRecArray.push(item);
	  });
	}
	
	function ajaxRequest(data, callback, errorcallback) {
    $.ajax({url : "https://api.droneplay.io/v1/",
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

	function getFlightList() {	  
	  var jdata = {"action": "public_record_list"};
	  	
	  showLoader();
	  ajaxRequest(jdata, function (r) {
	    hideLoader();
	    if(r.result == "success") {
	      if (r.data == null || r.data.length == 0) {
	        showAlert(LANG_JSON_DATA[langset]['msg_no_data']);
					hideLoader();
	        return;
	      }
		  
	      setFlightlistHistory(r.data);
				hideLoader();
	    }
	    else {
	    	if (r.reason == "no data") {
	    		showAlert(LANG_JSON_DATA[langset]['msg_no_data']);
	    	}
	    	else {
		    	showAlert(LANG_JSON_DATA[langset]['msg_error_sorry']);
		    }
	
				hideLoader();
	    }
	  }, function(request,status,error) {
	    hideLoader();	    
	  });
	}
	

	
	$(function(){
		mobileMenuOutsideClick();
		offcanvasMenu();
		burgerMenu();
		contentWayPoint();
		dropdown();
		owlCarousel();
		tabs();
		goToTop();
		loaderPage();				
		getFlightList();
	});


}());