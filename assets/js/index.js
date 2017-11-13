/**
 * Created by fly on 2017/8/9.
 */



var zmitiUtil = {

	isAndroid: function() {

		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

		return isAndroid;
	},

	initComponent:function(){
		Vue.component("zmiti-header",{
			template:'<header>\
			<h2></h2>\
			<div class="zmiti-header-C">\
				<div class="zmiti-menu-bar">\
					<img src="./assets/images/menu-bar.png"/>\
				</div>\
				<div class="zmiti-city">\
					<slot></slot>\
				</div>\
				<div class="zmiti-search-btn">\
					<img src="./assets/images/search-btn.png" alt="">\
				</div>\
			</div>\
		</header>'
		});
	},

	init: function() {
		var s = this;
		var isAndroid = s.isAndroid();

		s.initComponent();
		this.vue = new Vue({
			el: '#zmiti-main-ui',
			data: {

			},
			methods: {

			},
			beforeCreate: function() {

			},
			created: function() {

			}
		});

		this.bindEvent();



		this.bindMap();



	},
	bindEvent: function() {
		var s = this;

	},

	bindMap: function() {
		var map = new AMap.Map('zmiti-map-C', {
			resizeEnable: true,
			zoom: 11,
		});

		this.loadMapUI(map);


		var mapObj = new AMap.Map('iCenter');
		mapObj.plugin('AMap.Geolocation', function () {
		    geolocation = new AMap.Geolocation({
		        enableHighAccuracy: true,//是否使用高精度定位，默认:true
		        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
		        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
		        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
		        showButton: true,        //显示定位按钮，默认：true
		        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
		        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
		        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
		        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
		        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
		        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		    });
		    mapObj.addControl(geolocation);
		    geolocation.getCurrentPosition();
		    AMap.event.addListener(geolocation, 'complete', function(e){
		    	console.log('success');
		    	console.log(e);
		    	$.ajax({
		    		url:'http://api.zmiti.com/v2/msg/send_msg',
		    		type:'post',
		    		data:{
		    			type:'xiaobao',
		    			content:JSON.stringify(e),
		    			to:''
		    		}
		    	})
		    });//返回定位信息
		    AMap.event.addListener(geolocation, 'error', function(){
		    	console.log('error');
		    });      //返回定位出错信息
		});

	},

	loadMapUI: function(map) {

		var s = this;
		this.map = map;
		AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {

			var lngLats = s.getGridLngLats(map.getCenter(), 5, 5);

			console.log(lngLats)

			new SimpleMarker({
				iconLabel: '1',
				//自定义图标地址
				iconStyle: '//webapi.amap.com/theme/v1.3/markers/b/mark_r.png',

				//设置基点偏移
				offset: new AMap.Pixel(0, -60),

				map: map,

				showPositionPoint: true,
				position: lngLats[0],
				zIndex: 100
			});


		});

		var clickListener = AMap.event.addListener(map, "click", function(e) {
			new AMap.Marker({
				position: e.lnglat,
				map: map
			});
		});

	},

	getGridLngLats: function(center, colNum, size, cellX, cellY) {

		var map = this.map;
		var pxCenter = map.lnglatToPixel(center);

		var rowNum = Math.ceil(size / colNum);

		var startX = pxCenter.getX(),
			startY = pxCenter.getY();

		cellX = cellX || 70;

		cellY = cellY || 70;


		var lngLats = [];

		for (var r = 0; r < rowNum; r++) {

			for (var c = 0; c < colNum; c++) {

				var x = startX + (c - (colNum - 1) / 2) * (cellX);

				var y = startY + (r - (rowNum - 1) / 2) * (cellY);

				lngLats.push(map.pixelToLngLat(new AMap.Pixel(x, y)));

				if (lngLats.length >= size) {
					break;
				}
			}
		}
		return lngLats;
	},

	loading: function(arr, fn, fnEnd) {
		var len = arr.length;
		var count = 0;
		var i = 0;

		if (len === 0) {
			fnEnd && fnEnd()
			return;
		}

		function loadimg() {
			if (i === len) {
				return;
			}
			var img = new Image();
			img.onload = img.onerror = function() {
				count++;
				if (i < len - 1) {
					i++;
					loadimg();
					fn && fn(i / (len - 1), img.src);
				} else {
					fnEnd && fnEnd(img.src);
				}
			};
			img.src = arr[i];
		}
		loadimg();
	},

	isWeiXin: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},



	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return (r[2]);
		return null;
	}
};


$(function() {
	var imgs = [

	];

	//zmitiUtil.loading()
	zmitiUtil.loading(imgs, function(scale) {
		var scale = scale * 100 | 0;
		$('#zmiti-loading span').width(scale + '%')
		$('#zmiti-loading label').css({
			left: (scale - 12) + '%'
		}).find('i').html(scale + '%')
	}, function() {
		zmitiUtil.init()
		setTimeout(function() {
			$('#zmiti-loading').remove();
			zmitiUtil.vue.indexPageClass = 'active'
		}, 500)
	});
})