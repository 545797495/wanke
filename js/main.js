/*自适应屏幕宽度的js代码 */
(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      //docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
      if (clientWidth <= 750) {
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
      } else {
        docEl.style.fontSize = 100 + 'px';
        docEl.style.width = 750 + 'px';
        docEl.style.margin = '0 auto';
      }
    };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
/*下拉*/
function dropMenu(bindtag, etag, draptag) {
  $(bindtag).on('click', etag, function(e) {
    e.stopPropagation();
    var tagli = $(this).parent();
    if (tagli.hasClass('cur')) {
      tagli.removeClass('cur');
      $('#mask').hide();
      $(bindtag).removeClass('re');
      $(bindtag).siblings('.search-outdiv').removeClass('re');
    } else {
      tagli.addClass('cur').siblings().removeClass('cur');
      $('#mask').show();
      $(bindtag).addClass('re');
      $(bindtag).siblings('.search-outdiv').addClass('re');
    }
  });

  $('body').on('click', function(e) {
    var el = $(e.target).closest(draptag);
    !el.length && $(bindtag).children().removeClass('cur');
    if (!el.length) {
      $('#mask').hide();
      $(bindtag).removeClass('re');
      $(bindtag).siblings('.search-outdiv').removeClass('re');
    }
  });
};
/*下拉*/
/*sroll*/
var myScroll;
var el;
var pullUpEl;
var pullUpOffset;
var generatedCount = 0;

function loaded(arg, btop) {
  var top = $("#srollerdiv").offset().top;
  var h = $(window).height() - top - btop;
  $("#srollerdiv").height(h);
  pullUpEl = document.getElementById('pullUp');
  pullUpOffset = pullUpEl.offsetHeight;
  myScroll = new iScroll('srollerdiv', {
    useTransition: true,
    onRefresh: function() {
      if (pullUpEl.className.match('loading')) {
        pullUpEl.className = '';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多';
      }
    },
    onScrollMove: function() {
      if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
        pullUpEl.className = 'flip';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新';
        this.maxScrollY = this.maxScrollY;
      } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
        pullUpEl.className = '';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多';
        this.maxScrollY = pullUpOffset;
      }
    },
    onScrollEnd: function() {
      if (pullUpEl.className.match('flip')) {
        pullUpEl.className = 'loading';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
        arg.done(arg.el);
      }
    }
  });
  setTimeout(function() {
    document.getElementById('srollerdiv').style.left = '0';
  }, 800);
}

/*dialog*/
function dialog(opts) {
    var mask = $('<div class="mask" style="display:block"></div>');
    var content = $('<div class="maskContent"></div>');
    var dialogBody = $('<div class="dialog-body">' + opts.content + '</div>');
    var destoryDialog = function() {
      mask.remove();
    }
    content.append(dialogBody);

    if (opts.buttons) {
      var btbox = $('<div class="bt-box tc clearfix"></div>');
      $.each(opts.buttons, function(idx, button) {
        var btn = $('<a class="' + button.myClassName + '">' + button.text + '</a>');
        btn.on('click', function() {
          if (!$.isFunction(button.callback)) {
            destoryDialog();
          } else {
            button.callback(destoryDialog);
          }
        });
        btbox.append(btn);
      });
      content.append(btbox);
    }
    mask.append(content);
    $('body').append(mask);
    $.isFunction(opts.onAfterShow) && opts.onAfterShow();
    return mask;
  }
  /*选择金额*/

function paycount(eltag, counttag, count) {
    $(eltag).on('click', 'li', function() {
      // alert($(this).children('a').text());
      if ($(this).hasClass('cur')) {
        $(this).removeClass('cur');
        $(counttag).val('');
      } else {
        $(this).addClass('cur').siblings().removeClass('cur');
        $(counttag).val($(this).find(count).text());
      }

    });
    $(counttag).on('focus', function() {
      $(eltag).children('li').removeClass('cur');
      $(counttag).val('');
    })
  }
  /*滚屏装载数据*/
  /*加载数据方法*/

function loadData(opts) {
  /*datas.list要改成后台api定义的数据属性名*/
  /*$.ajax({
    url: opts.url,
    type: 'get',
    cache: false,
    data: $.extend({
      pageNum: pageNum++
    }, opts.params)
  }).done(function(datas) {*/
  var datamsg = datas.list;
  if (datamsg && datamsg.length) {
    $('#pullUp').show();
    $.each(datamsg, function(idx, obj) {
      var gethtml = getList(obj);
      $(opts.container).append(gethtml);
    });
    myScroll.refresh();
  } else {
    $('#pullUp').hide();
    $(opts.container).append('<p class="tc list-tip">抱歉，没有找到符合项目</p>');
  }
  //});
}