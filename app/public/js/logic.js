$(document).ready(function() {

  var newDataTable = (dataSet, columnD) => { 
    $('#indicator_table').DataTable({
      "scrollY": 500,
      "scrollX": true,
      "pageLength": 19,
      "order": [],
      "data": dataSet,
      "columns": columnD
  })};

  var indicatorDataCopy = [];
  var selectedIds = [];

  //on-start
  jQuery.get('/api/indicators', function(data) {
    if (data.length !== 0) {
      indicatorDataCopy = data.slice();
      refreshTable(data);
    }
  });

  var refreshTable = (d, years) => {

    var selectedYears = [];

    if (years) {
      var firstY = $('#year_start').val();
      var lastY = $('#year_end').val();
      for (var j = parseInt(firstY); j <= lastY; j++) {
        selectedYears.push(j);
      }

      var datGapArr = [];
      var uniqueIds = [];
      var yArr = selectedYears.slice();
      var dataYears = [];
      var dataVals = [];
      var counter = 0;
      var data = [];

      d.forEach((item, i, arrayItems)=>{
        if (!uniqueIds.includes(item['id'])){
          uniqueIds.push(item['id']);
          dataYears = [];
          dataVals = [];
          counter = 0;
          data = [];
          data.push(item["id"]);
          data.push(item["name"]);
          data.push(item["code"]);
        } 
        
        dataYears.push(item['year']);
        dataVals.push(item['value']);
        
        if (arrayItems[i+1] === undefined || !uniqueIds.includes(arrayItems[i+1]['id'])){
          for (var i=0; i < yArr.length; i++){
            if (!dataYears.includes(yArr[i])){
              dataYears.splice(i, 0, 'not');
              dataVals.splice(i, 0, "none");
            }
          }
          data = data.concat(dataVals);
          datGapArr.push(data);
        }
      });


      var indYearCols = [];
      indYearCols.push({title: "id", visible: false});
      indYearCols.push({title: "Indicator Name"});
      indYearCols.push({title: "Indicator Code"});
      selectedYears.forEach((year)=>{
        var yearHeader = {};
        yearHeader.title = year.toString();
        indYearCols.push(yearHeader);
      });

      $('#t_headers tr').html('');
      for (var i=0; i<indYearCols.length; i++){
        $('#t_headers tr').append("<th>");
      }

      $('#indicator_table').DataTable().destroy();
      $("#data-area").html("");
      $('#t_headers').html("");
      
      newDataTable(datGapArr, indYearCols);

    } else if (!years) {
      var datArr = [];

      d.forEach((item)=>{
        var data = [];
        data.push(item["id"]);
        data.push(item["name"]);
        data.push(item["code"]);
        datArr.push(data);
      });
      
      var indCols = [];
      indCols.push({title: "id", visible: false});
      indCols.push({title: "Indicator Name"});
      indCols.push({title: "Indicator Code"});

      $('#t_headers tr').html('');
      for (var i=0; i<indCols.length; i++){
        $('#t_headers tr').append("<th>");
      }
      console.log(indCols);
      $('#indicator_table').DataTable().destroy();
      newDataTable(datArr, indCols);
    }
  }

  $('#indicator_table tbody').on( 'click', 'tr', function () {
    $(this).toggleClass('selected');
  });

  $('#alert').click( () => {
    //tests
    //alert( $('#indicator_table').dataTable().api().rows('.selected').data().length +' row(s) selected' );
    console.log($('#indicator_table').dataTable().api().rows('.selected').data()); 
    selectedIds = [];
    $('#indicator_table').dataTable().api().rows('.selected').data().each( item => { selectedIds.push(item[0]) });
    alert("you will pull data from " + selectedIds);
  });

  $('#refresh-btn').click( () => {
    location.reload(); 
  });

  $('#year_submit').click(function(e){

    e.preventDefault();
    var yearStart = $('#year_start').val();
    var yearEnd = $('#year_end').val();
    selectedIds = [];
    $('#indicator_table').dataTable().api().rows('.selected').data().each( item => { selectedIds.push(item[0]) });
    
    if (selectedIds.length < 1) {
      alert("You must select some indicators!");
    } else if (yearStart > yearEnd) {
      alert("You must have start year be less than end year!");
      $('#year_end').val('');
    } else {

      console.log("query with this info: " + yearStart, yearEnd, selectedIds);

      jQuery.get('/api/year_range', 
        {
          yearStart: yearStart,
          yearEnd: yearEnd,
          selectedIds: selectedIds
        }, 
        function(data) {
          refreshTable(data, true);
        });
    }
  });
});