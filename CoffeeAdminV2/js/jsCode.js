var NUM_MONTHS_USED = 7;
var NUM_CELLS_WHO_TABLE = 4;
var MAX_BUTTONS = 200;

var dates = [];
var orders;
var coffees;
var ordersByNames;
var names;
var paidRecNames = [];
var months = [];
var years = [];
var overallOrdersQuantity = 0;
var overallOrdersTotal = 0;
var numberOfWhoTables = 0;
var currentMonthIndex = 3;
var previousFilter = 1;
var serviceURL = "/AdminWebService.asmx/";

$(document).ready(function () {
    $("#loadingDiv").hide();
    fillInMonthsAndYears();
    getCoffees();
    showHideTables(1, 4);
    showHideTables(2, 4);
    createOrderTabTemplate();
    createWhoTabTemplate();    
    fillOrderTab();
    fillWhoTab(1, currentMonthIndex);

    for (var i = 1; i <= NUM_MONTHS_USED; i++) {
        $("#Order" + i).click(function () {
            changeDisplayedTab(1, this.id.charAt(5));
        });
        $("#Who" + i).click(function () {
            currentMonthIndex = this.id.charAt(3);            
            changeDisplayedTab(2, currentMonthIndex);
            currentMonthIndex -= 1;
            deleteFromWhoHTML();
            fillWhoTab(previousFilter, currentMonthIndex);
        });
    }
        
    for (var i = 0; i <= MAX_BUTTONS; i++) {
        $("#whoStatic").on('click', '#paid' + (i + 1), function () {
            var tableNum = this.id.charAt(4);
            if (this.id.charAt(5) != null)
                tableNum += this.id.charAt(5);
            if (this.id.charAt(6) != null)
                tableNum += this.id.charAt(6);

            var a = this.parentNode;
            while (a.className == "")
                a = a.parentNode;
            var monthIndex = parseInt(a.id.charAt(8)) - 1;

            if (this.className.valueOf() == "btn btn-danger") {
                $(this).removeClass("btn-danger");
                $(this).addClass("btn-success");
                paidButtonClick(true, monthIndex, paidRecNames[tableNum - 1]);
            }
            else if (this.className.valueOf() == "btn btn-success") {
                $(this).removeClass("btn-success");
                $(this).addClass("btn-danger")
                paidButtonClick(false, monthIndex, paidRecNames[tableNum - 1]);
            }
        });

        $("#whoStatic").on('click', '#rece' + (i + 1), function () {
            var tableNum = this.id.charAt(4);
            if (this.id.charAt(5) != null)
                tableNum += this.id.charAt(5);
            if (this.id.charAt(6) != null)
                tableNum += this.id.charAt(6);

            var a = this.parentNode;
            while (a.className == "")
                a = a.parentNode;
            var monthIndex = parseInt(a.id.charAt(8)) - 1;

            if (this.className.valueOf() == "btn btn-danger") {
                $(this).removeClass("btn-danger");
                $(this).addClass("btn-success");
                receivedButtonClick(true, monthIndex, paidRecNames[tableNum - 1]);
            }
            else if (this.className.valueOf() == "btn btn-success") {
                $(this).removeClass("btn-success");
                $(this).addClass("btn-danger")
                receivedButtonClick(false, monthIndex, paidRecNames[tableNum - 1]);
            }
        });
    }

    $("#lall").click(function () {
        $("#lPaid").removeClass('active');
        $("#lunPaid").removeClass('active');
        $("#lRec").removeClass('active');
        $("#lunRec").removeClass('active');
        $("#lall").addClass('active');
        deleteFromWhoHTML();
        previousFilter = 1;
        fillWhoTab(1, currentMonthIndex);
    });

    $("#lPaid").click(function () {
        $("#lall").removeClass('active');
        $("#lunPaid").removeClass('active');
        $("#lRec").removeClass('active');
        $("#lunRec").removeClass('active');
        $("#lPaid").addClass('active');
        deleteFromWhoHTML();
        previousFilter = 2;
        fillWhoTab(2, currentMonthIndex);
    });

    $("#lunPaid").click(function () {
        $("#lall").removeClass('active');
        $("#lPaid").removeClass('active');
        $("#lRec").removeClass('active');
        $("#lunRec").removeClass('active');
        $("#lunPaid").addClass('active');
        deleteFromWhoHTML();
        previousFilter = 3;
        fillWhoTab(3, currentMonthIndex);
    });

    $("#lRec").click(function () {
        $("#lall").removeClass('active');
        $("#lPaid").removeClass('active');
        $("#lunPaid").removeClass('active');
        $("#lunRec").removeClass('active');
        $("#lRec").addClass('active');
        deleteFromWhoHTML();
        previousFilter = 4;
        fillWhoTab(4, currentMonthIndex);
    });

    $("#lunRec").click(function () {
        $("#lall").removeClass('active');
        $("#lPaid").removeClass('active');
        $("#lunPaid").removeClass('active');
        $("#lRec").removeClass('active');
        $("#lunRec").addClass('active');
        deleteFromWhoHTML();
        previousFilter = 5;
        fillWhoTab(5, currentMonthIndex);
    });
})

