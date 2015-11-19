jQuery.support.cors = true;
var serviceURL = "http://chav-adk11-1/coffeeservices/CoffeeServices.asmx/";
var tickHTML = "<span class = 'glyphicon glyphicon-ok'></span>";
var crossHTML = "<span class = 'glyphicon glyphicon-remove'></span>";

var refreshIntervalId;
var user;
var orders;
var coffees;
var dates = [];
var monthTotals = [];

var NUM_MONTHS = 7;

$(document).ready(function () {
    $('#pendingDiv').hide();
    fillInPac();
    fillInMonthsAndYears();
    getCurrentUser(); 

    for (var i = 0; i < NUM_MONTHS; i++) {
        monthTotals[i] = new monthTotaling(0, 0);
        fillOrderTabTemplate(i + 1);
    }    

    $("#coffeeTabsContent").on('change', '#monthSelector', function () {
        var index = getCurrentMonthIndex();

        changeTotalAndQuantityByMonth(index);
        changePendingTableByMonth(index);
    });

    $('#mainTabs').on('click', '#mainHomeTab', function () {
        $('#pendingDiv').hide();
    });

    $('#mainTabs').on('click', '#mainCoffeeTab', function () {
        $('#pendingDiv').show();
    });

    $('#mainTabs').on('click', '#mainOrderTab', function () {
        $('#pendingDiv').hide();
        $('.nav-tabs a[href="#otab' + (getCurrentMonthIndex() + 1) + '"]').tab('show');
    })
    
    $("#coffeeTabs").click(function () {
        setTimeout(function () {
            changePendingTableByMonth(getCurrentMonthIndex())
        }, 10);
    });
});

