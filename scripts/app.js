document.addEventListener('polymer-ready', function() {
  var navicon = document.getElementById('navicon');
  var drawerPanel = document.getElementById('drawerPanel');
  navicon.addEventListener('click', function() {
    drawerPanel.togglePanel();
  });
});

$.ajax({
  dataType: 'json',
  url: '../../dc-campaign-finance-data/json/test-data.json',
  success: function (response) {
    for (var i = 0; i < response.length; i++) {
      var el = document.getElementById('charts');
      var created = document.createElement('bar-chart');
      created.setAttribute('names', response[i].data[0]);
      created.setAttribute('values', response[i].data[1]);
      created.setAttribute('title', response[i].year + ' ' + response[i].office);
      el.appendChild(created);
    }
  },
  error: function (err) {
    console.log(err);
  }
});
