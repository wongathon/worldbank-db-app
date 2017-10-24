$(document).ready(function() {

  var freshTable = () => { 
    $('#indicator_table').DataTable({
      "scrollY": 500,
      "scrollX": true,
      "pageLength": 19,
      "order": []
  })};


  jQuery.get('/api/indicators', function(data) {
    if (data.length !== 0) {
      //console.log(data);
      var s = true;
      for (var i = 0; i < data.length; i++) {
        var ind = $("<tr>").attr('role', 'row').attr('id', data[i].id);
        if ( s === true ) {
          ind.attr('class', 'odd');
          s = false; 
        } else {
          ind.attr('class', 'even');
          s = true;
        };
        var iName = $("<td>" + data[i].name + "</td>").attr('class', 'sorting_1');
        ind.append(iName);
        ind.append("<td>" + data[i].code + "</td>");
        $("#data-area").append(ind);
      }
      freshTable();
    }
  });

  $('#indicator_table tbody').on( 'click', 'tr', function () {
    console.log(this);
    $(this).toggleClass('selected');
  });

  $('#button').click( function () {
    alert( table.rows('.selected').data().length +' row(s) selected' );
  });

  jQuery.get('/api/indicator_data', function(data){
    if (data.length !== 0) {
      console.log(data);
      // for (var i = 0; i < data.length; i++) {
      //   var datum = 
      // }

    }
  });



});