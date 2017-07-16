if (typeof classobj == "undefined")
    classobj = {};

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady, false);

    classobj.category = function (name, barcode, qrcode, category, url) {
        this.name = name;
        if (barcode != null)
            this.barcode = barcode;
        if (qrcode != null)
            this.qrcode = qrcode;
        this.category = category;
        this.url = url;
    }
    classobj.category.list = [];
    classobj.category.searchBarcode = function (code) {
        if ($("#search input[data-type='search']").size() < 1)
            return;
        $("#search input[data-type='search']").get(0).value = "";
        for (var i = 0; i < classobj.category.list.length; i++) {
            if (typeof classobj.category.list[i].barcode != "undefined" && classobj.category.list[i].barcode == code) {
                $("#search input[data-type='search']").get(0).value = classobj.category.list[i].name;
                break;
            }
            if (typeof classobj.category.list[i].qrcode != "undefined" && classobj.category.list[i].qrcode == code) {
                $("#search input[data-type='search']").get(0).value = classobj.category.list[i].name;
                break;
            }
        }
        $("#SearchBox").listview("refresh");
    }

    function InfoCImg() {
        var i = parseInt($(this).attr("cid"));
        if (i < 0 || i >= classobj.category.list.length)
            return;
 
        var url = classobj.category.list[i].url;
        if (typeof url != "undefined" && url.length > 0)
            InfoImg(url);
        $("#infourl").click();
    }

    function LoadSearchBox() {
        var list = [];
        list.push(new classobj.category("寶礦力水得運動飲料", "4716426880619", null, "寶特瓶", ""));
        list.push(new classobj.category("舒跑運動飲料", "4710421090059", null, "寶特瓶", "1"));
        list.push(new classobj.category("埔鯉竹炭水", "4712907000422", null, "寶特瓶", ""));
        list.push(new classobj.category("Visual Studio 2015 X Cordova跨平台App實戰特訓班", "9789863479703", null, "紙(報紙)", ""));
        list.push(new classobj.category("泰山純水", "47100959115603", null, "寶特瓶", "3"));
        list.push(new classobj.category("Qgontoh抹茶糖", "4901072250088", null, "塑膠", "2"));
        list.push(new classobj.category("普拿疼膜衣錠外殼", "4716521010010", null, "紙類(紙箱)", "5"));
        list.push(new classobj.category("愛之味薏仁寶", "4710626577713", null, "...", "4"));

        classobj.category.list = list;

        $("#SearchBox").hide();
        $("#SearchBox").html("");
        for (var i = 0; i < classobj.category.list.length; i++) {
            $("#SearchBox").append("<li cid='"+i+"' temp='LoadSearchBox'>" + classobj.category.list[i].name + "<span class=\"ui-li-count\">" + classobj.category.list[i].category + "</span></li>");
            var temp = $("[temp='LoadSearchBox']");
            temp.removeAttr("temp");
            temp.on("click", InfoCImg);
        }
        $("#SearchBox").show();
        $("#SearchBox").listview("refresh");
    }

    function scan() {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                classobj.category.searchBarcode(result.text);
            }, function (error) {
                alert("掃描失敗：" + error)
            }
        );
    }

    if (typeof classobj.recycle == "undefined")
        classobj.recycle = {};

    function searchLocation() {
        classobj.recycle.place = ["嘉義市東區後湖里保忠一街138號",
            "嘉義市南京路352號",
            "嘉義市世賢路3段與重慶路口",
            "嘉義市博愛路一段116號",
            "嘉義市自由路72- 1號",
            "嘉義市玉山路與大富路口",
            "嘉義市青年街與老吸街口",
            "嘉義市大溪路99號旁",
            "嘉義市世賢路一段下埤段47地號",
            "嘉義市國城三街41號對面",
            "嘉義市興安街9號",
            "嘉義市保康路180號隔壁",
            "嘉義市盧厝86號",
            "嘉義市義教東路47號",
            "嘉義市世賢路一段312號",
            "嘉義市金山路與永康一街口",
            "嘉義市大同路531號",
            "嘉義市北興街343號",
            "嘉義市保安一路265號",
            "嘉義市新榮路79號",
            "嘉義市博東路18號",
            "嘉義市大溪路250號",
            "嘉義市太平段34- 2號",
            "嘉義市仁愛路142之11號",
            "嘉義市文化路1146之1號",
            "嘉義市世賢路4段149號",
            "嘉義市福嘉街2號",
            "嘉義市興業新村40號",
            "嘉義市東區盧厝85- 4號",
            "嘉義市北港路1277之9號",
            "嘉義市四維路46號",
            "嘉義市下埤里下埤1之5號"];
        classobj.recycle.place.finishsearch = false;
        classobj.recycle.place.loopnum = 0;
        classobj.recycle.place.str = "";
        //window.setTimeout(searchLocationLoop, 50);
    }

    classobj.recycle.location = function (rid, address, lat, lng, name, phone) {
        this.rid = rid;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.name = name;
        this.phone = phone;
    }

    function searchLocationLoop() {
        if (classobj.recycle.place.loopnum >= classobj.recycle.place.length) {
            classobj.recycle.place.finishsearch = true;
            console.log(classobj.recycle.place.str);
            return;
        }
        var i = classobj.recycle.place.loopnum;
        $.ajax({
            url: "http://maps.googleapis.com/maps/api/geocode/json",
            type: "GET",
            data: {
                address: classobj.recycle.place[classobj.recycle.place.loopnum],
                sensor: "false",
            },
            dataType: "json",
            success: function (Jdata) {
                if (Jdata.results.length > 0) {
                    //console.log(Jdata.results[0].formatted_address);
                    classobj.recycle.place.str += "classobj.recycle.location.list.push(new classobj.recycle.location(" + (i + 1) + ",\"" + classobj.recycle.place[i] + "\"," + Jdata.results[0].geometry.location.lat + "," + Jdata.results[0].geometry.location.lng + "));\r\n";
                }
            },

            error: function () {
                alert("ERROR!!!");
            }
        });
        classobj.recycle.place.loopnum++;
        window.setTimeout(searchLocationLoop, 1000);
    }

    function searchLocation2() {
        classobj.recycle.location.list = [];
        classobj.recycle.location.list.push(new classobj.recycle.location(1, "嘉義市東區後湖里保忠一街138號", 23.5128443, 120.4524938, "鈺昌環保有限公司", "05-2787898 0910-679019"));
        classobj.recycle.location.list.push(new classobj.recycle.location(2, "嘉義市南京路352號", 23.4630019, 120.4363493, "南京商行", "05-2361017"));
        classobj.recycle.location.list.push(new classobj.recycle.location(4, "嘉義市博愛路一段116號", 23.490134, 120.450197, "宏昌商行", "05-2771588"));
        classobj.recycle.location.list.push(new classobj.recycle.location(5, "嘉義市自由路72- 1號", 23.4863769, 120.4403144, "千祥商行", "05-2321119 0956-553022"));
        classobj.recycle.location.list.push(new classobj.recycle.location(6, "嘉義市玉山路與大富路口", 23.4747874, 120.4379164, "文金商行", "05-2842561"));
        classobj.recycle.location.list.push(new classobj.recycle.location(7, "嘉義市青年街與老吸街口", 23.4712071, 120.436018, "和昌企業社", "05-2361502"));
        classobj.recycle.location.list.push(new classobj.recycle.location(11, "嘉義市興安街9號", 23.4607792, 120.4491949, "鴻昌行", "05-2281349"));
        classobj.recycle.location.list.push(new classobj.recycle.location(13, "嘉義市盧厝86號", 23.4863883, 120.4832025, "蘭潭電器行", "05-2778521"));
        classobj.recycle.location.list.push(new classobj.recycle.location(14, "嘉義市義教東路47號", 23.492923, 120.4687405, "鑫丞商行", "05-2774011 0912-008523"));
        classobj.recycle.location.list.push(new classobj.recycle.location(15, "嘉義市世賢路一段312號", 23.4949787, 120.4384967, "星億商行", "0910-787806"));
        classobj.recycle.location.list.push(new classobj.recycle.location(17, "嘉義市大同路531號", 23.4757352, 120.4213687, "毅昱有限公司", "05-2368589、0989-834973 fax：05-2368299"));
        classobj.recycle.location.list.push(new classobj.recycle.location(18, "嘉義市北興街343號", 23.4865923, 120.4363306, "佳明商行", "05-2326307"));
        classobj.recycle.location.list.push(new classobj.recycle.location(19, "嘉義市保安一路265號", 23.4928964, 120.4342986, "銘冠資源回收", "05-2335630"));
        classobj.recycle.location.list.push(new classobj.recycle.location(20, "嘉義市新榮路79號", 23.4719768, 120.4448663, "東利號", "05-2287537"));
        classobj.recycle.location.list.push(new classobj.recycle.location(21, "嘉義市博東路18號", 23.4906296, 120.4618941, "明曜資源回收", "0919-168630 0922-896882"));
        classobj.recycle.location.list.push(new classobj.recycle.location(22, "嘉義市大溪路250號", 23.4835348, 120.4109466, "久大", "05-2287979 05-2383479 0932-712679"));
        classobj.recycle.location.list.push(new classobj.recycle.location(23, "嘉義市太平段34- 2號", 23.4902669, 120.4523628, "維成企業社", "05-2756609 0960-403888"));
        classobj.recycle.location.list.push(new classobj.recycle.location(24, "嘉義市仁愛路142之11號", 23.4663515, 120.4428757, "仁愛回收場", "05-2842146 0933117333"));
        classobj.recycle.location.list.push(new classobj.recycle.location(25, "嘉義市文化路1146之1號", 23.488862, 120.4466505, "利協潤企業社", "0920-972956"));
        classobj.recycle.location.list.push(new classobj.recycle.location(26, "嘉義市世賢路4段149號", 23.4621956, 120.4466681, "厚鑫商行", "05-2362227 0915-361869"));
        classobj.recycle.location.list.push(new classobj.recycle.location(27, "嘉義市福嘉街2號", 23.4770405, 120.4323581, "詠錩企業社", "05-2319572 0919-851066"));
        classobj.recycle.location.list.push(new classobj.recycle.location(28, "嘉義市興業新村40號", 23.4694239, 120.4551509, "田仔資源回收站", "0912-889751"));
        classobj.recycle.location.list.push(new classobj.recycle.location(29, "嘉義市東區盧厝85- 4號", 23.478862, 120.482816, "姿沿商行", "0922-968579 0933-682783"));
        classobj.recycle.location.list.push(new classobj.recycle.location(30, "嘉義市北港路1277之9號", 23.4904847, 120.4012407, "咏泰環保有限公司", "05-2379955"));
        classobj.recycle.location.list.push(new classobj.recycle.location(31, "嘉義市四維路46號", 23.4779819, 120.4253283, "關哲誠", "0926-017741"));
        classobj.recycle.location.list.push(new classobj.recycle.location(32, "嘉義市下埤里下埤1之5號", 23.493008, 120.408706, "威猛資源回收", "0985-288311"));
    }
    searchLocation2();

    var lat, lng;
    var gmap;
    var map_div;
    var watchID;

    function watchPosition1() {
        watchPosition3();
        /*
        document.getElementById("map_div").innerHTML = "請稍待...";
        watchID = navigator.geolocation.watchPosition(watchPosition2, watchPositionError, { timeout: 30000 });
        navigator.geolocation.clearWatch(watchID);
        */
    }

    function watchPositionError(error) {
        document.getElementById("map_div").innerHTML = "錯誤";
    }

    function watchPositionDeBug() {
        lat = 23.5128443;
        lng = 120.4524938;
        // 移到目前定位點
        map_div = document.getElementById("map_div");
        var latlng = new google.maps.LatLng(lat, lng); //取得目前定位點
        var latlng2 = new google.maps.LatLng(23.4630019, 120.4363493);
        gmap = new google.maps.Map(map_div, {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        // 建立地標
        var marker = new google.maps.Marker({
            position: latlng,
            icon: "images/myicon.png",
            map: gmap,
            title: "集合地點"
        });
        var marker2 = new google.maps.Marker({
            position: latlng2,
            icon: "images/myicon.png",
            map: gmap,
            title: "集合地點2"
        });
    }

    function watchPosition3(pos) {
        // 移到目前定位點
        lat = 23.5128443;
        lng = 120.4524938;
        map_div = document.getElementById("map_div");
        var latlng = new google.maps.LatLng(lat, lng);
        //var marker;
        gmap = new google.maps.Map(map_div, {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        /*
        var latlng2 = new google.maps.LatLng(23.5128443, 120.4524938);
        var marker = new google.maps.Marker({
            position: latlng2,
            icon: "images/marker.png",
            map: gmap,
            title: "集合地點"
        });
        */
        var marker;
        for (var i = 0; i < classobj.recycle.location.list.length; i++) {
            console.log(i);
            latlng = new google.maps.LatLng(classobj.recycle.location.list[i].lat, classobj.recycle.location.list[i].lng);
            marker = new google.maps.Marker({
                position: latlng,
                icon: "images/marker.png",
                map: gmap,
                title: "回收場"
            });
            google.maps.event.addListener(marker, "click", function (event) {
                alert(
                    "名稱: " + classobj.recycle.location.list[i].name + "\n" +
                    "地址: " + classobj.recycle.location.list[i].address + "\n" +
                    "聯絡方式: " + classobj.recycle.location.list[i].phone + "\n");
            })
        }
    }

    function watchPosition2(pos) {
        // 移到目前定位點
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        document.getElementById("map_div").innerHTML = "已取得現在位置" + lat + "," + lng;
        lat = 23.5128443;
        lng = 120.4524938;
        map_div = document.getElementById("map_div");
        var latlng = new google.maps.LatLng(lat, lng);
        //var marker;
        gmap = new google.maps.Map(map_div, {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        /*
        var latlng2 = new google.maps.LatLng(23.5128443, 120.4524938);
        var marker = new google.maps.Marker({
            position: latlng2,
            icon: "images/marker.png",
            map: gmap,
            title: "集合地點"
        });
        */
        var marker;
        for (var i = 0; i < classobj.recycle.location.list.length; i++) {
            console.log(i);
            latlng = new google.maps.LatLng(classobj.recycle.location.list[i].lat, classobj.recycle.location.list[i].lng);
            marker = new google.maps.Marker({
                position: latlng,
                icon: "images/marker.png",
                map: gmap,
                title: "回收場"
            });
            google.maps.event.addListener(marker, "click", function (event) {
                alert(
                    "名稱: " + classobj.recycle.location.list[i].name + "\n" +
                    "地址: " + classobj.recycle.location.list[i].address + "\n" + 
                    "聯絡方式: " + classobj.recycle.location.list[i].phone + "\n");
            })
        }
    }

    function LoadFinish() {
        $("#initfinish").click();
    }

    function HomeUIClick() {
        var Element1 = $(this);
        Element1.off("click");
        var Element2 = Element1.find("a");
        if (Element2.size() > 0) {
            $(Element2.get(0)).click();
        }
        Element1.on("click", HomeUIClick);
    }

    function InfoImg(url) {
        $("#info-content").css("background-image", "url(../images/"+url+".jpg)");
    }

    function InfoResize() {
        var i = $(window).height() - $("#info div[data-role='header']").height() - 4;
        if (i > 0)
            $("#info-content").css("height", i);
    }

    function onDeviceReady() {
        // 處理 Cordova 暫停與繼續事件
        document.addEventListener( 'pause', onPause, false );
        document.addEventListener( 'resume', onResume, false );
        
        // TODO: Cordova 已載入。請在這裡執行任何需要 Cordova 的初始化作業。
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        $("#deviceready").click(LoadFinish);
        $(".home-center-ui td").on("click", HomeUIClick);
        LoadFinish();
        $("#SearchCode").on("click", scan);
        $("#btn_showmap").on("click", watchPosition1);
        window.setInterval(InfoResize, 20);
        LoadSearchBox();
    };

    function onPause() {
        // TODO: 這個應用程式已暫停。請在這裡儲存應用程式狀態。
    };

    function onResume() {
        // TODO: 這個應用程式已重新啟動。請在這裡還原應用程式狀態。
    };
} )();