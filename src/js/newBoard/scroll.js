//
//$(function(){
//	var listItem = "";
//	for(var i = 0; i < 12; i++){
//		listItem += '<ul>'+
//						'<li>上海（常）</li>'+
//						'<li>153000</li>'+
//						'<li>78%</li>'+
//					'</ul>'
//	}
//	$(".usableWareList .list").html(listItem);
//	
//	var listItem1 = "";
//	for(var i = 0; i < 12; i++){
//		listItem1 += '<ul>'+
//						'<a href="vehicleInfo.html">'+ 
//							'<li>上海（卖场）</li>'+
//							'<li>220</li>'+
//						'</a>'+
//					'</ul>'
//	}
//	$(".carLocationList .list").html(listItem1);
//	
//	var listItem2 = "";
//	for(var i = 0; i < 20; i++){
//		listItem2 += '<ul>'+
//						'<li>上海（卖场）</li>'+
//						'<li>220</li>'+
//					'</ul>'
//	}
//	$(".todayOrderList .list").html(listItem2);
//	var scrollFun = function(container,showTime,scrollTime){
//		this.timer = null;
//		this.showTime = showTime; 
//	    this.container = $("."+container);
//		var divChild = $("."+container).children(".list");
//		var divNode = divChild.eq(0);
//		var rectHei = divNode.height();
//		//console.log(rectHei);
//		var divNodeCopy = divNode.clone(true);
//		divNodeCopy.css({
//			"top": rectHei+"px"
//		})
//		this.container.append(divNodeCopy);
//		var that = this; 
//		var scrollView = function(){
//			var oldTop = (divChild.css("top") == "") ? 0 : parseInt(divChild.css("top"));
//			if(oldTop < -rectHei){
//				oldTop = 0;
//			}
//			
//			divNode.css({
//				"top": (oldTop - 1) + "px"
//			})
//			divNodeCopy.css({
//				"top": (oldTop + rectHei - 1)+"px"
//			})
//			that.timer = setTimeout(scrollView, that.showTime); 
//		}
//		this.timer = setTimeout(scrollView, that.showTime); 
//		this.container.hover(function(){
//			clearTimeout(that.timer);
//		},function(){
//			that.timer = setTimeout(scrollView, that.showTime); 
//		})
//	}
//	
//	var s1 = new scrollFun('usableWareList', 50, 0); 
//	var s3 = new scrollFun('todayOrderList', 50, 0); 
//})
