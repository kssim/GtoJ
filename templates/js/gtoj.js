var grid;

var columns = [
    {
        id: "index",
        name: "Index",
        field: "index",
        width: 80,
        cssClass: "cell-title",
        validator: required_field_vaildator
    },
    {id: "title", name: "Title", field: "title", width: 120, editor: Slick.Editors.Text, cssClass: "cell-title"},
    {id: "duration", name: "Duration", field: "duration", editor: Slick.Editors.Text, width: 85},
    {id: "percent_complete", name: "Complete(%)", field: "percent_complete", editor: Slick.Editors.Text, width: 85},
    {
        id: "graph_complete",
        name: "Complete",
        field: "graph_complete",
        width: 80,
        resizable: false,
        formatter: Slick.Formatters.PercentCompleteBar
    },
    {
        id: "effort-driven",
        name: "Effort Driven",
        sortable: false,
        width: 80,
        minWidth: 20,
        maxWidth: 80,
        cssClass: "cell-effort-driven",
        field: "effortDriven",
        formatter: Slick.Formatters.Checkmark
    },
    {id: "desc", name: "Description", field: "desc", width: 220, editor: Slick.Editors.LongText},
];

var options = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
};


function required_field_vaildator(value) {
    if (value == null || value == undefined || !value.length) {
        return {valid: false, msg: "This is a required field"};
    } else {
        return {valid: true, msg: null};
    }
}

function refresh_grid(grid_data) {
    clear_row_count();

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

function init_grid(row_count=20) {
    var grid_data = [];

    for (var i = 0; i < row_count; i++) {
        var d = (grid_data[i] = {});
        d["index"] = i + 1;
        d["title"] = "";
        d["duration"] = "";
        d["percent_complete"] = "0";
        d["graph_complete"] = Math.min(100, 0);
        d["effortDriven"] = (i % 3 == 0);
        d["desc"] = "";
    }

    return grid_data;
}

function save_grid_data() {
    var saved_data = {};
    for (var i = 0; i < grid.getDataLength(); i++) {
        var d = (saved_data[i] = {});
        d["index"] = grid.getDataItem(i).index;
        d["title"] = grid.getDataItem(i).title;
        d["duration"] = grid.getDataItem(i).duration;
        d["percent_complete"] = grid.getDataItem(i).percent_complete;
        d["effortDriven"] = grid.getDataItem(i).effortDriven;
        d["desc"] = grid.getDataItem(i).desc;
    }

    $.ajax({
        url: "api/data/",
        type: "POST",
        dataType: "json",
        data: {
            name: document_name,
            data_list: JSON.stringify(saved_data)
        },
        success: function () {
            alert("Success")
        }
    })
}

function set_document_name(name) {
    document.getElementById("document_name").value = name;
}

function get_data(index) {
    $.getJSON("api/data/".concat(index), function (db_data) {
        data = jQuery.parseJSON(db_data.data_list);

        set_document_name(db_data.name);

        grid_row_count = Object.keys(data).length;

        var grid_data = [];
        for (var i = 0; i < grid_row_count; i++) {
            var d = (grid_data[i] = {});
            d["index"] = grid.getDataItem(i).index;
            d["title"] = grid.getDataItem(i).title;
            d["duration"] = grid.getDataItem(i).duration;
            d["percent_complete"] = grid.getDataItem(i).percent_complete;
            d["effortDriven"] = grid.getDataItem(i).effortDriven;
            d["desc"] = grid.getDataItem(i).desc;
        }

        refresh_grid(grid_data);
    });
}

function clear_grid() {
    set_document_name("");
    grid_data = init_grid();
    refresh_grid(grid_data);

    $('#select_data_name option:eq(0)').attr('selected', 'selected');
}

function clear_row_count() {
    document.getElementById("set_row_count").value = "";
}

function add_select_item(document_name) {
    index = $('#select_data_name option').size();
    $('#select_data_name').append('<option value=' + index + '>' + document_name + '</option>');
}

function set_grid_row() {
    row_count = $('#set_row_count').val();
    grid_data = init_grid(row_count);
    refresh_grid(grid_data);
}


$(function () {
    grid_data = init_grid();
    refresh_grid(grid_data);

    grid.onCurrentCellChanged = function (args) {
        grid_data[args.row][grid.getColumns()[args.cell].field]
    };

    grid.onCellChange.subscribe(function(e, args) {
        if (args.cell != 3) {  // Fix me.
            return;
        }

        grid_data[args.row]["graph_complete"] = Math.min(100, grid_data[args.row]["percent_complete"]);
        grid.invalidate();
    });
})

$(document).ready(function () {
    $('#select_data_name').change(function () {
        var selection = document.getElementById("select_data_name");
        if (selection.selectedIndex != 0) {
            init_grid();
            get_data(selection.options[selection.selectedIndex].value);
        }
    });
});

$('#save_form_data').on('submit', function (event) {
    event.preventDefault();

    document_name = document.getElementById("document_name").value
    if (document_name == "") {
        alert("Please input your document title.");
        return
    }

    save_grid_data();
    clear_grid();
    add_select_item(document_name);
});