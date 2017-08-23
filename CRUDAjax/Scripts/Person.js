//Load Data in Table when documents is ready
$(document).ready(function () {
    loadData();
    $('.datepicker').datepicker();
    var table;
});
//Load Data function
function loadData() {
    $.ajax({
        url: "/Home/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
           /*
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.ID + '</td>';
                html += '<td>' + item.LastName + '</td>';
                html += '<td>' + item.FirstName + '</td>';
                html += '<td>' + formatDate(item.HireDate) + '</td>';
                html += '<td>' + formatDate(item.EnrollmentDate) + '</td>';
                html += '<td>' + item.Discriminator + '</td>';
                html += '<td><a href="#" class="btn btn-info" onclick="return getbyID(' + item.ID + ')">Edit</a>  <a href="#" class="btn btn-danger" onclick="Delete(' + item.ID + ')">Delete</a></td>';
                html += '</tr>';
            });
            $('.tbody').html(html);
            */

            table = $('#data').DataTable({
                "retrieve": true,
                "processing": true,

                "ajax": {
                    "url": "/Home/List",
                    "dataSrc": ""
                },

                "columns": [
                    { "data": "ID" },
                    { "data": "LastName"},
                    { "data": "FirstName" },
                    {
                        "data": "HireDate",
                        "render": function (data) {
                            if (data != null) {
                                return moment(data).format('MMMM Do YYYY');
                            }
                            else
                            {
                                return 'Not Available';
                            }
                        }
                    },
                    {
                        "data": "EnrollmentDate",
                        "render": function (data) {
                            if (data != null) {
                                return moment(data).format('MMMM Do YYYY')
                            }
                            else {
                                return 'Not Available'
                            }
                        }
                    },
                    { "data": "Discriminator" },
                    { 
                        "mRender": function (data, type, row) {
                            return '<a onclick="getbyID('+ row.ID +')" href="#" class="btn btn-info">Edit</a>' + ' ' +
                                '<a onclick="Delete('+ row.ID+')" href="#" class="btn btn-danger">Delete</a>'
                        }
                    }
                ]
            })

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }

         

    });
}
//Add Data Function
function Add() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var empObj = {
        ID: $('#ID').val(),
        LastName: $('#LastName').val(),
        FirstName: $('#FirstName').val(),
        Discriminator: $('#Discriminator').val(),
        HireDate: $('#HireDate').val(),
        EnrollmentDate: $('#EnrollmentDate').val()
    };
    $.ajax({
        url: "/Home/Add",
        data: JSON.stringify(empObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
            $('.modal-backdrop').remove();
            $('#alert').removeClass();
            $('#alert').addClass('alert alert-success alert-dismissable');
            $('#alert').empty();
            $('#alert').html('<b> Adding Person Successful </b>');
            $('#alert').fadeTo(2000, 500).slideUp(500, function () { $('#alert').empty(); $().slideUp(500); });
            table.ajax.reload(null, false);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
//Function for getting the Data Based upon Employee ID
function getbyID(ID) {
    $('#LastName').css('border-color', 'lightgrey');
    $('#FirstName').css('border-color', 'lightgrey');
    $('#HireDate').css('border-color', 'lightgrey');
    $('#EnrollmentDate').css('border-color', 'lightgrey');
    $('#Discriminator').css('border-color', 'lightgrey');
    $.ajax({
        url: "/Home/getbyID/" + ID,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ID').val(result.ID);
            $('#LastName').val(result.LastName);
            $('#FirstName').val(result.FirstName);
            $('#HireDate').val(formatDate(result.HireDate));
            $('#EnrollmentDate').val(formatDate(result.EnrollmentDate));
            $('#Discriminator').val(result.Discriminator);
            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}
//function for updating employee's record
function Update() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var empObj = {
        ID: $('#ID').val(),
        LastName: $('#LastName').val(),
        FirstName: $('#FirstName').val(),
        HireDate: $('#HireDate').val(),
        EnrollmentDate: $('#EnrollmentDate').val(),
        Discriminator: $('#Discriminator').val()
    };
    $.ajax({
        url: "/Home/Update",
        data: JSON.stringify(empObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
            $('#ID').val("");
            $('#LastName').val("");
            $('#FirstName').val("");
            $('#HireDate').val("");
            $('#EnrollmentDate').val("");
            $('#alert').removeClass();
            $('#alert').addClass('alert alert-success alert-dismissable');
            $('#alert').empty();
            $('#alert').html('<b> Update Success </b>');
            $('#alert').fadeTo(2000, 500).slideUp(500, function () { $('#alert').empty(); $().slideUp(500); });
            table.ajax.reload(null, false);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
//function for deleting employee's record
function Delete(ID) {
    var ans = confirm("Are you sure you want to delete this Person?");
    if (ans) {
        $.ajax({
            url: "/Home/Delete/" + ID,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                loadData();
                $('#alert').removeClass();
                $('#alert').addClass('alert alert-success alert-dismissable');
                $('#alert').empty();
                $('#alert').html('<b> Deleting Person Successful </b>');
                $('#alert').fadeTo(2000, 500).slideUp(500, function () { $('#alert').empty(); $().slideUp(500); });
                table.ajax.reload(null, false);

            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}
//Function for clearing the textboxes
function clearTextBox() {
    $('#ID').val("");
    $('#LastName').val("");
    $('#FirstName').val("");
    $('#HireDate').val("");
    $('#EnrollmentDate').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#LastName').css('border-color', 'lightgrey');
    $('#FirstName').css('border-color', 'lightgrey');
    $('#HireDate').css('border-color', 'lightgrey');
    $('#EnrollmentDate').css('border-color', 'lightgrey');
}
//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#LastName').val().trim() == "") {
        $('#LastName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#LastName').css('border-color', 'lightgrey');
    }
    if ($('#FirstName').val().trim() == "") {
        $('#FirstName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#FirstName').css('border-color', 'lightgrey');
    }
    if ($('#Discriminator').val().trim() == "") {
        $('#Discriminator').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Discriminator').css('border-color', 'lightgrey');
    }
    return isValid;
}

//moment.js
function formatDate(date) {
    if (date != null)
    {
        return moment(date).format('MMMM Do YYYY');
    }
    else
    {
        return  '"Not Available"';
        
    }
}




