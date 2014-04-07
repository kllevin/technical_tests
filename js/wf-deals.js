$(function() {
  var nav = $("#nav");
  var hamburger = $("#hamburger");

  $.ajax ({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/centre/master/states.json',
    data: {
      country: 'au'
    },
    success: function(data) {
      var search = $('#search');
      var sub = $('.nav-wrap sub');

      $.each(data, function(i, state) {
        var li = $('<li/>');
        var anchor = $('<a/>')
          .attr('href', '')
          .text(state.abbreviation)
          .click(function(e) {
            e.preventDefault();
            nav.find('li').removeClass('selected');
            li.addClass('selected');
            sub.text(state.name);
            buildContent(state);
            nav.removeClass('open');
          });

        li.append(anchor);
        search.before(li);
      });

      //Set first nav item to selected
      nav.find('li:first-of-type a').click();
    }
  });

  $(document).click(function(e) {
    var navOpen = nav.hasClass('open');

    if (navOpen && e.target.id !== 'nav' && !$(e.target).parents('#nav').length) {
      nav.removeClass('open');
    } else if (!navOpen && e.target.id === 'hamburger') {
      nav.addClass('open');
    }
  })
});

//Build accordion and fill in with centre by state
function buildContent(state) {
  $.ajax({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/centre/master/centres.json?',
    data: {
      state: state.abbreviation
    },
    success: function(data) {
      var accordion = $('#accordion').empty();

      //use no deals message for no centre in a state
      if (!data || data.length === 0) {
        accordion.append(
          $('#noDeals')
            .clone()
            .removeAttr('id')
            .removeClass('hide')
        );
        return;
      }

      $.each(data, function(i, centre) {
        var li = $('<li/>');
        var icon = $('<i/>')
          .addClass('icons')
          .addClass('icon-plus');
        var h2 = $('<h2/>')
          .append(icon)
          .append(centre.short_name)
          .click(function() {
            buildDeals(li, centre);
          });
        var content = $('<div/>')
          .addClass('aContent');

        li
          .append(h2)
          .append(content);

        accordion.append(li);
      });

      $(".accordion li h2").click(function() {
        var li = $(this).parent();

        if (li.hasClass("selected")) {
          li.removeClass("selected");
        } else {
          $(".accordion li").removeClass('selected');
          li.addClass("selected"); 
        }
      });
    }
  });
}

// build available deals by centre
//TODO: cache store information, do deals needs to be in a specific order?
function buildDeals(li, centre) {
  var dealContainer = li.find('.aContent');

  if (!dealContainer.is(':empty')) {
    return;
  }

  $.ajax({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/deal/master/deals.json?',
    data: {
      centre: centre.code,
      state: 'published'
    },
    success: function(data) {
      var dealContainer = li.find('.aContent');

      //check for deals
      if (!data || data.length === 0) {
        dealContainer.append(
          $('#noDeals')
            .clone()
            .removeAttr('id')
            .removeClass('hide')
        );
        return;
      }

      $.each(data, function(i, deal) {
        getStoreContent(deal.deal_stores[0].store_service_id, function(storeInfo) {
          var img = $('<img/>')
            .attr('src', storeInfo.logo)
            .addClass('col-2-12');

          var header = $('<header/>')
            .append(
              $('<h1/>').text(deal.title),
              $('<p/>').text('Deal from ' + deal.available_from + ' to ' + deal.available_to + ', from ' + storeInfo.name)
            )
            .addClass('col-8-12');

          var anchor = $('<a/>')
            .html('View More<i class="icon-play"></i>')
            .attr('href', '')
            .addClass('col-2-12');

          var article = $('<article/>').append(
            img,
            header,
            anchor
          );

          dealContainer.append(article);
        });
      });
    }
  });
}

// gets information for a store
function getStoreContent(id, callback) {
  $.ajax({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/store/master/stores/' + id + '.json',
    success: function(data) {
      callback({
        name: data.name,
        logo: data._links.logo.href
      });
    }
  });
}
