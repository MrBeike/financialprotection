/**
 * Created by fly on 2017/8/9.
 */



var zmitiUtil = {

	isAndroid: function() {

		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

		return isAndroid;
	},
	init: function() {
		var s = this;
		var isAndroid = s.isAndroid();
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