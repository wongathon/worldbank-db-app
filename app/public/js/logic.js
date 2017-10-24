$(document).ready(function() {

  var newDataTable = () => { 
    $('#indicator_table').DataTable({
      "scrollY": 500,
      "scrollX": true,
      "pageLength": 19,
      "order": []
  })};

  var indicatorDataCopy = [];
  var selectedIds = [];

  //on-start
  jQuery.get('/api/indicators', function(data) {
    if (data.length !== 0) {
      //console.log(data);
      indicatorDataCopy = data.slice();
      refreshTableNoYears(data);
    }
  });

  var refreshTableNoYears = (d) => {
    var s = true;
      for (var i = 0; i < d.length; i++) {
        var ind = $("<tr>").attr('role', 'row').attr('id', d[i].id);
        if ( s === true ) {
          ind.attr('class', 'odd');
          s = false; 
        } else {
          ind.attr('class', 'even');
          s = true;
        };
        var iName = $("<td>" + d[i].name + "</td>").attr('class', 'sorting_1');
        ind.append(iName);
        ind.append("<td>" + d[i].code + "</td>");
        $("#data-area").append(ind);
      }
    newDataTable();
  }

  $('#indicator_table tbody').on( 'click', 'tr', function () {
    //console.log(this);
    $(this).toggleClass('selected');
  });

  $('#alert').click( function () {
    //tests
    //alert( $('#indicator_table').dataTable().api().rows('.selected').data().length +' row(s) selected' );
    //console.log($('#indicator_table').dataTable().api().rows('.selected').data()); 
    selectedIds = [];
    $('#indicator_table').dataTable().api().rows('.selected').data().each( item => { selectedIds.push(item["DT_RowId"]) });
    alert("you will pull data from " + selectedIds);

  });

  $('#year_submit').click(function(e){

    e.preventDefault();
    var yearStart = $('#year_start').val();
    var yearEnd = $('#year_end').val();
    selectedIds = [];
    $('#indicator_table').dataTable().api().rows('.selected').data().each( item => { selectedIds.push(item["DT_RowId"]) });
    
    if (selectedIds.length < 1) {
      alert("You must select some indicators!");
    } else if (yearStart > yearEnd) {
      alert("You must have start year be less than end year!");
      $('#year_end').val('');
    } else {
      selectedIds = [];
      $('#indicator_table').dataTable().api().rows('.selected').data().each( item => { selectedIds.push(item["DT_RowId"]) });
      console.log(yearStart, yearEnd, selectedIds);

      jQuery.get('/api/year_range', 
        {
          yearStart: yearStart,
          yearEnd: yearEnd,
          selectedIds: selectedIds
        }, 
        function(data) {

        });
    }
  });




  //WIP Get all indicator AND Data. Too big!
  // jQuery.get('/api/indicator_data', function(data){
  //   if (data.length !== 0) {
  //     console.log(data);
  //     for (var i = 0; i < data.length; i++) {
  //       var datum = 
  //     }

  //   }
  // });



});