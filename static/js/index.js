// 张海瑞 - zhanghairui.com
var aMusicData = [
    { 'thumbnail': 'static/images/1.jpg', 'music': 'music/1.m4a', 'title': '林肯公园 In The End', 'href': '1.html', 'singer': '林肯公园', 'song': 'In The End' },
    { 'thumbnail': 'static/images/2.jpg', 'music': 'music/2.m4a', 'title': '张靓颖 终于等到你', 'href': '2.html', 'singer': '张靓颖', 'song': '终于等到你' },
    { 'thumbnail': 'static/images/3.jpg', 'music': 'music/3.m4a', 'title': '蔡健雅 Beautiful Love', 'href': '3.html', 'singer': '蔡健雅', 'song': 'Beautiful Love' },
    { 'thumbnail': 'static/images/music.jpg', 'music': 'music/4.mp3', 'title': '一首写给她的歌（电音版）', 'href': '4.html', 'singer': '徐梦园', 'song': '一首写给她的歌（电音版）' }
];

/**
 * 音乐播放器
 */
(function() {
    var oAudio = null;
    var now = 2; // 当前播放第几首歌
    var bPlay = false; // 是否播放 true播放 false暂停
    var nVolume = 1; // 当前音量
    var oNextBtn = $('#j-next-btn');
    var oPrevBtn = $('#j-prev-btn');
    var oPlayPauseBtn = $('#j-play-pause-btn');

    _createAudio();

    // 播放暂停
    oPlayPauseBtn.click(function() {
        bPlay = !bPlay;
        _doPlay();
    });

    // 上一曲
    oPrevBtn.click(function() {
        now--;
        now = (now % aMusicData.length + aMusicData.length) % aMusicData.length;

        _createAudio();
        bPlay = true;
        _doPlay();
    });

    // 下一曲
    oNextBtn.click(function() {
        now++;
        now %= aMusicData.length;

        _createAudio();
        bPlay = true;
        _doPlay();
    });

    // 静音
    var oVolume = $('#j-volume');
    oVolume.click(function() {
        if ($(this).hasClass('btn-volume-muted')) {
            // 恢复音量
            $(this).removeClass('btn-volume-muted');
            oAudio[0].volume = nVolume = 1;
        } else {
            // 静音
            $(this).addClass('btn-volume-muted');
            oAudio[0].volume = nVolume = 0;
        }
    });

    // 创建对应的audio
    function _createAudio() {
        oAudio && oAudio.remove();
        var sSrc = aMusicData[now].music;
        oAudio = $(`
			<audio id="j-audio" controls>
				<source src="` + sSrc + `">
			</audio>
		`);
        oAudio.appendTo('body');
        oAudio[0].volume = nVolume;
        _modifiedSongInfo();
    }

    // 控制播放，更换播放暂停按钮图标
    function _doPlay() {
        if (bPlay) {
            // 播放
            oPlayPauseBtn.removeClass('play-btn').addClass('pause-btn');
            oAudio[0].play();
            bPlay = true;
        } else {
            // 暂停
            oPlayPauseBtn.addClass('play-btn').removeClass('pause-btn');
            oAudio[0].pause();
            bPlay = false;
        }
    }

    // 更换图片、歌手、歌名
    function _modifiedSongInfo() {
        // 换图
        $('#j-thumbnail-box').html(`
			<a href="${aMusicData[now].href}">
				<img src="${aMusicData[now].thumbnail}" width="32" height="32" alt="${aMusicData[now].title}" title="${aMusicData[now].title}">
			</a>
		`);

        // 换文字
        $('#j-song-box').html(`
			<a href="${aMusicData[now].href}" class="singer left" title="${aMusicData[now].singer}">${aMusicData[now].singer}</a>
			<a href="${aMusicData[now].href}" class="song left" title="${aMusicData[now].song}">${aMusicData[now].song}</a>
			<a href="${aMusicData[now].href}" class="btn btn-link left">链接</a>
		`);

        // 总时长
        oAudio.on('loadedmetadata', function() {
            var nDuration = Math.floor(oAudio[0].duration);
            var m = _toDub(Math.floor(nDuration / 60));
            var s = _toDub(nDuration % 60);
            $('#j-duration').html(m + ':' + s);
        });

        // 当前播放时间
        var oNow = $('#j-now');
        var oCurrent = $('#j-current');

        oNow.html('00:00');
        oCurrent.css('width', '0%');
        oAudio.on('play', function() {
            oAudio[0].timer = setInterval(function() {
                var m = _toDub(Math.floor(oAudio[0].currentTime / 60));
                var s = _toDub(Math.floor(oAudio[0].currentTime % 60));
                oNow.html(m + ':' + s);
                var scale = oAudio[0].currentTime / oAudio[0].duration * 100;
                oCurrent.css('width', scale + '%');
            }, 1000);
        }).on('ended', function() {
            var nDuration = Math.floor(oAudio[0].duration);
            var m = _toDub(Math.floor(nDuration / 60));
            var s = _toDub(nDuration % 60);
            oNow.html(m + ':' + s);
            oCurrent.css('width', '100%');
            clearInterval(oAudio[0].timer);
        });

        // 换加载进度（先不做）
    }

    function _toDub(n) {
        return n < 10 ? '0' + n : '' + n;
    }
})();