function showHideTables(tab, table) {
    if (tab == 1) {
        for (var i = 1; i <= NUM_MONTHS_USED; i++)
            $('#whoDiv' + i).hide();
        $('#whoDiv' + table).show();
    }

    else if (tab == 2) {
        for (var i = 1; i <= NUM_MONTHS_USED; i++)
            $('#orderDiv' + i).hide();
        $('#orderDiv' + table).show();
    }

    else {
        alert("Error : A tab was not specified, tables could not be hidden");
    }
}

function changeDisplayedTab(tab, month) {
    if (tab == 1) {
        for (var i = 1; i <= NUM_MONTHS_USED; i++) {
            $("#orderDiv" + i).hide();
            $("#Order" + i).removeClass("active");
        }
        $("#orderDiv" + month).show();
        $("#Order" + month).addClass("active");
    }
    else if (tab == 2) {
        for (var i = 1; i <= NUM_MONTHS_USED; i++) {
            $("#whoDiv" + i).hide();
            $("#Who" + i).removeClass("active");
        }
        $("#whoDiv" + month).show();
        $("#Who" + month).addClass("active");
    }
    else
        alert("Error : A tab was not specified, couldn't switch displayed month");
}

function paidButtonClick(newPaidStatus, monthIndex, userName) {
    $.ajax({
        type: "POST",
        url: serviceURL + "changePaidStatus_WS",
        data: "{month:\"" + dates[monthIndex].month + "\",year:\"" + dates[monthIndex].year + "\",userName:\"" + userName + "\",newPaidStatus:\"" + newPaidStatus + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function receivedButtonClick(newReceivedStatus, monthIndex, userName) {
    $.ajax({
        type: "POST",
        url: serviceURL + "changeReceivedStatus_WS",
        data: "{month:\"" + dates[monthIndex].month + "\",year:\"" + dates[monthIndex].year + "\",userName:\"" + userName + "\",newReceivedStatus:\"" + newReceivedStatus + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function coffeeIDtoName(coffeeID) {
    for (var i = 0; i < coffees.d.length; i++)
        if (coffees.d[i].coffeeID == coffeeID)
            return coffees.d[i].coffeeName;
}

function addTablePaddingBetweenUsers(tableNum) {
    var table = document.getElementById("whoTable" + tableNum);
    var row = table.insertRow(table.rows.length);

    for (var i = 0; i < NUM_CELLS_WHO_TABLE; i++)
        row.insertCell(i).bgColor = "#f2dede";
}

function createOrderTabTemplate() {
    for (var i = 1; i <= NUM_MONTHS_USED; i++) {
        var stringForHTML = "<table id = 'ordersTable" + i + "' class = 'table table-hover' style = 'table-layout : fixed'>"
                                + "<thead>"
                                    + "<tr>"
                                        + "<th>Coffee</th>"
                                        + "<th>Quantity</th>"
                                    + "</tr>"
                                + "</thead>"
                                + "<tbody></tbody>"
                            + "</table>";

        document.getElementById("orderDiv" + i).innerHTML = stringForHTML;
    }
}

function createWhoTabTemplate() {
    for (var i = 1; i <= NUM_MONTHS_USED; i++) {
        var stringForHTML = "<table id = 'whoTable" + i + "' class = 'table' style = 'table-layout : fixed'>"
                                + "<thead>"
                                    + "<tr>"
                                        + "<th>Name</th>"
                                        + "<th>Coffee</th>"
                                        + "<th style = 'text-align : right'>Quantity</th>"
                                        + "<th style = 'text-align : right'>Cost</th>"
                                    + "</tr>"
                                + "</thead>"
                                + "<tbody></tbody>"
                            + "</table>";

        document.getElementById("whoDiv" + i).innerHTML = stringForHTML;
    }
}

function deleteFromWhoHTML() {
    for (var i = 1; i <= NUM_MONTHS_USED; i++) {
        var table = document.getElementById("whoTable" + i);

        try {
            var rowCount = table.rows.length;

            for (var j = 1; j < rowCount; j++) {
                table.deleteRow(j);
                rowCount--;
                j--;
            }
        }
        catch (e) {
            alert(e);
        }
    }
}

function fillOrderTab() {
    $("#orderStatic").hide();

    for (var i = 1; i <= NUM_MONTHS_USED; i++) 
        getOrdersByMonth(i);

    $("#orderStatic").show();
}

function fillOrderTabContinue(i) {
    overallOrdersQuantity = 0;

    var table = document.getElementById("ordersTable" + i);

    for (var j = 0; j < orders.d.length; j++) {
        var row = table.insertRow(table.rows.length);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = coffeeIDtoName(orders.d[j].coffeeID);

        var cell2 = row.insertCell(1);
        cell2.innerHTML = orders.d[j].quantity;
        overallOrdersQuantity += parseInt(orders.d[j].quantity);
    }

    if (table.rows.length > 1) {
        var row = table.insertRow(table.rows.length);
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "<b>Total</b>";

        var cell2 = row.insertCell(1);
        cell2.innerHTML = "<b>" + overallOrdersQuantity + "</b>";
    }
}

function fillWhoTab(filter, currentMonthIndex) {
    numberOfWhoTables = 0;
    
    switch (filter) {
        case 1: {                
            getOrderNamesAll(currentMonthIndex);
            break;
        }
        case 2: {
            getOrderNamesPaid(currentMonthIndex);
            break;
        }
        case 3: {
            getOrderNamesNotPaid(currentMonthIndex);
            break;
        }
        case 4: {
            getOrderNamesReceived(currentMonthIndex);
            break;
        }
        case 5: {
            getOrderNamesNotReceived(currentMonthIndex);
            break;
        }
        default: {
            break;
        }
    }  
}

function fillWhoTabContinue(currentMonthIndex) {
    for (var j = 0; j < names.d.length; j++) 
        getOrdersByMonthForUser(currentMonthIndex, names.d[j], j);

    if (names.d.length < 1) {
        $("#loadingDiv").hide();
        $("#whoDiv" + (currentMonthIndex + 1)).show();
    }
}

function fillWhoTabFinish(currentMonthIndex, j) {
    overallOrdersQuantity = 0;
    overallOrdersTotal = 0;

    var table = document.getElementById("whoTable" + (currentMonthIndex + 1));

    for (var k = 0; k < orders.d.length; k++) {
        var row = table.insertRow(table.rows.length);

        if (k == 0) {
            row.insertCell(0).innerHTML = names.d[j];
            paidRecNames[numberOfWhoTables] = names.d[j];
        }
        else
            row.insertCell(0).innerHTML = "";

        var cell2 = row.insertCell(1);
        cell2.innerHTML = coffeeIDtoName(orders.d[k].coffeeID);

        var cell3 = row.insertCell(2);
        cell3.innerHTML = orders.d[k].quantity;
        overallOrdersQuantity += parseInt(orders.d[k].quantity);
        cell3.align = "right";

        var cell4 = row.insertCell(3);
        var temp = orders.d[k].total.toFixed(2);
        overallOrdersTotal += parseFloat(temp);
        cell4.innerHTML = temp;
        cell4.align = "right";
    }

    var row = table.insertRow(table.rows.length);
    row.insertCell(0).innerHTML = "";
    row.insertCell(1).innerHTML = "";

    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<b>" + overallOrdersQuantity + "</b>";
    cell3.align = "right";
    cell3.style.borderTop = "6px double #f2dede";

    var cell4 = row.insertCell(3);
    cell4.innerHTML = "<b>" + overallOrdersTotal.toFixed(2) + "</b>";
    cell4.align = "right";
    cell4.style.borderTop = "6px double #f2dede";

    row = table.insertRow(table.rows.length);
    row.insertCell(0).innerHTML = "";
    row.insertCell(1).innerHTML = "";

    var paidString = "";

    if (orders.d[k-1].orderPaid)
        paidString = "'btn btn-success'";
    else
        paidString = "'btn btn-danger'";


    var receivedString = "";

    if (orders.d[k-1].orderReceived)
        receivedString = "'btn btn-success'";
    else
        receivedString = "'btn btn-danger'";

    var cell3 = row.insertCell(2);
    cell3.innerHTML = "<button id = 'paid" + (numberOfWhoTables + 1) + "' class = " + paidString + " style = 'width : 6em'>Paid</button>";
    cell3.align = "right";

    var cell4 = row.insertCell(3);
    cell4.innerHTML = "<button id = 'rece" + (numberOfWhoTables + 1) + "' class = " + receivedString + " style = 'width : 6em'>Received</button>";
    cell4.align = "right";
    addTablePaddingBetweenUsers(currentMonthIndex);
    numberOfWhoTables++;

    if (j <= names.d.length) {
        $("#loadingDiv").hide();
        $("#whoDiv" + (currentMonthIndex + 1)).show();
    }
}

function fillInMonthsAndYears() {

    function date(month, monthDisplay, year) {
        this.month = month;
        this.monthDisplay = monthDisplay;
        this.year = year;
    }

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

    for (var i = 1; i <= NUM_MONTHS_USED; i++) {
        $("#Order" + i).text(dates[i - 1].monthDisplay);
        $("#Who" + i).text(dates[i - 1].monthDisplay);
    }
}

function getOrdersByMonth(currentMonthIndex) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrdersByMonth_WS",
        data: "{month:\"" + dates[currentMonthIndex - 1].month + "\",year:\"" + dates[currentMonthIndex - 1].year + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        orders = data;
        fillOrderTabContinue(currentMonthIndex);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getOrdersByMonthForUser(currentMonthIndex, userName, j) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrdersByMonthForUser_WS",
        data: "{month:\"" + dates[currentMonthIndex].month + "\",year:\"" + dates[currentMonthIndex].year + "\",userName:\"" + userName + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        orders = data;
        fillWhoTabFinish(currentMonthIndex, j);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getOrderNamesAll(currentMonthIndex) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrderNamesAll_WS",
        data: "{month:\"" + dates[currentMonthIndex].month + "\",year:\"" + dates[currentMonthIndex].year + "\"}",
        beforeSend: function () {
            $("#loadingDiv").show();
            $("#whoDiv" + (currentMonthIndex + 1)).hide();
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        names = data;        
        fillWhoTabContinue(currentMonthIndex);        
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getOrderNamesPaid(currentMonthIndex) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrderNamesPaid_WS",
        data: "{month:\"" + dates[currentMonthIndex].month + "\",year:\"" + dates[currentMonthIndex].year + "\"}",
        beforeSend: function () {
            $("#loadingDiv").show();
            $("#whoDiv" + (currentMonthIndex + 1)).hide();
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        names = data;
        fillWhoTabContinue(currentMonthIndex);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getOrderNamesNotPaid(currentMonthIndex) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrderNamesNotPaid_WS",
        data: "{month:\"" + dates[currentMonthIndex].month + "\",year:\"" + dates[currentMonthIndex].year + "\"}",
        beforeSend: function () {
            $("#loadingDiv").show();
            $("#whoDiv" + (currentMonthIndex + 1)).hide();
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        names = data;
        fillWhoTabContinue(currentMonthIndex);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getOrderNamesReceived(currentMonthIndex) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrderNamesReceived_WS",
        data: "{month:\"" + dates[currentMonthIndex].month + "\",year:\"" + dates[currentMonthIndex].year + "\"}",
        beforeSend: function () {
            $("#loadingDiv").show();
            $("#whoDiv" + (currentMonthIndex + 1)).hide();
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        names = data;
        fillWhoTabContinue(currentMonthIndex);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getOrderNamesNotReceived(currentMonthIndex) {
    $.ajax({
        type: "POST",
        url: serviceURL + "getOrderNamesNotReceived_WS",
        data: "{month:\"" + dates[currentMonthIndex].month + "\",year:\"" + dates[currentMonthIndex].year + "\"}",
        beforeSend: function () {
            $("#loadingDiv").show();
            $("#whoDiv" + (currentMonthIndex + 1)).hide();
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true
    })
    .done(function (data) {
        names = data;
        fillWhoTabContinue(currentMonthIndex);
    })
    .fail(function (xhr) {
        alert(xhr.responseText);
    });
}

function getCoffees() {
    $.ajax({
        type: "POST",
        url: serviceURL + "getCoffees_WS",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false
    })
    .done(function (data) {
        coffees = data;
    })
    .fail(function (xhr) {
        alert(xhr.status);
    });
}