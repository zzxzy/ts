$(function() {
    //获取点击歌曲ID
    var idSongClick = "";
    //获取点击歌曲名字
    var nameSongClick = "";
    //获取点击歌曲演唱者
    var SongClick = "";
    //获取点击歌曲url
    var urlSongClick = "";
    //获取点击歌曲图片picUrl
    var picUrlSongClick = "";
    //旋转定时器
    var timer = null;
    //播放状态
    var songState = false;
    //旋转角度
    var num = 0;

    //获取推荐歌单
    $.ajax({
        type: "GET", //请求的方式
        url: "http://localhost:3000/personalized?limit=9", //请求的url地址
        //要提交给服务器的数据
        success: function(res) {
            // console.log(res);
            var h = "";
            $.each(res.result, function(index, item) {
                h += `<li><img src="${res.result[index].picUrl}" alt="" /><span>${res.result[index].name}</span></li>`;
            });
            $(".ulRecSong").empty().append(h);
        },
        error: function() {
            alert("网络有错误哦~");
        },
    });

    //获取最新音乐
    $.ajax({
        type: "GET", //请求的方式
        url: "http://localhost:3000/personalized/newsong?limit=10", //请求的url地址
        //要提交给服务器的数据
        success: function(res) {
            // console.log(res);
            var song = "";
            $.each(res.result, function(index, item) {
                song += `<li><p class="pNewSong">${res.result[index].name}</p>
                <p class="pNewArt">${res.result[index].song.artists[0].name} - ${res.result[index].name}</p>
                <a class="iconfont icon-boshiweb_bofang spanStart" href="javascript:;" id="${res.result[index].id}"></a></li>`;
            });
            $(".ulNewSong").empty().append(song);
        },

    });

    //点击获取播放地址
    $(".ulNewSong").on("click", $(".spanStart"), function(e) {
        if (e.target.id != "") {
            //获取点击歌曲id
            idSongClick = e.target.id;
            console.log(idSongClick);
            //获取点击歌曲url
            $.ajax({
                type: "GET", //请求的方式
                url: `http://localhost:3000/song/url?id=${idSongClick}`, //请求的url地址
                //要提交给服务器的数据
                success: function(res) {
                    //获取点击歌曲url
                    urlSongClick = res.data[0].url;
                    console.log(urlSongClick);
                    $('#ms').attr('src', urlSongClick)
                        // console.log(res.data[0].url);
                        // console.log(res);
                },
                error: function() {
                    alert("出错了");
                },
            });

            //获取点击歌曲图片
            $.ajax({
                type: "GET", //请求的方式
                url: `http://localhost:3000/song/detail?ids=${idSongClick}`, //请求的pic地址
                //要提交给服务器的数据
                success: function(res) {
                    console.log(res);

                    //获取点击歌曲图片picUrl
                    picUrlSongClick = res.songs[0].al.picUrl;
                    //获取点击歌曲名字
                    nameSongClick = res.songs[0].name;
                    //获取点击歌曲演唱者
                    SongClick = res.songs[0].ar[0].name;

                    //点击歌曲详情替换
                    //图片
                    $(".divPlay .songPic").css(
                        "background-image",
                        `url(${picUrlSongClick})`
                    );
                    //歌曲名字-演唱者
                    $(".divPlay .songName").html(`${nameSongClick}-${SongClick}`);
                },
                error: function() {
                    alert("出错了");
                },
            });
            //点击后播放页面滑下
            $(".divPlay").stop().slideDown().css("top", 0);
        }

        //播放页面
        //点击退出按钮播放页面滑上
        $(".divPlay .aEnd").on("click", function() {
            $(".divPlay").stop().slideUp().css("top", 0);
            clearInterval(timer);
            $(".divPlay .icon-boshiweb_bofang").css("display", "block");
            songState = false;
        });
        //点击播放按钮播放音乐
        $(".divPlay .icon-boshiweb_bofang").on("click", function() {
            $(".divPlay .songPic").css("transform", `rotateZ(-${num}deg)`);
            num = 0;
            if (!songState) {
                $(this).css("display", "none");
                timer = null;
                timer = setInterval(function() {
                    num++;
                    $(".divPlay .songPic").css("transform", `rotateZ(${num}deg)`);
                }, 20);
                songState = true;
            }
        });
        //点击播放图片暂停音乐
        $(".divPlay .songPic").on("click", function() {
            if (songState) {
                clearInterval(timer);
                $(".divPlay .icon-boshiweb_bofang").css("display", "block");
                songState = false;
            }
        });
    });
});