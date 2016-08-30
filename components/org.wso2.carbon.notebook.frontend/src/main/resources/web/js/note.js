// Functionality for the whole note
var note = {};

note.init = function() {
    var parameters = util.getQueryParameters();
    $("#note-name").html("Note_1");
    $("#note-path").html(parameters.note);
};

note.runAllParagraphs = function() {
    // Looping through the paragraphs and running them
    $(".paragraph").each(function(index, paragraph) {
        runParagraph($(paragraph));
    });
};

note.toggleVisibilityOfMultipleViews = function(type) {
    var toggleAllSourceOrOutputViewsButton = $("#toggle-all-" + type + "-views");
    var toggleSourceOrOutputViewButton = $(".toggle-" + type + "-view");
    if (toggleAllSourceOrOutputViewsButton.html().indexOf("Show") != -1) {
        var buttonTemplate = "<i class='fw fw-hide'></i> Hide " + type;
        toggleAllSourceOrOutputViewsButton.html(buttonTemplate);
        toggleSourceOrOutputViewButton.html(buttonTemplate);
        $("." + type).slideDown();
    } else {
        var buttonTemplate = "<i class='fw fw-view'></i> Show " + type;
        toggleAllSourceOrOutputViewsButton.html(buttonTemplate);
        toggleSourceOrOutputViewButton.html(buttonTemplate);
        $("." + type).slideUp();
    }
};

note.addParagraph = function() {
    var paragraph = $("<div class='paragraph well fluid-container'>");
    paragraph.css({ display : "none" });
    paragraph.load('paragraph.html', function() {
        $("#paragraphs").append(paragraph);
        paragraph.slideDown();
    });
};

note.delete = function() {
    // TODO : send the request to delete the note to the notebook server
};

// Functionality for paragraphs
var paragraphUtil = {};

paragraphUtil.run = function(paragraph) {  // TODO : This method needs to be changed after deciding on the architecture
    var paragraphType = paragraph.find("select[name='paragraph-type']").val();
    var outputView = paragraph.find(".output");

    /*
     * The function for running the run paragraph task
     * This is called later after checking if the output view is empty or not
     */
    var runParagraphTask = function() {
        /*
         * Callback function to be passed to paragraph run methods
         * This generates the output tags and adds the content passed into it
         * This is called from inside the relevant paragraph run method
         */
        var callbackFunction = function(output) {
            var newOutputView = $("<div class='output fluid-container' style='display: none;'>");
            newOutputView.append($("<p>Output</p>"));
            var newOutputViewContent = $("<div class='row'>");
            newOutputViewContent.append(output);
            newOutputView.append(newOutputViewContent);
            paragraph.find(".paragraph-content").append(newOutputView);

            newOutputView.slideDown();
            paragraph.find(".toggle-output-view").prop('disabled', false);
        };

        var paragraph;
        switch (paragraphType) {
            case "Data Source Definition" :
                paragraph = dataSourceDefinitionParagraph;
                break;
            case "Preprocessor" :
                paragraph = preprocessorParagraph;
                break;
            case "Data Visualization" :
                paragraph = dataVisualizationParagraph;
                break;
            case "Batch Analytics" :
                paragraph = batchAnalyticsParagraph;
                break;
            case "Interactive Analytics" :
                paragraph = interactiveAnalyticsParagraph;
                break;
            case "Event Receiver Definition" :
                paragraph = eventReceiverParagraph;
                break;
            case "Real Time Analytics" :
                paragraph = realTimeAnalyticsParagraph;
                break;
            case "Model Definition" :
                paragraph = modelDefinitionParagraph;
                break;
            case "Prediction" :
                paragraph = predictionParagraph;
                break;
            case "Event Simulation":
                paragraph = evenSimulationParagraph;
                break;
            case "Custom" :
                paragraph = customParagraph;
                break;
        }
        paragraph.run(paragraph, callbackFunction);
    };

    if (outputView.length > 0) {
        outputView.slideUp(function() {
            outputView.remove();
            runParagraphTask();
        });
    } else {
        runParagraphTask();
    }
};