function getCoffeeDetails() {
    $.ajax({
        type: "POST",
        url: serviceURL + "getCoffees_WS",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .done(function (data) {
        coffees = data;
        fillCoffeeTabNames();
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function fillCoffeeTabNames() {
    var stringForHTML = "<li id = 'ctab1' class = 'active'><a href = '#tab1' data-toggle = 'tab'><h5>" + $.trim(coffees.d[0].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab2'><a href = '#tab2' data-toggle = 'tab'><h5>" + $.trim(coffees.d[1].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab3'><a href = '#tab3' data-toggle = 'tab'><h5>" + $.trim(coffees.d[2].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab4'><a href = '#tab4' data-toggle = 'tab'><h5>" + $.trim(coffees.d[3].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab5'><a href = '#tab5' data-toggle = 'tab'><h5>" + $.trim(coffees.d[4].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab6'><a href = '#tab6' data-toggle = 'tab'><h5>" + $.trim(coffees.d[5].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab7'><a href = '#tab7' data-toggle = 'tab'><h5>" + $.trim(coffees.d[6].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab8'><a href = '#tab8' data-toggle = 'tab'><h5>" + $.trim(coffees.d[7].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab9'><a href = '#tab9' data-toggle = 'tab'><h5>" + $.trim(coffees.d[8].coffeeName) + "</h5></a></li>"
			            + "<li id = 'ctab10'><a href = '#tab10' data-toggle = 'tab'><h5>" + $.trim(coffees.d[9].coffeeName) + "</h5></a></li>"

    document.getElementById("coffeeTabs").innerHTML = stringForHTML;

    for (var i = 0; i < coffees.d.length; i++)
        fillCoffeeTabContent(i);

    for (var i = 0; i < NUM_MONTHS; i++)
        fillPendingTablesTemplate(i + 1);

    getPreviousOrders();    
    changePendingTableByMonth(3);
}

function fillInMonthsAndYears() {
    dates[0] = new date(parseInt(moment().subtract('months', 3).format('M')),
                moment().subtract('months', 3).format('MMMM'),
                parseInt(moment().subtract('months', 3).format('YYYY')));

    dates[1] = new date(parseInt(moment().subtract('months', 2).format('M')),
                 moment().subtract('months', 2).format('MMMM'),
                 parseInt(moment().subtract('months', 2).format('YYYY')));

    dates[2] = new date(parseInt(moment().subtract('months', 1).format('M')),
                 moment().subtract('months', 1).format('MMMM'),
                 parseInt(moment().subtract('months', 1).format('YYYY')));

    dates[3] = new date(parseInt(moment().format('M')),
                 moment().format('MMMM'),
                 parseInt(moment().format('YYYY')));

    dates[4] = new date(parseInt(moment().add('months', 1).format('M')),
                 moment().add('months', 1).format('MMMM'),
                 parseInt(moment().add('months', 1).format('YYYY')));

    dates[5] = new date(parseInt(moment().add('months', 2).format('M')),
                 moment().add('months', 2).format('MMMM'),
                 parseInt(moment().add('months', 2).format('YYYY')));

    dates[6] = new date(parseInt(moment().add('months', 3).format('M')),
                 moment().add('months', 3).format('MMMM'),
                 parseInt(moment().add('months', 3).format('YYYY')));

    fillMonthTabNames();
}

function fillMonthTabNames() {
    var stringForHTML = "<li class = 'active'><a href = '#otab1' data-toggle = 'tab'>" + dates[0].monthDisplay +"<h5 id = 'sth1'></h5></a></li>"
					    + "<li><a href = '#otab2' data-toggle = 'tab'><h5 id = 'sth2'>" + dates[1].monthDisplay +"</h5></a></li>"
					    + "<li><a href = '#otab3' data-toggle = 'tab'><h5 id = 'sth3'>" + dates[2].monthDisplay +"</h5></a></li>"
					    + "<li><a href = '#otab4' data-toggle = 'tab'><h5 id = 'sth4'>" + dates[3].monthDisplay +"</h5></a></li>"
					    + "<li><a href = '#otab5' data-toggle = 'tab'><h5 id = 'sth5'>" + dates[4].monthDisplay +"</h5></a></li>"
				    	+ "<li><a href = '#otab6' data-toggle = 'tab'><h5 id = 'sth6'>" + dates[5].monthDisplay +"</h5></a></li>"
					    + "<li><a href = '#otab7' data-toggle = 'tab'><h5 id = 'sth7'>" + dates[6].monthDisplay + "</h5></a></li>";

    document.getElementById("OrderTabs").innerHTML = stringForHTML;
}

function fillCoffeeTabContent(i) {

    var availabilityString;

    if (coffees.d[i].availability)
        availabilityString = "<span class = 'glyphicon glyphicon-ok'></span>";
    else
        availabilityString = "<span class = 'glyphicon glyphicon-remove'></span>";

    var stringForHTML = "<div class = 'row'>"
                            + "<div class = 'col-md-4 text-center'>"
	                            + "<div class = 'list-group' style = 'margin-bottom : 15px; margin-top : 15px'>"
		                            + "<a class = 'list-group-item active'>Intensity</a>"
		                            + "<p id = 'intensity' class = 'list-group-item'>" + coffees.d[i].intensity + "</p>"
	                            + "</div>"
                            + "</div>"

                            + "<div class = 'col-md-4 text-center'>"
	                            + "<div class = 'list-group' style = 'margin-bottom : 15px; margin-top : 15px'>"
		                            + "<a class = 'list-group-item active'>Unit Price</a>"
		                            + "<p id = 'unitPrice' class = 'list-group-item'>" + coffees.d[i].unitPrice + "</p>"
	                            + "</div>"
                            + "</div>"

                            + "<div class = 'col-md-4 text-center'>"
	                            + "<div class = 'list-group' style = 'margin-bottom : 15px; margin-top : 15px'>"
		                            + "<a class = 'list-group-item active'>Availability</a>"
		                            + "<p id = 'Availability' class = 'list-group-item'>" + availabilityString + "</p>"
	                            + "</div>"
                            + "</div>"
                        + "</div>"

                        + "<div class = 'row'>"
                            + "<div class = 'col-md-4'>"
	                            + "<div class = 'jumbotron' style = 'background-color : transparent; margin-bottom : 15px; min-height : 205px;'>"
		                            + "<img id = 'capsule' src = './images/" + coffees.d[i].image + "' class = 'img-responsive'/>"
	                            + "</div>"
                            + "</div>"

                            + "<div class = 'col-md-8'>"
	                            + "<div class = 'jumbotron text-center' style = 'background-color : none; margin-bottom : 15px; height : 300px; min-height : 205px;'>"
		                            + "<b>" + coffees.d[i].shortDescription + "</b>"
		                            + "<h5>" + coffees.d[i].longDescription + "</h5>"
                                    + "<div class = 'col-md-4 col-md-offset-4 col-md-offset+4'>"
                                        + "<select id = 'quantitySelector' class = 'form-control text-center' style = 'margin-top : 15px'>"
                                            //+ "<option>25</option>"
                                            + "<option>50</option>"
                                            //+ "<option>75</option>"
                                            + "<option>100</option>"
                                            //+ "<option>125</option>"
                                            + "<option>150</option>"
                                            //+ "<option>175</option>"
                                            + "<option>200</option>"
                                        + "</select>"
                                        + "<select id = 'monthSelector' class = 'form-control text-center month' style = 'margin-top : 0px; margin-bottom : 15px'>"
                                            + "<option value = '0' id = 'mnt0'>" + dates[0].monthDisplay + "</option>"
                                            + "<option value = '1' id = 'mnt1'>" + dates[1].monthDisplay + "</option>"
                                            + "<option value = '2' id = 'mnt2'>" + dates[2].monthDisplay + "</option>"
                                            + "<option value = '3' id = 'mnt3' selected = 'selected'>" + dates[3].monthDisplay + "</option>"
                                            + "<option value = '4' id = 'mnt4'>" + dates[4].monthDisplay + "</option>"
                                            + "<option value = '5' id = 'mnt5'>" + dates[5].monthDisplay + "</option>"
                                            + "<option value = '6' id = 'mnt6'>" + dates[6].monthDisplay + "</option>"
                                        + "</select>"
                                        + "<button class = 'btn btn-danger' id = 'addBtn' onClick = 'addClick()' style = 'margin-top : 15px'>Add</button>"
                                    + "</div>"
                                + "</div>"
                            + "</div>"
                        + "</div>"

    document.getElementById("tab" + (i + 1)).innerHTML = stringForHTML;
}

function fillOrderTabTemplate(i) {
    var stringForHTML = "<div class = 'row' style = 'margin-top: 15px'>"
                            + "<div class = 'col-md-2 col-md-offset-1'>"
                               + "<div class = 'list-group text-center'>"
	                               + "<a class = 'list-group-item active'>Paid</a>"
	                                + "<p id = 'paid" + i + "' class = 'list-group-item' style = 'font-size : 1em'></p>"
                                + "</div>"
                            
                                + "<div class = 'list-group text-center'>"
	                                + "<a class = 'list-group-item active'>Received</a>"
	                                + "<p id = 'received" + i +"' class = 'list-group-item' style = 'font-size : 1em'></p>"
                                + "</div>"
                            + "</div>"

                            + "<div class = 'jumbotron col-md-6'>"
                                + "<table id = 'orderTable" + i + "' class = 'table text-justify'>"
                                    + "<thead>"
                                        + "<tr>"
                                            + "<th>Coffee</th>"
                                            + "<th>Quantity</th>"
                                            + "<th>Unit Price</th>"
                                            + "<th>Cost</th>"
                                        + "</tr>"
                                    + "</thead>"
                                + "</table>"
                            + "</div>"
                        
                            + "<div class = 'col-md-2 col-md-offset+1'>"
                                + "<div class = 'list-group text-center'>"
	                                + "<a class = 'list-group-item active'>Cost</a>"
	                                + "<p id = 'cost" + i + "' class = 'list-group-item' style = 'font-size : 1em'></p>"
                                + "</div>"
                                + "<div class = 'list-group text-center'>"
	                                + "<a class = 'list-group-item active'>Quantity</a>"
	                                + "<p id = 'quantity" + i + "' class = 'list-group-item' style = 'font-size : 1em'></p>"
                                + "</div>"
                            + "</div>"
                        + "</div>";

    document.getElementById("otab" + i).innerHTML = stringForHTML;
}

function fillPendingTablesTemplate(i) {
    var stringForHTML = "<p id = 'pendingLabel" + i + "' class = 'text-center'>" + dates[i-1].monthDisplay + "</p>"
                        + "<table class = 'table text-justify' id = 'pendingTable" + i + "'>"
				            + "<thead>"
					            + "<tr>"
						            + "<th><span class = 'glyphicon glyphicon-check'></span></th>"
						            + "<th>Coffee</th>"
						            + "<th>Quantity</th>"
						            + "<th>Cost</th>"
						            + "<th>Submitted</th>"                                    
					            + "</tr>"
				            + "</thead>"
			                + "</table>";

    document.getElementById('pendingTables').innerHTML += stringForHTML;
}

// WAKKA WAKKA
function fillInPac() {
    var stringForHTML = ".......... ";

    for (var i = 0; i < 15; i++) {
        document.getElementById('orderDots').innerHTML += stringForHTML;
        document.getElementById('coffeeDots').innerHTML += stringForHTML;
    }
}

function addClick() {
    var currentMonthIndex = getCurrentMonthIndex();
    var currentQuantity = getCurrentQuantity();
    var currentCoffeeIndex = getCurrentCoffeeIndex();
    var table = document.getElementById('pendingTable' + (getCurrentMonthIndex() + 1));
    var matchedRow = -1;

    // if selected coffee is available for ordering
    if (checkAvailability(currentCoffeeIndex)) {

        // if selected month is this month or after, i.e. an order can be placed.
        if (currentMonthIndex > 2) {

            // check if this coffee has been added this month already
            for (var i = 0; i < table.rows.length; i++)
                if (table.rows[i].cells[1].innerHTML === $.trim(coffees.d[currentCoffeeIndex].coffeeName))
                    matchedRow = i;

            if (matchedRow == -1) {
                addToSQLTable(table, currentMonthIndex, currentQuantity, currentCoffeeIndex);                
            }
            else {
                updatePendingHTMLTables(table, currentMonthIndex, currentQuantity, currentCoffeeIndex, matchedRow);                
            }
        }
        else
            alert("Cannot add an order to a month that has passed");
    }
    else
        alert("This coffee is currently unavailable");
}

function removeClick() {
    var currentMonthIndex = getCurrentMonthIndex();
    var pendingTable = document.getElementById('pendingTable' + (currentMonthIndex + 1));
    var orderTable = document.getElementById('orderTable' + (currentMonthIndex + 1));

    /// only try to remove from the table if there's something there
    if (pendingTable.rows.length > 1) {
        removeSingleRowFromPendingTable(pendingTable, orderTable, currentMonthIndex);
    }
}

function removeAllClick() {
    var currentMonthIndex = getCurrentMonthIndex();
    var pendingTable = document.getElementById('pendingTable' + (currentMonthIndex + 1));
    var orderTable = document.getElementById('orderTable' + (currentMonthIndex + 1));

    // only try to remove from the table if there's something to remove
    if (pendingTable.rows.length > 1)
        if (confirm("Are you sure you want to delete all entries in " + dates[currentMonthIndex].monthDisplay + "?")) {
            removeAllRowsFromPendingTable(pendingTable, currentMonthIndex);
            removeAllRowsFromOrderTable(orderTable, currentMonthIndex);
        }
}

function submitAllClick() {
    var currentMonthIndex = (getCurrentMonthIndex() + 1);
    var orderTable = document.getElementById('orderTable' + currentMonthIndex);
    removeAllRowsFromOrderTable(orderTable, currentMonthIndex);

    var pendingTable = document.getElementById('pendingTable' + currentMonthIndex);

    for (var i = 1; i < pendingTable.rows.length; i++) {    
        var coffee = pendingTable.rows[i].cells[1].innerHTML;
        var quantity = pendingTable.rows[i].cells[2].innerHTML;
        var cost = pendingTable.rows[i].cells[3].innerHTML;
        var unitPrice = (parseFloat(cost) / parseFloat(quantity)).toFixed(2);

        pendingTable.rows[i].cells[4].innerHTML = tickHTML;
         
        var orderTable = document.getElementById('orderTable' + currentMonthIndex);
        addToOrderHTMLTable(coffee, quantity, unitPrice, cost, orderTable);
        setOrderSubmittedSQL(currentMonthIndex);
    }           
}

function getCurrentUser() {
    $.ajax({
        type: "POST",
        url: serviceURL + "getCurrentUser",
        contentType: "application/json; charset=utf-8",
        beforeSend: function() {
            $("#homeActual").hide();            
            $("#coffeeTabsContent").hide();
            $("#OrderTabsContent").hide();
            $("#coffeeTabLoading").show();
            $("#orderTabLoading").show();
            $("#homeLoading").show();
            $("#pendingJumbo").hide();
            changeDots();
        },
        dataType: "json"
    })
    .done(function (data) {
        $("#homeActual").show();
        $("#homeLoading").hide();
        user = data.d;
	user.lanID = user.lanID.slice(3);
        setUserDetailsOnPage();
        getCoffeeDetails();
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getCurrentMonthIndex() {
    var active = $("#coffeeTabsContent").find('.tab-pane.active');
    var data = active.find('.month option:selected');
    var month = data.text();

    for(var i = 0; i < dates.length; i++)
        if(dates[i].monthDisplay === month)
            return i;    
}

function getIndexFromMonth(month) {    
    for (var i = 0; i < dates.length; i++)
        if (dates[i].month === month)
            return i;
}

function getCurrentQuantity() {
    var active = $("#coffeeTabsContent").find('.tab-pane.active');
    var data = active.find('#quantitySelector option:selected');
    return data.text();
}

function getCurrentCoffeeIndex() {
    var active = $("#coffeeTabs").find('.active');;

    for (var i = 0; i < coffees.d.length; i++)
        if ($.trim(coffees.d[i].coffeeName) === active.text())
            return i;
}

function getPreviousOrders() {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrdersForUser_WS",
        data: "{ userID:\"" + user.lanID + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .done(function (data) {
        orders = data;
        loadOutstandingOrders();
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function addToPendingHTMLTable(table, currentMonthIndex, currentQuantity, currentCoffeeIndex, orderID) {
    var row = table.insertRow(table.rows.length);

    var cell1 = row.insertCell(0);
    var element1 = document.createElement("input");
    element1.type = "checkbox";
    element1.name = "chkbox[]";
    cell1.appendChild(element1);

    var cell2 = row.insertCell(1);
    cell2.innerHTML = $.trim(coffees.d[currentCoffeeIndex].coffeeName);

    var cell3 = row.insertCell(2);
    cell3.innerHTML = currentQuantity;

    var cell4 = row.insertCell(3);
    var total = (currentQuantity * coffees.d[currentCoffeeIndex].unitPrice).toFixed(2);
    cell4.innerHTML = total;

    var cell5 = row.insertCell(4);
    cell5.innerHTML = "<span class = 'glyphicon glyphicon-remove'></span>";

    var cell6 = row.insertCell(5);
    cell6.innerHTML = orderID;
    $('tr td:nth-child(6)').hide();

    var oldTotal = parseFloat(monthTotals[currentMonthIndex].totalPrice);
    var newTotal = (parseFloat(total) + parseFloat(oldTotal)).toFixed(2);
    var oldQuantity = parseInt(monthTotals[currentMonthIndex].totalQuantity);
    var newQuantity = parseInt(currentQuantity) + parseInt(oldQuantity);

    monthTotals[currentMonthIndex].totalPrice = newTotal;
    monthTotals[currentMonthIndex].totalQuantity = newQuantity;
    changeTotalAndQuantityByMonth(currentMonthIndex);
}

function addToOrderHTMLTable(coffee, quantity, unitPrice, cost, orderTable, paid, received) {
    var index = orderTable.id.charAt(10);
    var row = orderTable.insertRow(orderTable.rows.length);

    var cell1 = row.insertCell(0);
    cell1.innerHTML = coffee;

    var cell2 = row.insertCell(1);
    cell2.innerHTML = quantity;

    var cell3 = row.insertCell(2);
    cell3.innerHTML = unitPrice;

    var cell4 = row.insertCell(3);
    cell4.innerHTML = cost;

    if (orders.d.length > 0) {
        var paidHTMLItem = document.getElementById('paid' + index);
        if (paid)
            paidHTMLItem.innerHTML = tickHTML;
        else
            paidHTMLItem.innerHTML = crossHTML;

        var receivedHTMLItem = document.getElementById('received' + index);
        if (received)
            receivedHTMLItem.innerHTML = tickHTML;
        else
            receivedHTMLItem.innerHTML = crossHTML;
    }
    else {
        var paidHTMLItem = document.getElementById('paid' + index);
        paidHTMLItem.innerHTML = crossHTML;

        var receivedHTMLItem = document.getElementById('received' + index);
        receivedHTMLItem.innerHTML = crossHTML;
    }

    var costHTMLItem = document.getElementById('cost' + index);
    costHTMLItem.innerHTML = monthTotals[index - 1].totalPrice;

    var quantityHTMLItem = document.getElementById('quantity' + index);
    quantityHTMLItem.innerHTML = monthTotals[index - 1].totalQuantity;
}

function addToSQLTable(table, currentMonthIndex, currentQuantity, currentCoffeeIndex) {    
    var total = currentQuantity * coffees.d[currentCoffeeIndex].unitPrice;
    var month = dates[currentMonthIndex].month;
    var year = dates[currentMonthIndex].year;
    var orderID = 0;

    $.ajax({
        type: "POST",
        url: serviceURL + "addToOrderTable_WS",
        data: "{ userID:\"" + user.lanID + "\",userName:\"" + user.name + "\",quantity:\"" + currentQuantity + "\",total:\"" + total + "\",coffeeID:\"" + (currentCoffeeIndex + 1) + "\",month:\"" + month + "\",year:\"" + year + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .done(function (data) {
        orderID = data.d;
        orderID = parseInt(orderID);

        addToPendingHTMLTable(table, currentMonthIndex, currentQuantity, currentCoffeeIndex, orderID);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function updatePendingHTMLTables(table, currentMonthIndex, currentQuantity, currentCoffeeIndex, matchedRow) {
    var newQuantity = parseInt(table.rows[matchedRow].cells[2].innerHTML);
    newQuantity += parseInt(currentQuantity);
    table.rows[matchedRow].cells[2].innerHTML = newQuantity;

    var oldTotal = parseFloat(table.rows[matchedRow].cells[3].innerHTML);
    var newTotal = parseFloat(coffees.d[currentCoffeeIndex].unitPrice * currentQuantity);
    newTotal += oldTotal;
    newTotal = parseFloat(newTotal).toFixed(2);
    table.rows[matchedRow].cells[3].innerHTML = newTotal;

    table.rows[matchedRow].cells[4].innerHTML = "<span class = 'glyphicon glyphicon-remove'></span>";

    var currentOrderID = table.rows[matchedRow].cells[5].innerHTML;
    updateSQLTables(currentOrderID, currentMonthIndex, newQuantity, newTotal);

    oldTotal = monthTotals[currentMonthIndex].totalPrice;
    newTotal = coffees.d[currentCoffeeIndex].unitPrice * currentQuantity;
    newTotal = (parseFloat(oldTotal) + parseFloat(newTotal)).toFixed(2);

    newQuantity = currentQuantity;
    currentQuantity = monthTotals[currentMonthIndex].totalQuantity;    
    newQuantity = parseInt(currentQuantity) + parseInt(newQuantity);

    monthTotals[currentMonthIndex].totalPrice = newTotal;
    monthTotals[currentMonthIndex].totalQuantity = newQuantity;
    changeTotalAndQuantityByMonth(currentMonthIndex);
}

function updateSQLTables(orderID, currentMonthIndex, newQuantity, newTotal) {
    var month = dates[currentMonthIndex].month;
    var year = dates[currentMonthIndex].year;

    $.ajax({
        type: "POST",
        url: serviceURL + "updateOrderTable_WS",
        data: "{ quantity:\"" + newQuantity + "\",total:\"" + newTotal + "\",month:\"" + month + "\",year:\"" + year + "\",orderID:\"" + orderID + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function removeSingleRowFromPendingTable(pendingTable, orderTable, currentMonthIndex) {
    try {
        var rowCount = pendingTable.rows.length;

        for (var j = 0; j < rowCount; j++) {
            var row = pendingTable.rows[j];
            var chkbox = row.cells[0].childNodes[0];
            if (null != chkbox && true == chkbox.checked) {
                var orderID = pendingTable.rows[j].cells[5].innerHTML;
                var oldTotal = pendingTable.rows[j].cells[3].innerHTML;
                var oldQuantity = pendingTable.rows[j].cells[2].innerHTML;
                var newTotal = parseFloat(monthTotals[currentMonthIndex].totalPrice) - parseFloat(oldTotal);
                var newQuantity = parseInt(monthTotals[currentMonthIndex].totalQuantity) - parseInt(oldQuantity);

                if (newTotal > 0)
                    monthTotals[currentMonthIndex].totalPrice = newTotal.toFixed(2);
                else
                    monthTotals[currentMonthIndex].totalPrice = newTotal;
                monthTotals[currentMonthIndex].totalQuantity = newQuantity;

                changeTotalAndQuantityByMonth(currentMonthIndex);

                if (pendingTable.rows[j].cells[4].innerHTML.indexOf("ok") >= 0)
                    removeSingleRowFromOrderTable(orderTable, j);

                pendingTable.deleteRow(j);
                rowCount--;
                j--;

                removeSingleRowFromSQLTable(orderID);
            }
        }
    }
    catch (e) {
        alert(e);
    }
}

function removeSingleRowFromSQLTable(orderID) {    
    $.ajax({
        type: "POST",        
        url: serviceURL + "removeRowFromOrderTable_WS",
        data: "{ orderID:\"" + orderID + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });    
}

function removeSingleRowFromOrderTable(table, positionToDelete) {
    var index = table.id.charAt(10);

    try {
        table.deleteRow(positionToDelete);

        var costHTMLItem = document.getElementById('cost' + index);
        var quantityHTMLItem = document.getElementById('quantity' + index);
        var paidHTMLItem = document.getElementById('paid' + index);
        var receivedHTMLItem = document.getElementById('received' + index);
        

        if (monthTotals[index - 1].totalPrice > 0) {
            costHTMLItem.innerHTML = monthTotals[index - 1].totalPrice;
            quantityHTMLItem.innerHTML = monthTotals[index - 1].totalQuantity;
            paidHTMLItem.innerHTML = "<span class = 'glyphicon glyphicon-remove'></span>";
            receivedHTMLItem.innerHTML = "<span class = 'glyphicon glyphicon-remove'></span>";
        }
        else {
            costHTMLItem.innerHTML = "";
            quantityHTMLItem.innerHTML = "";
            paidHTMLItem.innerHTML = "";
            receivedHTMLItem.innerHTML = "";
        }
    }
    catch (e) {
        alert(e);
    }
}

function removeAllRowsFromPendingTable(table, currentMonthIndex) {
    try {
        var rowCount = table.rows.length;

        for (var j = 1; j < rowCount; j++) {
            var row = table.rows[j];
            table.deleteRow(j);
            rowCount--;
            j--;
        }

        removeAllRowsFromSQLTableForMonth(currentMonthIndex);
    }
    catch (e) {
        alert(e);
    }
    for (var j = 0; j < 7; j++) {
        monthTotals[j].totalPrice = 0.00;
        monthTotals[j].totalQuantity = 0;
    }
        
    changeTotalAndQuantityByMonth(currentMonthIndex);
}

function removeAllRowsFromSQLTableForMonth(currentMonthIndex) {    
    var month = dates[currentMonthIndex].month;
    var year = dates[currentMonthIndex].year;

    $.ajax({
        type: "POST",        
        url: serviceURL + "removeAllRowsFromOrderTable_WS",
        data: "{ month:\"" + month + "\",year:\"" + year + "\",userID:\"" + user.lanID + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function removeAllRowsFromOrderTable(table, currentMonthIndex) {
    var index = table.id.charAt(10);

    try {
        var rowCount = table.rows.length;

        for (var j = 1; j < rowCount; j++) {
            var row = table.rows[j];
            table.deleteRow(j);
            rowCount--;
            j--;
        }
    }
    catch (e) {
        alert(e);
    }

    var paidHTMLItem = document.getElementById('paid' + index).innerHTML = "";
    var receivedHTMLItem = document.getElementById('received' + index).innerHTML = "";
    var costHTMLItem = document.getElementById('cost' + index).innerHTML = "";
    var quantityHTMLItem = document.getElementById('quantity' + index).innerHTML = "";
    
}

function loadOutstandingOrders() {
    var currentMonthIndex = getCurrentMonthIndex();
    var curYear = new Date().getFullYear();


    for (var i = 0; i < orders.d.length; i++) {
        var index = getIndexFromMonth(orders.d[i].month);
	//PK Added April/09/2015//////////////////
	if (index >= currentMonthIndex && orders.d[i].year != curYear) continue;
        ///////////////////////////////////////
	var currentCoffeeIndex = orders.d[i].coffeeID - 1;
        var coffeeName = $.trim(coffees.d[currentCoffeeIndex].coffeeName);

        var table = document.getElementById('pendingTable' + (index + 1));
        if (table != null) {
            var row = table.insertRow(table.rows.length);
            var cell1 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "checkbox";
            element1.name = "chkbox[]";
            cell1.appendChild(element1);

            var cell2 = row.insertCell(1);
            cell2.innerHTML = coffeeName;

            var cell3 = row.insertCell(2);
            cell3.innerHTML = orders.d[i].quantity;

            var cell4 = row.insertCell(3);
            cell4.innerHTML = (orders.d[i].total).toFixed(2);

            var cell5 = row.insertCell(4);

            if (orders.d[i].orderSubmitted)
                cell5.innerHTML = tickHTML;
            else
                cell5.innerHTML = crossHTML;

            var cell6 = row.insertCell(5);
            cell6.innerHTML = orders.d[i].orderID;
            $('tr td:nth-child(6)').hide();

            var oldTotal = parseFloat(monthTotals[index].totalPrice);
            var newTotal = (parseFloat(cell4.innerHTML) + parseFloat(oldTotal)).toFixed(2);
            var oldQuantity = parseInt(monthTotals[index].totalQuantity);
            var newQuantity = parseInt(cell3.innerHTML) + parseInt(oldQuantity);

            monthTotals[index].totalPrice = newTotal;
            monthTotals[index].totalQuantity = newQuantity;

            var orderTable = document.getElementById('orderTable' + (index + 1));
            addToOrderHTMLTable(coffeeName, orders.d[i].quantity, coffees.d[index].unitPrice, (orders.d[i].total).toFixed(2), orderTable, orders.d[i].orderPaid, orders.d[i].orderReceived);
        }
    }
    $("#orderTabLoading").hide();
    $("#coffeeTabLoading").hide();
    $("#coffeeTabsContent").show();
    $("#OrderTabsContent").show();
    $("#pendingJumbo").show();
    clearInterval(refreshIntervalId);
    changeTotalAndQuantityByMonth(3);
}

function setOrderSubmittedSQL(currentMonthIndex) {
    currentMonthIndex--;

    var month = dates[currentMonthIndex].month;
    var year = dates[currentMonthIndex].year;

    $.ajax({
        type: "POST",
        url: serviceURL + "setOrderSubmittedOrderTable_WS",
        data: "{ month:\"" + month + "\",year:\"" + year + "\",userID:\"" + user.lanID + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function setUserDetailsOnPage() {
    var name = document.getElementById("pName");
    name.innerHTML = user.name;

    name = document.getElementById("fullName");
    name.innerHTML = user.name;
    var id = document.getElementById("loginID");
    id.innerHTML = user.lanID;
}

function changeDots() {
    var coffeeDots = document.getElementById('coffeeDots');
    var orderDots = document.getElementById('orderDots');
    
    refreshIntervalId = setInterval(function () {
        var temp1 = coffeeDots.innerHTML;
        var temp2 = orderDots.innerHTML;
        temp1 = temp1.substr(1);
        temp2 = temp2.substr(1)
        coffeeDots.innerHTML = temp1;
        orderDots.innerHTML = temp2;
    }, 50);    
}

function changeTotalAndQuantityByMonth(currentMonthIndex) {
    document.getElementById('totalCostValue').innerHTML = monthTotals[currentMonthIndex].totalPrice;
    document.getElementById('totalQuantityValue').innerHTML = monthTotals[currentMonthIndex].totalQuantity;
}

function changePendingTableByMonth(currentMonthIndex) {
    currentMonthIndex++;    

    for (var i = 1; i < (NUM_MONTHS + 1) ; i++) {
        $('#pendingTable' + i).hide();
        $('#pendingLabel' + i).hide();
    }
        
    $('#pendingTable' + currentMonthIndex).show();
    $('#pendingLabel' + currentMonthIndex).innerHTML = dates[currentMonthIndex - 1].monthDisplay;
    $('#pendingLabel' + currentMonthIndex).show();    
}

function checkAvailability(currentCoffeeIndex) {
    if (coffees.d[currentCoffeeIndex].availability)
        return true;
    else
        return false;
}

function monthTotaling(totalPrice, totalQuantity) {
    this.totalPrice = totalPrice;
    this.totalQuantity = totalQuantity;
}

function date(month, monthDisplay, year) {
    this.month = month;
    this.monthDisplay = monthDisplay;
    this.year = year;
}