function render(tpl, data) {
  var source = $('#' + tpl + '-template').html();
  var template = Handlebars.compile(source);
  return template(data);
};

function getTopPath() {
  return location.hash.split('/')[0].substring(2);
};

function listRouter(order) {
  order = order || 0;
  var topPath = getTopPath();
  var html = render('header');
  qwest
    .get('./qna/json/'+ topPath +'.json')
    .then(function(list) {
      $.each(list, function(index, item) {
        item.a = marked(item.a);
        item.q = marked(item.q);
      })
      var list_html = render('list', {
        list: list,
        topPath: topPath,
        length: list.length - 1
      });
      html += list_html;

      $('#output').html(html);
      $('.item-' + order).show();
    })


};

function moreRouter() {
  var html = render('header') + render('more');
  $('#output').html(html);
};

$(function() {

  $('body')
    .on('click', '.toggleAnswer', function() {
      var el = $(this).parent().parent().find('.item-a');
      var open = el.data('open');
      if (!open) {
        el.removeClass('animated fadeOutUp').addClass('animated fadeInUp');
        el.data('open', true);
      } else {
        el.removeClass('animated fadeInUp').addClass('animated fadeOutUp');
        setTimeout(function() {
          el.removeClass('animated');
        }, 600);
        el.data('open', false);
      }

    })



  Q.reg('home', function() {
      $('#output').html(render('home', {}));
    })
    .reg('html', listRouter)
    .reg('css', listRouter)
    .reg('javascript', listRouter)
    .reg('more', moreRouter)

  Q.init({
    index: 'home'
  });

});
