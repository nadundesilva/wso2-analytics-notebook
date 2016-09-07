/**
 * Data source definition paragraph client prototype
 *
 * @param paragraph The paragraph in which the client resides in
 * @constructor
 */
function DataSourceDefinitionParagraphClient(paragraph) {
    var self = this;

    self.initialize = function () {
        // Adding event listeners
        paragraph.find(".data-source-type").change(function() {
            onTypeSelect();
        });

        paragraph.find(".data-source-table").change(function() {
            onTableChange();
        });

        paragraph.find(".output-table").keyup(function() {
            onOutputTableKeyUp();
        });
    };

    self.run = function(callback) {
        // TODO : run data source definition paragraph
    };

    /**
     * Run on paragraph type select tasks
     *
     * @private
     */
    var onTypeSelect = function() {
        var selectElement = paragraph.find(".data-source-type");
        var type;
        var url;
        switch (selectElement.val()) {
            case "Database" :
                type = "GET";
                url = "tables";
                break;
            case "CSV File" :
                break;
        }
        $.ajax({
            type: type,
            url : constants.API_URI + url,
            success: function(data) {
                var tablesSelectElement = selectElement.closest(".source").find(".data-source-table");
                tablesSelectElement.html($("<option disabled selected value> -- select an option -- </option>"));
                $.each(data, function(index, table) {
                    tablesSelectElement.append($("<option>" + table + "</option>"));
                });
                tablesSelectElement.parent().fadeIn();
            }
        });
    };

    /**
     * Run on input table select tasks
     *
     * @private
     */
    var onTableChange = function() {
        paragraph.find(".output-table").parent().fadeIn();
    };

    /**
     * Run on output table keyup tasks
     *
     * @private
     */
    var onOutputTableKeyUp = function() {
        var inputElement = paragraph.find(".output-table");
        if (inputElement.val().length != 0) {
//        sourceView.closest(".paragraph").find(".run").prop('disabled', false);
        } else {
//        sourceView.closest(".paragraph").find(".run").prop('disabled', true);
        }
    };
}
