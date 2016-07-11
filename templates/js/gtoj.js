function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
        return {valid: false, msg: "This is a required field"};
    } else {
        return {valid: true, msg: null};
    }
}

var grid;
var data = [];
var columns = [
    {id: "index", name: "Index", field: "index", width: 80, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator},
    {id: "data1", name: "Data1", field: "data1", width: 80, editor: Slick.Editors.Text},
    {id: "data2", name: "Data2", field: "data2", width: 80, editor: Slick.Editors.Text},
    {id: "data2", name: "Data3", field: "data3", width: 80, editor: Slick.Editors.Text},
    {id: "desc", name: "Description", field: "desc", width: 300, editor: Slick.Editors.LongText},
];

var options = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
};

$(function () {
    for (var i = 0; i < 20; i++) {
        var d = (data[i] = {});
        d["index"] = i;
        d["data1"] = "";
        d["data2"] = "";
        d["data3"] = "";
        d["desc"] = "";
    }
    grid = new Slick.Grid("#myGrid", data, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());
    grid.onAddNewRow.subscribe(function (e, args) {
        var item = args.item;
        grid.invalidateRow(data.length);
        data.push(item);
        grid.updateRowCount();
        grid.render();
    });

    grid.onCurrentCellChanged = function(args){
        data[args.row][grid.getColumns()[args.cell].field]
    };
})


$('#save_form_data').on('submit', function(event) {
    event.preventDefault();

    document_name = document.getElementById("document_name").value
    if (document_name == "") {
        alert("Please input your document title.");
        return
    }

    getting_data();
    save_data();
});

var saved_data = {};
function getting_data() {
    for (var i = 0; i<grid.getDataLength(); i++) {
        if (grid.getDataItem(i).sequence == '') {
            continue;
        }

        var d = (saved_data[i] = {});
        d["index"] = grid.getDataItem(i).index;
        d["data1"] = grid.getDataItem(i).data1;
        d["data2"] = grid.getDataItem(i).data2;
        d["data3"] = grid.getDataItem(i).data3;
        d["desc"] = grid.getDataItem(i).desc;
    }
}

function save_data() {
    $.ajax({
        url : "api/data/",
        type : "POST",
        dataType : "json",
        data : { name : document_name,
            data_list : JSON.stringify(saved_data)
        },
        success : function() {
            alert( "Success" )
        }
    })
}