$(function() {

  $.ajax ({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/centre/master/states.json',
    data: {
      country: 'au'
    },
    success: function(data) {
      var search = $('#search');

      $.each(data, function(i, state) {
        var li = $('<li/>');
        var anchor = $('<a/>')
          .attr('href', '')
          .text(state.abbreviation)
          .click(function(e) {
            e.preventDefault();
            buildContent(state);
          });

        li.append(anchor);
        search.before(li);
      });

      $("#nav").find('li:first-of-type a').click();
    }
  });
});

function buildContent(state) {
  $.ajax({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/centre/master/centres.json?',
    data: {
      state: state.abbreviation
    },
    success: function(data) {
      var accordion = $('#accordion').empty();

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

      $(".accordion li").click(function() {
        var self = $(this);

        if (self.hasClass("selected")) {
          self.removeClass("selected");
        } else {
          $(".accordion li").removeClass('selected');
          self.addClass("selected"); 
        }
      });
    }
  });
}

function buildDeals(li, centre) {
  $.ajax({
    method: 'GET',
    url: 'http://www.westfield.com.au/api/deal/master/deals.json?',
    data: {
      centre: centre.code,
      state: 'published'
    },
    success: function(data) {
      console.log("hello");
    }
  });
}

