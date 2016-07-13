var grid;
var saved_data = {};

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


function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
        return {valid: false, msg: "This is a required field"};
    } else {
        return {valid: true, msg: null};
    }
}

function refresh_grid(grid_data) {
    grid = new Slick.Grid("#myGrid", grid_data, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());
    grid.onAddNewRow.subscribe(function (e, args) {
        var item = args.item;
        grid.invalidateRow(data.length);
        data.push(item);
        grid.updateRowCount();
        grid.render();
    });
}


function init_grid() {
    var grid_data = [];

    for (var i = 0; i < 20; i++) {
        var d = (grid_data[i] = {});
        d["index"] = i;
        d["data1"] = "";
        d["data2"] = "";
        d["data3"] = "";
        d["desc"] = "";
    }

    return grid_data;
}

function get_grid_data() {
    for (var i = 0; i < grid.getDataLength(); i++) {
        var d = (saved_data[i] = {});
        d["index"] = grid.getDataItem(i).index;
        d["data1"] = grid.getDataItem(i).data1;
        d["data2"] = grid.getDataItem(i).data2;
        d["data3"] = grid.getDataItem(i).data3;
        d["desc"] = grid.getDataItem(i).desc;
    }
}

function save_grid_data() {
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

function setDocumentName(name) {
    document.getElementById("document_name").value = name;
}

function get_data(index) {
    $.getJSON("api/data/".concat(index), function (db_data) {
        data = jQuery.parseJSON(db_data.data_list);

        setDocumentName(db_data.name);

        var grid_data = [];
        for (var i=0; i < 20; i++) {
            var d = (grid_data[i] = {});
            d["index"] = data[i].index;
            d["data1"] = data[i].data1;
            d["data2"] = data[i].data2;
            d["data3"] = data[i].data3;
            d["desc"] = data[i].desc;
        }

        refresh_grid(grid_data);
    });
}

function clearGrid() {
    setDocumentName("");
    grid_data = init_grid();
    refresh_grid(grid_data);
}

$(function () {
    grid_data = init_grid();
    refresh_grid(grid_data);

    grid.onCurrentCellChanged = function(args){
        data[args.row][grid.getColumns()[args.cell].field]
    };
})

$(document).ready(function() {
    $('#select_data_name').change(function() {
        var selection = document.getElementById("select_data_name");
        if (selection.selectedIndex != 0) {
            init_grid();
            get_data(selection.options[selection.selectedIndex].value);
        }
    });
});

$('#save_form_data').on('submit', function(event) {
    event.preventDefault();

    document_name = document.getElementById("document_name").value
    if (document_name == "") {
        alert("Please input your document title.");
        return
    }

    get_grid_data();
    save_grid_data();
    clearGrid();
});