'use strict';

var hostWebUrl;
var appWebUrl;
var ctx;
var appCtxSite;
var web;

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        //getUserName();
        hostWebUrl = decodeURIComponent(manageQueryStringParameter('SPHostUrl'));
        appWebUrl = decodeURIComponent(manageQueryStringParameter('SPAppWebUrl'));
        ctx = new SP.ClientContext(appWebUrl);
        appCtxSite = new SP.AppContextSite(ctx, hostWebUrl);
        web = appCtxSite.get_web();
        $("#btnSubmit").on('click', function () {
            createListItem();
        });

        $("#btnUpdate").on('click', function () {
            updateItem();
            ClearData();
        });

        $("#btnClear").on('click', function () {
            ClearData();
        });
        $("#btnFind").on('click', function () {
            $('#empName').val("");
            $("#empSalary").val("");
            $("#tblAddress").val("");
            $("#tblEmployees").empty();
            GetRegistrationDetailsByID();
        });

        $("#btnDelete").on('click', function () {
            deleteItem();
            ClearData();
        }); 
    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
    }

    // This function is executed if the above call fails
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }

    function ClearData() {

        $("#txtFullName").val("");
        $('#txtAddress').val("");
        $("#txtEmailID").val("");
        $("#txtMobile").val("");
        $("#txtItemID").val("");
    }

    function createListItem() {
        alert('Submit button is clicked');
        alert('_spPageContextInfo.siteAbsoluteUrl:' + _spPageContextInfo.siteAbsoluteUrl);
        alert($("#txtFullName").val());
        $.ajax({
            url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('RegistrationDetails')/items",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify
                ({
                    __metadata:
                    {
                        type: "SP.Data.RegistrationDetailsListItem"
                    },
                    FullName: $("#txtFullName").val(),
                    Address: $("#txtAddress").val(),
                    EmailID: $("#txtEmailID").val(),
                    Mobile: $("#txtMobile").val()
                }),
            headers: {
                "Accept": "application/json;odata=verbose", // return data format  
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data, status, xhr) {
                alert("Successfully Submitted");
                ClearData();
            },
            error: function (xhr, status, error) {
                alert('Error saving data');
                alert(JSON.stringify(error));
            }
        });
    }

    function manageQueryStringParameter(paramToRetrieve) {
        var params =
            document.URL.split("?")[1].split("&");
        var strParams = "";
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve) {
                return singleParam[1];
            }
        }
    }
}
