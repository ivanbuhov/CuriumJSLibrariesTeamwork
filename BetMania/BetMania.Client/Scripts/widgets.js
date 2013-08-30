// Widgets
var widgets = (function() {

    function editableTextWidget(element) {
        var wrapperElement;
        var contentElement = $(element);
        var editButton;
        var saveButton;
        var textBox = $("<input type='text' maxlength='20' class='editable-field' />");
        var enabled = true;

        var init = function () {
            contentElement.addClass("editable-text").wrap("<div class='editable-widget' />");
            wrapperElement = contentElement.parent();
            editButton = $("<a class='editable-edit-button'></a>");
            saveButton = $("<a class='editable-save-button'></a>");
            wrapperElement.append(editButton);
            wrapperElement.append(saveButton);
            putEventListeners();
        }

        var putEventListeners = function () {
            editButton.on("click", function () {
                textBox.css("border-color", "#0f0");
                textBox.val(contentElement.text());
                contentElement.text("");
                contentElement.prepend(textBox);
                saveButton.css("display", "inline-block");
                editButton.css("display", "none");
            });
            saveButton.on("click", function () {
                var text = $.trim(textBox.val());
                if (text.length > 0) {
                    textBox.detach();
                    contentElement.text(text);
                    editButton.css("display", "inline-block");
                    saveButton.css("display", "none");
                    // Triggering valueChanged event
                    var ev = $.Event("valueChanged");
                    ev.value = text;
                    contentElement.trigger(ev);
                } else {
                    textBox.css("border-color", "#f00");
                }
            });
            textBox.on('focusout', function () {
                saveButton.trigger("click");
            })
            .on("keyup", function (ev) {
                if (ev.which == 13) {
                    saveButton.trigger("click");
                }
            });
        }

        var edit = function (initialValue) {
            if (editButton.css("display") != "none") {
                initialValue = $.trim(initialValue);
                if (initialValue.length > 0) {
                    contentElement.text(initialValue);
                }
                editButton.trigger("click");
            }
        }

        var save = function () {
            if (saveButton.css("display") != "none") {
                saveButton.trigger("click");
            }
        }

        var value = function () {
            return contentElement.text();
        }

        var disable = function () {
            if (enabled) {
                if (saveButton.css("display") != "none") {
                    return false;
                }
                editButton.css("display", "none");
                enabled = false;
                return true;
            }

            return true;
        }

        var enable = function () {
            if (!enabled) {
                editButton.css("display", "inline-block");
                enabled = true;
                return true;
            }

            return true;
        }

        init();

        return {
            edit: edit,
            save: save,
            value: value,
            disable: disable,
            enable: enable
        }

    }

    function optionsWidget(element, values, startingIndex, menuIsUp) {
        var wrapperElement;
        var menuElement;
        var menuItems;
        var contentElement = $(element);
        var contentItems;
        var currentIndex = -1;
        var enabled = true;

        var init = function () {
            contentElement.addClass("options-content").wrap("<div class='options-widget' />");
            contentItems = contentElement.children();
            wrapperElement = contentElement.parent();
            var menu = "<ul class='options-menu'>";
            for (var i = 0; i < values.length; i++) {
                menu += "<li><a>" + values[i] + "</a></li>";
            }
            menu += "</ul>";
            if (menuIsUp) {
                wrapperElement.prepend(menu);
            }
            else {
                wrapperElement.append(menu);
            }
            menuElement = wrapperElement.children(".options-menu");
            menuItems = menuElement.children();
            adjustHeight();
            addEventListeners();
            select(startingIndex);
        }

        var select = function (index) {
            if (index != currentIndex && enabled) {
                wrapperElement.find(".selected").removeClass("selected");
                menuItems.eq(index).addClass("selected");
                contentItems.eq(index).addClass("selected");
                currentIndex = index;
                // Triggering valueChanged event
                var ev = $.Event("valueChanged");
                ev.value = value;
                contentElement.trigger(ev);
            }
        }

        var addEventListeners = function () {
            menuElement.on("click", "li", function () {
                select($(this).index());
            });
        }

        var adjustHeight = function () {
            var maxHeight = 0;
            contentItems.each(function () {
                var height = $(this).outerHeight();
                if (maxHeight < height) {
                    maxHeight = height;
                }
            });
            contentElement.css("height", maxHeight + "px");
        }

        var disable = function () {
            if (enabled) {
                menuElement.off("click");
                enabled = false;
            }
        }

        var enable = function () {
            if (!enabled) {
                addEventListeners();
                enabled = true;
            }
        }

        var value = function () {
            return values[currentIndex];
        }

        var getContentElement = function () {
            return contentElement;
        }

        init();

        return {
            value: value,
            select: select,
            enable: enable,
            disable: disable,
            getContentElement: getContentElement
        }
    }

    function toolTipWidget(content, type, closable, arrowOffset) {

        var wrapperElement = $(document.createElement("div")).addClass("tooltip-widget");
        var contentElement = $(document.createElement("div")).addClass("tooltip-content");
        var closeElement = $(document.createElement("div")).addClass("tooltip-close");
        var arrow = $(document.createElement("div")).addClass("tooltip-arrow").addClass(type);
        var timer;

        var init = function () {
            contentElement.append(content);
            wrapperElement.append(contentElement);
            wrapperElement.append(arrow);
            if (arrowOffset) { arrowOffset = arrowOffset | 0; }
            else { arrowOffset = 20; }
            if (type == "left" || type == "right") { arrow.css("top", arrowOffset + "px"); }
            else { arrow.css("left", arrowOffset + "px"); }
            if (closable) {
                addCloseButton();
            }
        }

        var addCloseButton = function () {
            wrapperElement.append(closeElement);
            closeElement.on("click", hide);
        }

        var show = function (top, left, hideAfter) {
            wrapperElement.css("top", top + "px");
            wrapperElement.css("left", left + "px");
            $(document.body).append(wrapperElement);
            wrapperElement.fadeIn(400);
            if (hideAfter) {
                hideAfter = hideAfter | 0;
                timer = setTimeout(hide, hideAfter);
            }
        }

        var hide = function () {
            wrapperElement.fadeOut(400);
        }

        init();

        return {
            show: show,
            hide: hide
        }
    }

    function boardManager(element, difficulty, notShuffle) {
        var board = $(element).addClass("board-wdget");
        var cards;
        var difficulties = {
            easy: { top: 80, left: 35, topGap: 30, leftGap: 30, inARow: 6, count: 18 },
            medium: { top: 55, left: 25, topGap: 20, leftGap: 20, inARow: 7, count: 28 },
            hard: { top: 30, left: 10, topGap: 10, leftGap: 10, inARow: 8, count: 40 }
        };
        var currentDifficulty = {};
        var gameStarted = false;
        var moves = 0;
        var openedCards = [];
        var openedCount = 0;

        var init = function () {
            updateView(difficulty);
        }
        
        var updateView = function (difficulty) {
            if (!difficulty || gameStarted) {
                return;
            }
            if (typeof difficulty == "string") {
                difficulty = difficulties[difficulty.toLowerCase()];
            }
            if (areDifficultiesEqual(currentDifficulty, difficulty)) {
                return;
            }

            currentDifficulty = difficulty;
            var cards = board.children();
            var count = cards.length;
            // Adding additional cards
            for (var i = count; i < currentDifficulty.count; i++) {
                board.append("<div class='card'><div class='closed'></div></div>");
            }
            // Removing non needed cards
            cards.filter(":gt(" + (currentDifficulty.count - 1) + ")").remove();

            // Reposition the cards
            cards = board.children();
            var index = 0;
            cards.each(function () {
                jThis = $(this);
                var row = Math.floor(index / currentDifficulty.inARow);
                var col = index % currentDifficulty.inARow;
                var top = currentDifficulty.top + row * (jThis.height() + currentDifficulty.topGap);
                var left = currentDifficulty.left + col * (jThis.width() + currentDifficulty.leftGap);
                $(this).stop().animate({ top:  top, left: left }, 1000);
                index++;
            });

        }

        var areDifficultiesEqual = function (diff1, diff2) {
            if (diff1.top == diff2.top && diff1.left == diff2.left && diff1.topGap == diff2.topGap &&
                diff1.leftGap == diff2.leftGap && diff1.inARow == diff2.inARow && diff1.count == diff2.count) {
                return true;
            }

            return false;
        }

        var startGame = function (type) {
            if (!gameStarted) {
                type = type.toLowerCase();
                cards = board.children().each(function () {
                    $(this).append("<div class='opened'></div>");
                });
                cards.children(".opened").css("background", "url('img/gametypes/" + type + ".png') no-repeat");
                var width = cards.width();
                var height = cards.height();
                var indices = generateRandomIndicesArray();
                cards.each(function (index) {
                    var jThis = $(this);
                    jThis.data("id", indices[index]);
                    var left = (Math.floor(indices[index] % 5) * (-width)) + "px ";
                    var top = (Math.floor(indices[index] / 5) * (-height)) + "px";
                    jThis.children(".opened").css("background-position", left + top);
                });
                addTurningHandler();
                gameStarted = true;
                // Triggering gameStarted event
                var ev = $.Event("gameStarted");
                board.trigger(ev);
            }
        }

        var addTurningHandler = function() {
            board.on("click", ".card", function () {
                var jThis = $(this);
                open(jThis);
            });
        }

        var open = function (jCard) {
            // If the card is already opened
            for (var i = 0; i < openedCards.length; i++) {
                if (openedCards[i][0] === jCard[0]) {
                    return;
                }
            }

            var toBeHidden = true;

            if (openedCards.length == 0 || openedCards.length >= 2) {
                closeOpenedCards();
                openedCards.push(jCard);
                toBeHidden = false;
            }
            else if (openedCards.length == 1) {
                if (openedCards[0].data("id") == jCard.data("id")) {
                    openedCount += 2;
                    toBeHidden = false;
                    openedCards = [];
                }
                else {
                    openedCards.push(jCard);
                }

                moves++;
                board.trigger($.Event("moveMade"));
            }

            if (openedCount == cards.length) {
                gameStarted = false;
                board.trigger($.Event("gameOver"));
            }

            jCard.fadeOut(300).promise(toBeHidden)
                .then(function () {
                    var jThis = $(this);
                    jThis.children(".closed").css("display", "none");
                    jThis.children(".opened").css("display", "block");
                    return jThis.fadeIn(300).promise()
                        .then(function () {
                            if (toBeHidden) {
                                closeOpenedCards();
                            }
                        });
                });
        }

        var closeOpenedCards = function () {
            for (var i = 0; i < openedCards.length; i++) {
                openedCards[i].finish();
                close(openedCards[i]);
            }
            openedCards = [];
        }

        var close = function (jCard) {
            jCard.children(".closed").css("display", "block");
            jCard.children(".opened").css("display", "none");
        }

        var generateRandomIndicesArray = function(){
            var indices = new Array();
            var count = currentDifficulty.count / 2;
            for (var i = 0; i < count; i++) {
                indices.push(i);
                indices.push(i);
            }
            if (!notShuffle) {
                for (var i = 0; i < indices.length; i++) {
                    //swap
                    var temp = indices[i];
                    var other = Math.floor(Math.random() * indices.length);
                    indices[i] = indices[other];
                    indices[other] = temp;
                }
            }

            return indices;
        }

        var getMoves = function () {
            return moves;
        }

        var clear = function () {
            moves = 0;
            openedCount = 0;
            openedCards = new Array();
            currentDifficulty = {};
            cards.remove();
            cards = null;
            board.off("click", ".card");
            
        }

        init();

        return {
            updateView: updateView,
            startGame: startGame,
            getMoves: getMoves,
            clear: clear
        }

    }

    function modalBoxWidget(element) {
        var wrapperElement = $(document.createElement("div"));
        var containerElement = $(document.createElement("div"));
        var contentElement = $(element);
        var closeButton = $(document.createElement("div")).addClass("modal-box-close");

        var init = function () {
            wrapperElement.addClass("modal-box-widget");
            containerElement.addClass("modal-box-container");
            wrapperElement.append(containerElement);
            containerElement.append(element);
            contentElement.prepend(closeButton);
            addEventListeners();
        }

        var addEventListeners = function () {
            closeButton.on("click", function () {
                wrapperElement.fadeOut(300);
                contentElement.trigger($.Event("boxClosed"));
            });
        }

        var show = function () {
            $(document.body).append(wrapperElement);
            wrapperElement.fadeIn(300);
        }

        init();

        return {
            show: show
        }

    }

    function resultsRepository(key, top) {

        var init = function () {
            upgradeLocalStorage();
            if (!localStorage || !localStorage.getObject(key)) {
                localStorage.setObject(key, {});
            }
            if (!top) {
                top = 6;
            }
        }

        var upgradeLocalStorage = function () {
            if (!Storage.prototype.setObject) {
                Storage.prototype.setObject = function setObject(key, obj) {
                    var jsonObj = JSON.stringify(obj);
                    this.setItem(key, jsonObj);
                };

            }
            if (!Storage.prototype.getObject) {
                Storage.prototype.getObject = function getObject(key) {
                    var jsonObj = this.getItem(key);
                    var obj = JSON.parse(jsonObj);
                    return obj;
                };
            }
        }

        var addResult = function (result) {
            var results = localStorage.getObject(key);
            if (!results[result.difficulty]) {
                results[result.difficulty] = [result];
                saveResults(results);
                return true;
            }

            var currentDifficulty = results[result.difficulty.toLowerCase()];
            var position = 0;
            for (var i = 0; i < currentDifficulty.length; i++) {
                if (compareResults(result, currentDifficulty[i]) < 0) {
                    break;
                }
                position++;
            }

            if (position < top) {
                insertIn(currentDifficulty, position, result);
                saveResults(results);
                return true;
            }

            return false;
        }

        var getResults = function () {
            return localStorage.getObject(key);
        }

        var clear = function (difficulty) {
            var results = localStorage.getObject(key);
            results[difficulty] = [];
            saveResults(results);
        }

        var insertIn = function (array, position, element) {
            if (array.length >= top) {
                array.pop();
            }
            array.splice(position, 0, element);
        }

        var saveResults = function (resultsObject) {
            localStorage.setObject(key, resultsObject);
        }

        var compareResults = function (result1, result2) {
            var result = 0;
            if (result1.time < result2.time) {
                result = -1;
            }
            else if (result1.time > result2.time) {
                result = 1;
            }
            else {
                if (result1.moves < result2.moves) {
                    result = -1;
                }
                else if (result1.moves > result2.moves) {
                    result = 1;
                }
            }

            return result;
        }

        init();

        return {
            add: addResult,
            get: getResults,
            clear: clear
        }

    }

    return {
        editableTextWidget: editableTextWidget,
        optionsWidget: optionsWidget,
        toolTipWidget: toolTipWidget,
        boardManager: boardManager,
        modalBoxWidget: modalBoxWidget,
        resultsRepository: resultsRepository
    }

}());