paragraphUtil.toggleVisibilityOfSingleView = function(toggleButton, type) {
    var view = toggleButton.closest(".paragraph").find("." + type);
    var toggleButtonInnerHTML = toggleButton.html();
    if (toggleButton.html().indexOf("Show") != -1) {
        toggleButtonInnerHTML = "<i class='fw fw-hide'></i> Hide " + type;
        view.slideDown();
    } else {
        toggleButtonInnerHTML = "<i class='fw fw-view'></i> Show " + type;
        view.slideUp();
    }
    toggleButton.html(toggleButtonInnerHTML);
};

paragraphUtil.delete = function(paragraph) {
    // TODO : send the relevant query to the notebook server to delete
    paragraph.slideUp(function() {
        paragraph.remove();
    });
}

paragraphUtil.loadSourceViewByType = function(selectElement) {
    var paragraph = selectElement.closest(".paragraph");
    var paragraphContent = paragraph.find(".paragraph-content");
    paragraphContent.slideUp(function() {
        paragraphContent.children().remove();

        var sourceViewContent = $("<div>");
        var paragraphTemplateLink;
        var paragraphInitTask;
        switch (selectElement.val()) {
            case "Data Source Definition" :
                paragraphTemplateLink = "paragraph-templates/data-source-definition.html";
                break;
            case "Preprocessor" :
                paragraphTemplateLink = "paragraph-templates/preprocessor.html";
                paragraphInitTask = function() {
                    preprocessorParagraph.init(paragraph);
                };
                break;
            case "Data Visualization" :
                paragraphTemplateLink = "paragraph-templates/data-visualization.html";
                break;
            case "Batch Analytics" :
                paragraphTemplateLink = "paragraph-templates/batch-analytics.html";
                break;
            case "Interactive Analytics" :
                paragraphTemplateLink = "paragraph-templates/interactive-analytics.html";
                break;
            case "Event Receiver Definition" :
                paragraphTemplateLink = "paragraph-templates/event-receiver-definition.html";
                paragraphInitTask = function() {
                    eventReceiverDefinitionParagraph.init(paragraph);
                };
                break;
            case "Real Time Analytics" :
                paragraphTemplateLink = "paragraph-templates/real-time-analytics.html";
                break;
            case "Model Definition" :
                paragraphTemplateLink = "paragraph-templates/model-definition.html";
                break;
            case "Prediction" :
                paragraphTemplateLink = "paragraph-templates/prediction.html";
                break;
            case "Event Simulation" :
                paragraphTemplateLink = "paragraph-templates/event-simulation.html";
                break;
            case "Custom" :
                paragraphTemplateLink = "paragraph-templates/custom.html";
                break;
        }

        sourceViewContent.load(paragraphTemplateLink, function() {
            var sourceView = $("<div class='source fluid-container'>");
            sourceView.append($("<p>Source</p>"));
            sourceView.append(sourceViewContent);
            paragraphContent.append(sourceView);
            paragraphContent.slideDown();

            // paragraph.find(".run").prop('disabled', true);
            paragraph.find(".toggle-source-view").prop('disabled', false);
            paragraph.find(".toggle-output-view").prop('disabled', true);

            if (paragraphInitTask != undefined) {
                paragraphInitTask();
            }
        });
    });
};

paragraphUtil.loadAvailableParagraphOutputsToInputElement = function(selectElement, type) {
    var inputSelectElement = $(selectElement);
    inputSelectElement.html($("<option disabled selected value> -- select an option -- </option>"));

    $(".output-" + type).each(function (index, selectElement) {
        if (selectElement.value.length > 0) {
            inputSelectElement.append($("<option>" + selectElement.value + "</option>"));
        }
    });
};