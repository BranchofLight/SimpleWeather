/**
 * Purpose: Game Logic
 * Source:  src/logic.js
 */

 /**
  * Sets up any variables needing defaults
  * Note: should be called before anything else in game
  * @param {Object} settings
  */
 var gameSetup = function(settings) {
   // If not an object (or null) set to a default object (eg. beginner)
   settings = (typeof settings === "object" && settings !== null) ? settings :
   {
     diff: "beginner",
     rows: 9,
     cols: 9,
     mines: 10,
   };

   gameSettings = settings;

   gameField.setTotalMines(settings.mines);
   gameField.generateField(settings.rows, settings.cols);
   timer.setTimeLeft(0, true);

   // Display all views
   gameView.displayGameView();
   $('#main-container').hide();
   $('#main-container').fadeIn(1000, function() {
     // One second increments
     timer.startTimer(1000);
   });
 };

 var botGameSetup = function(settings) {
   // If not an object (or null) set to a default object (eg. beginner)
   settings = (typeof settings === "object" && settings !== null) ? settings :
   {
     diff: "beginner",
     rows: 9,
     cols: 9,
     mines: 10,
   };

   gameSettings = settings;

   gameField.setTotalMines(settings.mines);
   gameField.generateField(settings.rows, settings.cols);
   timer.setTimeLeft(0, true);

   // Display all views
   gameView.displayBotGameView();
 };

 /**
  * Returns a blank cell value
  * @return {String} ' '
  */
var blank = function() {
 	return ' ';
};

/**
 * Returns a mine cell value
 * @return {String} 'X'
 */
var mine = function() {
  return 'X';
};

 /**
  * Name: gameField
  * Purpose: Object holding all information
  * about the game field
  */
var gameField = function () {
	/* Private Variables */
	var rows = 0;
	var columns = 0;
	var field = [];
  var totalMines = 0;

	/* Object Literal */
	return {
    getTotalMines: function() {
      return totalMines;
    },
    // Sets the total number of mines on the field
    setTotalMines: function(m) {
      totalMines = m;
    },
    /**
     * Gets flags left to place
     * @return {Number} flagsLeft
     */
    getFlagsLeft: function() {
      var flagsFound = 0;
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          if (field[i][j].getIsFlagged()) {
            flagsFound += 1;
          }
        }
      }

      return totalMines - flagsFound;
    },
		// Returns columns
		getColumns: function() {
			return columns;
		},
		// Returns rows
		getRows: function() {
			return rows;
		},
		getCell: function(r, c) {
			return field[r][c];
		},
		/**
		 * Returns a generated empty
		 * . field based on given paramaters
		 * @param {Number} rows
		 * @param {Number} columns
		 * @return {Array} arr
		 */
		generateField: function(r, c) {
			// Set new values
			rows = (typeof r === "number") ? r : 0;
			columns = (typeof c === "number") ? c : 0;
      // Get mine locations
      var mineLocations = this.generateMineLocations();
      // Create iterators early to be used multiple times
      field = [];
      var i = 0, j = 0;
			// Push new field onto field
			for (i = 0; i < rows; i++) {
				// New array (row)
				field.push([]);
				for (j = 0; j < columns; j++) {
          var foundMine = false;
          // Loop through mine locations to see if there are any matches
          for (var x = 0; x < mineLocations.length; x++) {
            // If loop is at a mine location
            if (mineLocations[x][0] === i && mineLocations[x][1] === j) {
              foundMine = true;
              // Remove element in hopes of gaining efficiency on large
              // . arrays
              mineLocations.splice(x, 1);
              // Leave loop, we found a mine
              break;
            }
          }
          if (!foundMine)
            field[i].push(cell(i, j, blank()));
          else
            field[i].push(cell(i, j, mine()));
				}
			}
      // With mines and cells generated, time to calculate and add numbers
      for (i = 0; i < rows; i++) {
				for (j = 0; j < columns; j++) {
          // If the value is not a mine
          if (field[i][j].getRealValue() !== mine()) {
            // Calculate adjacent mines
            var newVal = numOfAdjacentMines(field[i][j]);
            // Make sure it isn't zero which will be blank!
            if (newVal !== 0) {
              // Set new value
              field[i][j].setRealValue(newVal);
              // Set CSS on cells in view! (displayField)
            }
          }
				}
			}
		},
    /**
		 * Returns an array of mine locations
		 * @return {Array} arr
		 */
    generateMineLocations: function() {
      var arr = [];
      var randRow = 0;
      var randCol = 0;
      while (totalMines > arr.length) {
        randRow = Math.floor(Math.random() * (rows));
        randCol = Math.floor(Math.random() * (columns));

        // Check all pairs for duplicates
        for (var i = 0; i < arr.length; i++) {
          var rowValue = arr[i][0];
          var colValue = arr[i][1];
          if (rowValue === randRow && colValue === randCol)
          {
            // Get a new random pair and restart loop
            randRow = Math.floor(Math.random() * (rows));
            randCol = Math.floor(Math.random() * (columns));
            i = 0;
          }
        }

        arr.push([randRow, randCol]);
      }

      return arr;
    }
	};
}();

/**
 * Name: cell
 * Purpose: For holding information pertaining
 * . to an individual cell in the game field
 * @param {Number} r
 * @param {Number} c
 * @param {Number} val
 */
var cell = function(r, c, val) {
	/* Set Private Variables */
	var row = (typeof r === "number") ? r : 0;
	var col = (typeof c === "number") ? c : 0;
	var value = val; // Allow it to be anything
	var isClicked = false;
  var isFlagged = false;

	/* Object Literal */
	return {
		getRow: function() {
			return row;
		},
		getCol: function() {
			return col;
		},
		// Returns the actual value regardless
		// . if it's shown
		getRealValue: function() {
			return value;
		},
    setRealValue: function(val) {
      value = val || blank();
    },
		// Returns the value shown to the player
		getShownValue: function() {
			return (isClicked) ? value : blank();
		},
		getIsClicked: function() {
			return isClicked;
		},
		setIsClicked: function(val) {
			isClicked = (typeof val === "boolean") ? val : false;
		},
    getIsFlagged: function() {
      return isFlagged;
    },
    setIsFlagged: function(val) {
      isFlagged = (typeof val === "boolean") ? val : false;
    }
	};
};

/**
 * Returns an array of cells adjacent to the paramater cell
 * @param {Object} cellToCheck
 * @return {Array} adjacentCells
 */
var getAdjacentCells = function(cellToCheck) {
  var r = cellToCheck.getRow();
  var c = cellToCheck.getCol();

  // All locations to check
  var adjacent = [
    [r-1, c-1],
    [r-1, c],
    [r-1, c+1],
    [r, c-1],
    [r, c+1],
    [r+1, c-1],
    [r+1, c],
    [r+1, c+1]
  ];

  var adjacentCells = [];

  for (var i = 0; i < adjacent.length; i++) {
    var row = adjacent[i][0];
    var col = adjacent[i][1];

    // If location is out of bounds do not check anything
    if (row >= 0 && row < gameField.getRows() &&
        col >= 0 && col < gameField.getColumns()) {
      adjacentCells.push(gameField.getCell(row, col));
    } else if (typeof isBot === "boolean" && isBot) {
      // Location out of bounds but bot calling this? Add padding
      var newCell = cell(row, col, NaN);
      newCell.setIsClicked(true);
      adjacentCells.push(newCell);
    }
  }

  return adjacentCells;
};

/**
 * Returns an array of deep copied cells adjacent to the paramater cell
 * @param {Object} cellToCheck
 * @return {Array} adjacentCells
 */
var botGetAdjacentCells = function(cellToCheck) {
  var r = cellToCheck.getRow();
  var c = cellToCheck.getCol();

  // All locations to check
  var adjacent = [
    [r-1, c-1],
    [r-1, c],
    [r-1, c+1],
    [r, c-1],
    [r, c+1],
    [r+1, c-1],
    [r+1, c],
    [r+1, c+1]
  ];

  var adjacentCells = [];

  for (var i = 0; i < adjacent.length; i++) {
    var row = adjacent[i][0];
    var col = adjacent[i][1];

    // If location is out of bounds do not check anything
    if (row >= 0 && row < gameField.getRows() &&
        col >= 0 && col < gameField.getColumns()) {
      // Create oldCell to make push slimmer
      var oldCell = gameField.getCell(row, col);
      // The oldCell is now deep copied to prevent getShownValue changing
      // over the bots lifespan
      var nCell = cell(oldCell.getRow(), oldCell.getCol(), oldCell.getRealValue());
      nCell.setIsClicked(oldCell.getIsClicked());
      nCell.setIsFlagged(oldCell.getIsFlagged());
      adjacentCells.push(nCell);
    } else {
      // Location out of bounds? Add padding
      var newCell = cell(row, col, NaN);
      // Spoof it as clicked
      newCell.setIsClicked(true);
      adjacentCells.push(newCell);
    }
  }

  return adjacentCells;
};

/**
 * Calculates and returns the number of
 * . mines adjacent to a cell paramater
 * @param {Object} cellToCheck
 * @return {Number} numOfMines
 */
var numOfAdjacentMines = function(cellToCheck) {
  var numOfMines = 0;
  var adjacentCells = getAdjacentCells(cellToCheck);

  for (var i = 0; i < adjacentCells.length; i++) {
    if (adjacentCells[i].getRealValue() === mine()) {
      numOfMines += 1;
    }
  }

  return numOfMines;
};

 /**
  * Name: listeners
  * Purpose: Holds all listeners needed
  * . outside objects for the game
  * (can be activated anywhere)
  * on: enable listeners
  * off: disable listeners
  */
var listeners = {
	on: {
    clicks: function() {
      // Removes default menu even if no cell was clicked
      document.oncontextmenu = function() {
        return false;
      };

      // Calling 'on' on #main-container makes sure it will work
      // even if no .cells are present on initialization
  		$('#main-container').on('mousedown', '.cell', function(event) {
        // Get cell that was clicked for all events
        var location = [$(this).data('row'), $(this).data('col')];
        var clickedCell = gameField.getCell(location[0], location[1]);

        // 0: left, 1: middle, 2: right
        if (event.button === 0) {
          if (clickedCell.getIsFlagged()) {
            clickedCell.setIsFlagged(false);
            gameView.setFlaggedClass(clickedCell, false);
            gameView.refreshFlagsLeft();
          }

          if (clickedCell.getRealValue() === blank()) {
            gameView.revealAdjacentCells(clickedCell);
          }

          clickedCell.setIsClicked(true);
      		gameView.refreshCell(clickedCell);
          gameView.setClickedClass(clickedCell, true);
        } else if (event.button == 2) {
          // Only flag if cell has not been clicked
          if (!clickedCell.getIsClicked()) {
            // If flag is already flagged, unflag
            if (clickedCell.getIsFlagged()) {
              clickedCell.setIsFlagged(false);
              gameView.setFlaggedClass(clickedCell, false);
              gameView.refreshFlagsLeft();
            } else {
              clickedCell.setIsFlagged(true);
              gameView.setFlaggedClass(clickedCell, true);
              gameView.refreshFlagsLeft();
            }
          }
        }

        // Check for win or loss on either left or right click
        // AFTER cell modifications above
        if (event.button === 0 || event.button === 1) {
          if (checkWin()) {
            transitionToEndGame(true);
          } else if (clickedCell.getRealValue() === mine()) {
            transitionToEndGame(false);
          }
        }
  		});
  	},
    buttons: function() {
      $('#quick-play-button').on('click', function() {
        if ($('#beginner').prop("checked")) {
          transitionToGame({
            diff: "beginner",
            rows: 9,
            cols: 9,
            mines: 10 // ~12%
          });
        } else if ($('#intermediate').prop("checked")) {
          transitionToGame({
            diff: "intermediate",
            rows: 15,
            cols: 15,
            mines: 35 // ~17%
          });
        } else if ($('#expert').prop("checked")) {
          transitionToGame({
            diff: "expert",
            rows: 20,
            cols: 20,
            mines: 80 // 20%
          });
        } else if ($('#impossible').prop("checked")) {
          transitionToGame({
            diff: "impossible",
            rows: 25,
            cols: 25,
            mines: 137 // ~22%
          });
        }
      });

      $('#custom-play-button').on('click', function() {
        var r = parseInt($('#row-input').val());
        var c = parseInt($('#col-input').val());
        var m = parseInt($('#mines-input').val());

        var message = "";
        var isValid = false;

        // Check if all values are numbers
        if (!isNaN(r) && !isNaN(c) && !isNaN(m)) {
          // Check if rows and columns are in arbitrary boundries
          if (r >= 4 && r <= 30 && c >= 4 && c <= 30) {
            // Calculate percentage and check it against input
            var minePercentage = (m/(r*c))*100;
            // Final check, if everything is valid
            if (m > 0 && minePercentage < 100) {
              transitionToGame({
                diff: "custom",
                rows: r,
                cols: c,
                mines: m
              });
              isValid = true;
            } else {
              message = "Mines exceed lower or upper bound constraints.";
            }
          } else {
            message = "Check number of columns and rows.";
          }
        } else {
          message = "<br>" +
            "Invalid input. Make sure input consists of only numbers.";
        }

        if (!isValid) {
          // If nothing with an id="error" exists
          if (!$('#error').length) {
            $('#custom-play-button').after(
              "<p id=\"error\">Error: " + message + "</p>");
          } else if ($('#error').html() != "Error: " + message) {
            // If message is new replace it with new one
            $('#error').html("Error: " + message);
          }
        } else if ($('#error').length) {
          $('#error').remove();
        }
      });

      $('#back-button').on('click', function() {
        transitionToMainMenu();
      });

      $('#replay-button').on('click', function() {
        transitionToGame(gameSettings);
      });

      $('#new-game-button').on('click', function() {
        transitionToMainMenu();
      });
    }
  },
  // Should remove whatever was set in on (if desired)
  off: {
    clicks: function() {
  		$('#main-container').off('mousedown', '.cell');
  	},
    buttons: function() {
      $('#quick-play-button').off('click');
      $('#custom-play-button').off('click');
      $('#back').off('click');
      $('#replay-button').off('click');
      $('#new-game-button').off('click');
    }
  }
};

/**
 * Activates listeners
 */
var addListeners = function() {
  for (var prop in listeners.on)
		listeners.on[prop]();
};

/**
 * Deactivates listeners
 * @param {Function} callback
 */
var removeListeners = function(callback) {
  for (var prop in listeners.off) {
    listeners.off[prop]();
  }

  callback();
};

/**
 * Returns if the player has won or not
 * @return {Boolean}
 */
var checkWin = function() {
  var notClicked = 0;
  var flagged = 0;
  var strShown = "", strReal;
  for (var i = 0; i < gameField.getRows(); i++) {
    for (var j = 0; j < gameField.getColumns(); j++) {
      if (!gameField.getCell(i, j).getIsClicked()) {
        notClicked += 1;
      }
      if (gameField.getCell(i, j).getIsFlagged()) {
        flagged += 1;
      }
      // If there is a mine showing there was no win
      if (gameField.getCell(i, j).getShownValue() === mine()) {
        return false;
      }
    }
  }

  console.log("Shown values: " + strShown);
  console.log("Real values: " + strReal);
  return notClicked === flagged || notClicked === gameField.getTotalMines();
};

/**
 * Name: timer
 * Purpose: Works as a timer for the timer display
 */
var timer = function() {
  var timeLeft = 0;
  // Initialized so can be cleared later on
  var interval = null;

  return {
    /**
     * Sets the time for the timer (in ms)
     * @param {Number} t
     */
    setTimeLeft: function(t) {
      timeLeft = (typeof t === "number") ? t : timeLeft;
    },
    getTimeLeft: function() {
      return (timeLeft > 0) ? timeLeft : 0;
    },
    getTimeLeftSeconds: function() {
      var timeInSeconds = parseInt(timeLeft/1000);
      return (timeInSeconds > 0) ? timeInSeconds : 0;
    },
    /**
     * Decrements the time left
     * @param {Number} leap
     */
    decrementTimeLeft: function(leap) {
      timeLeft -= (typeof leap === "number") ? leap : 0;
    },
    /**
     * Increments the time left
     * Careful, as there's no ceiling to stop
     * . infinite incrementation
     * @param {Number} leap
     */
    incrementTimeLeft: function(leap) {
      timeLeft += (typeof leap === "number") ? leap : 0;
    },
    /**
     * Starts the timer
     * @param {Number} leap
     * @param {Boolean} shouldInc
     */
    startTimer: function(leap, shouldInc) {
      var that = this;
      // Default to decrementing
      shouldInc = (typeof shouldInc === "boolean") ? shouldInc : false;

      interval = setInterval(function() {
        // Decrement or increment timer
        if (shouldInc) {
          that.decrementTimeLeft(leap);
        } else {
          that.incrementTimeLeft(leap);
        }
        // Refresh view
        gameView.refreshTimer();

        if (that.getTimeLeft() <= 0) {
          clearInterval(interval);
        }
      }, leap);
    },

    /**
     * Stops the timer
     */
    stopTimer: function() {
      // setInterval() returns a number ID
      if (typeof interval === "number" && interval !== null) {
        clearInterval(interval);
      }
    }
  };
}();

/**
 * Purpose: All Views
 * Source:  src/view.js
 */

// Holds the settings loaded from transitionToGame
var gameSettings = null;

/**
 * Name: displayMainMenu
 * Purpose: Will display the main menu on the screen
 * Note: Does no HTML deletion so no <div> other than
 * . main-container should be alive
 */
var displayMainMenu = function() {
	var html = "<div id=\"welcome\">";

	html += "<h1>Welcome to MineSweeper JS!</h1>";
	html += "<h2>Quick Play</h2>";

	html += "<div id=\"diff-form\">";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"beginner\" checked>";
	html += "<label for=\"beginner\">Beginner</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"intermediate\">";
	html += "<label for=\"intermediate\">Intermediate</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"expert\">";
	html += "<label for=\"expert\">Expert</label><br>";
	html += "<input type=\"radio\" name=\"difficulty\" id=\"impossible\">";
	html += "<label for=\"impossible\">Impossible</label><br>";
	html += "<button class=\"btn\" id=\"quick-play-button\">Play</button>";
	html += "</div>";

	html += "<h2>Custom Game</h2>";

	html += "<p id=\"row-select\">Rows (between 4 and 30): </p>";
	html += "<input type=\"text\" name=\"row-text\" size=\"2\" id=\"row-input\">";
	html += "<br><br>";

	html += "<p id=\"col-select\">Columns (between 4 and 30): </p>";
	html += "<input type=\"text\" name=\"col-text\" size=\"2\" id=\"col-input\">";
	html += "<br><br>";

	html += "<p id=\"mines-select\">Number of Mines: </p>";
	html += "<input type=\"text\" name=\"mines-text\" size=\"2\" ";
	html += "id=\"mines-input\">";
	html += "<br>";

	html += "<button class=\"btn\"";
	html += "id=\"custom-play-button\">Play</button>";
	html += "<br>";

	html += "<h2>How To</h2>";
	html += "<p>Left Click (tap): reveal cell</p>";
	html += "<p>Right Click (long tap): flag cell</p>";

	html += "</div>";

	$('#main-container').append(html);
};

/**
 * Transitions the view to the main menu
 */
var transitionToMainMenu = function() {
	// Needed because the wildcard * calls the callback
	// . for every element otherwise
	var hasFadedOnce = false;

	// Used as a callback later
	var animation = function() {
		setTimeout(function() {
			// Determine what the current view is
			var $currentView = null;
			if ($('#game-field').length) {
				$currentView = $('#game-field, #header, #back-button');
			} else if ($('#end-game').length) {
				$currentView = $('#end-game');
			}

			// Use the current view here
			$currentView.fadeOut(1000).promise().done(
				function() {
					if (!hasFadedOnce) {
						if ($currentView === $('#game-field')) {
							gameView.removeField();
						} else {
							$currentView.remove();
						}
						displayMainMenu();
						hasFadedOnce = true;
						addListeners();
						timer.stopTimer();
					}
				}
			);
		}, 50);
	};

	// Prevent clicks or hovers from changing CSS
	$('.cell').removeClass('not-clicked');
	// Remove listeners to prevent clicks from changing view
	// Called with animation as a callback
	removeListeners(animation);
};

/**
 * Transitions the view to the game screen from anywhere
 * @param {Object} settings
 */
var transitionToGame = function(settings) {
	// Used as a callback later
	var animation = function() {
		setTimeout(function() {
			// Determine what the current view is
			var $currentView = null;
			if ($('#welcome').length) {
				$currentView = $('#welcome');
			} else if ($('#end-game').length) {
				$currentView = $('#end-game');
			}

			// Use the current view here
			$currentView.fadeOut(750, function() {
				$currentView.remove();
				gameSetup(settings);
				// Turn buttons back on
				listeners.on.buttons();
			});
		}, 100);
	};

	// Remove listeners to prevent clicks from changing view
	listeners.off.buttons();
	animation();
};

var botClearView = function() {
	$('#header, #game-field').remove();
};

/**
 * Transitions the view to the end game screen from game view
 * @param {Boolean} didWin
 */
var transitionToEndGame = function(didWin) {
	timer.stopTimer();

	// Needed because the wildcard * calls the callback
	// . for every element otherwise
	var hasFadedOnce = false;

	// Used as a callback later
	var animation = function() {
		setTimeout(function() {
			$('#game-field').fadeOut(1000, function() {
				if (!hasFadedOnce) {
					gameView.removeField();
					displayEndGame(didWin);
					hasFadedOnce = true;
					// Needed for buttons on end game screen
					addListeners();
				}
			});
		}, 500);
	};

	// Prevent clicks or hovers from changing CSS
	$('.cell').removeClass('not-clicked');
	// Remove listeners to prevent clicks from changing view
	// Called with animation as a callback
	removeListeners(animation);
};

/**
 * Name: displayEndGame
 * Purpose: Will display the end game on the screen
 * Note: Does no HTML deletion so no <div> other than
 * . main-container should be alive
 * @param {Boolean} didWin
 */
var displayEndGame = function(didWin) {
	var html = "<div id=\"end-game\" style=\"display:none\">";
	if (didWin) {
		html += "<h1>Congratulations!</h1>";
		html += "<p class=\"top-marg\">You won ";
	} else {
		html += "<h1>Game Over</h1>";
		html += "<p class=\"top-marg\">You lost ";
	}
	html += gameSettings.diff + " in " + timer.getTimeLeftSeconds() + " second";
	if (timer.getTimeLeftSeconds() === 1) {
		html += "</p>";
	} else {
		html += "s</p>";
	}
	html += "<p>Play again?</p>";
	html += "<button class=\"btn\" id=\"replay-button\">Play Same Setup</button>";
	html +="<button class=\"btn\" id=\"new-game-button\">Play New Setup</button>";
	html += "</div>";

	$('#main-container').append(html);

	$('#end-game').fadeIn(1000);
};

/**
 * Name: gameView
 * Purpose: Contains everything necessary
 * . to work with the game view
 */
var gameView = function() {
	/* Private Functions */
	/**
	 * Displays header
	 */
	var displayHeader = function() {
		var html = "<div id=\"header\">";
		html += "<div id=\"timer\">";
		html += "<p>Time: " + timer.getTimeLeftSeconds() + "</p>";
		// Closes div id=timer
		html += "</div>";

		html += "<div id=\"flags-left\">";
		html += "<p>Flags Left: " + gameField.getFlagsLeft() + "</p>";
		// Closes div id=flags-left
		html += "</div>";

		// Closes div id=header
		html += "</div>";

		$('#main-container').append(html);
	};

	/**
	 * Displays HTML/CSS field
	 * Intended for first display only
	 * Refresh functions should be used afterwards
	 */
	var displayField = function() {
		html = "<div id=\"game-field\"></div>";
		$('#main-container').append(html);
		html = "";

		for (var i = 0; i < gameField.getRows(); i++) {
			for (var j = 0; j < gameField.getColumns(); j++)
			{
				var cellToDisplay = gameField.getCell(i, j);
				// Can be hovered on by default
				// Careful: class " not closed!
				html += "<div class=\"cell not-clicked ";
				if (cellToDisplay.getRealValue() !== mine() &&
					  cellToDisplay.getRealValue() !== blank()) {
					html += "mine-number-" + cellToDisplay.getRealValue();
				}
				// Closes class "
				html += "\" ";
				html += "data-row=\"" + i + "\" data-col=\"" + j + "\">";
				html += cellToDisplay.getShownValue();
				html += "</div>";
			}

			html += "<br>";
		}

		$('#game-field').append(html);
		setBorders();
		setCellDimensions();

		setResizeEvent(function() {
			setCellDimensions();
		});
	};

	var displayMenuButton = function() {
		var html = "<div class=\"center-button\">";
		html += "<button class=\"btn\" id=\"back-button\">Back</button>";
		html += "</div>";
		$('#game-field').after(html);
	};

	/**
	 * Sets borders for all cells to prevent overlap
	 */
	var	setBorders = function() {
		var borderStyle = "1px solid black";
		$('.cell').each(function() {
			// All cells have a top and left border
			$(this).css('border-left', borderStyle);
			$(this).css('border-top', borderStyle);

			// Last column cells have right borders
			if ($(this).data('col') === gameField.getColumns()-1) {
				$(this).css('border-right', borderStyle);
			}

			// Last row cells have bottom borders
			if ($(this).data('row') === gameField.getRows()-1) {
				$(this).css('border-bottom', borderStyle);
			}
		});
	};

	/**
	 * Calculates and sets width and height of every cell
	 */
	var setCellDimensions = function() {
		// Give field width 60% and height 75%
		var fieldWidth = 0.60 * $(window).width();
		var fieldHeight = 0.75 * $(window).height();

		// Find the smaller of 2 to use as the dimension of each cell
		var smaller = (fieldWidth < fieldHeight) ? fieldWidth : fieldHeight;

		// Calculate smaller dimension and use it
		var cellHeight = smaller/gameField.getRows();
		var cellWidth = smaller/gameField.getColumns();
		var cellDimension = (cellHeight < cellWidth) ? cellHeight : cellWidth;
		// Floor it for an even number
		cellDimension = Math.floor(cellDimension);

		// Set CSS
		$('.cell').css('width', cellDimension);
		$('.cell').css('height', cellDimension);
		// Take up most of the cell with text
		$('.cell').css('font-size', cellDimension*0.9);

		// Calcualte new height and width
		var newWidth = cellDimension*gameField.getColumns();
		var newHeight = cellDimension*gameField.getRows();

		// Set CSS
		$('#game-field').css('width', newWidth);
		$('#game-field').css('height', newHeight);
		$('#header').css('width', newWidth);
		// Scale to cells
		$('#header').css('font-size', newWidth*0.05);
	};

	/* Public Functions */
	return {
		/**
		 * Displays field as text (for basic debugging purposes)
		 */
		displayTextField: function() {
			strField = "";
			for (var i = 0; i < gameField.getRows(); i++) {
				for (var j = 0; j < gameField.getColumns(); j++)
				{
					strField += gameField.getCell(i, j).getShownValue();
				}
				strField += "\n";
			}

			console.log(strField);
		},
		/**
		 * Displays HTML/CSS field and header
		 */
		displayGameView: function() {
			displayHeader();
			displayField();
			displayMenuButton();
		},
		displayBotGameView: function() {
			displayHeader();
			displayField();
		},
		/**
		 * Removes HTML/CSS field and header
		 */
		removeField: function() {
			$('#header').remove();
			$('#game-field').remove();
			$('.center-button').remove();
		},
		/**
		 * Refreshes the view for the given cell
		 * To be called if the shown value changes
		 * @param {Object} cellToRefresh
		 */
		refreshCell: function(cellToRefresh) {
			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
							$(this).html(cellToRefresh.getShownValue());
						}
			});
		},
		/**
		 * Reveals all blank cells adjacent
		 * . as well as any cells adjacent to a blank
		 * @param {Object} cellToCheck
		 */
		revealAdjacentCells: function(cellToCheck) {
			var adjacentCells = getAdjacentCells(cellToCheck);
			for (var i = 0; i < adjacentCells.length; i++) {
				// If cell is not flagged and not clicked
				// This also ensures there is no stack overflow from recursion later on
				if (!adjacentCells[i].getIsFlagged() &&
						!adjacentCells[i].getIsClicked()) {
					// Reveal cell
					adjacentCells[i].setIsClicked(true);
					this.refreshCell(adjacentCells[i]);
		      this.setClickedClass(adjacentCells[i], true);
					// Now go check it's cells and make them revealed if it's blank
					if (adjacentCells[i].getRealValue() === blank())
						this.revealAdjacentCells(adjacentCells[i]);
				}
			}
		},
		/**
		 * Sets the HTML/CSS clicked class of the cell
		 * . to either on or off
		 * @param {Object} cellToRefresh
		 * @param {Boolean} setToClicked
		 */
		setClickedClass: function(cellToRefresh, setToClicked) {
			setToClicked =
				(typeof setToClicked === "boolean") ? setToClicked : false;

			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
					if (setToClicked) {
						$(this).removeClass('not-clicked');
						$(this).addClass('clicked');
					} else {
						$(this).removeClass('clicked');
						$(this).addClass('not-clicked');
					}
				}
			});
		},
		/**
		 * Either removes or adds the CSS flagged class
		 * @param {Object} cellToRefresh
		 * @param {Boolean} setToFlagged
		 */
		setFlaggedClass: function(cellToRefresh, setToFlagged) {
			setToFlagged =
				(typeof setToFlagged === "boolean") ? setToFlagged : false;

			$('.cell').each(function() {
				// Find HTML representation of cell
				if ($(this).data('row') === cellToRefresh.getRow() &&
				    $(this).data('col') === cellToRefresh.getCol()) {
					if (setToFlagged) {
						$(this).addClass('flagged');
					} else {
						$(this).removeClass('flagged');
					}
				}
			});
		},
		/**
		 * Refreshes the timer's view
		 */
		refreshTimer: function() {
			// First get all digits and replace them with the new value
			// Then replace the HTML with the new HTML
			var html = $('#timer').html();
			// Checked in case timer is attempting to refresh when it no longer exists
			if (typeof html === "string") {
				html = html.replace(/\d+/g, timer.getTimeLeftSeconds());
				$('#timer').html(html);
			}
		},
		/**
		 * Refreshes flag's left on the view
		 */
		refreshFlagsLeft: function() {
			$('#flags-left').html($('#flags-left').html().replace(/-?\d+/g, gameField.getFlagsLeft()));
		}
	};
}();

/**
 * Changes resize event binding
 * @param {Function} resizeFunc
 */
var setResizeEvent = function(resizeFunc) {
	$(window).resize(function() {
		resizeFunc();
	});
};

/**
 * Purpose: Main Loop
 * Source:  src/index.js
 */
$(document).ready(function() {
	// displayMainMenu();
	// addListeners();

	var gamesPlayed = 0;
	var gamesToPlay = 1;
	var gamesWon = 0;
	var delay = 0;

	var botInterval = setInterval(function() {
		if (gamesPlayed < gamesToPlay) {
			console.log("Game #" + (gamesPlayed+1));
			botClearView();
			gameView.displayBotGameView();

			botGameSetup({
				diff: "bot_test",
				rows: 10,
				cols: 10,
				mines: 5
			});

			while (!bot.getIsGameOver()) {
				bot.smartClick();
			}

			// var clickInterval = setInterval(function() {
			// 	bot.smartClick();
			// 	if (bot.getIsOver()) {
			// 		clearInterval(clickInterval);
			// 	}
			// }, 1000);

			// bot.printTempArrString();

			// Tell bot a new game is starting
			bot.setIsGameOver(false);
			gamesPlayed += 1;
			gamesWon += (bot.getDidWinLast()) ? 1 : 0;
			console.log("The bot has won " + gamesWon + " games.");
		} else {
			clearInterval(botInterval);
		}
	}, delay);


});

// var testEquals = function(num) {
// 	for (var i = 0; i < num; i++) {
// 		var scale = 10;
// 		var expected = false;
// 		var arr1 = [];
// 		var arr2 = [];
//
// 		// Populate arr1
// 		for (var j = 0; j < 8; j++) {
// 			arr1.push(randomCell());
// 		}
//
// 		// Make random decisions to arr2
// 		var randNum = Math.floor(Math.random() * 5);
// 		// Make it arr1
// 		if (randNum === 0) {
// 			arr2 = arr1;
// 			expected = true;
// 		} else if (randNum === 1) {
// 			// Make it mostly arr1
// 			arr2 = arr1.slice(0, arr1.length-2);
// 			arr2.push(randomCell());
// 			expected = false;
// 		} else if (randNum === 2) {
// 			arr2 = [];
// 			expected = false;
// 		} else {
// 			// Populate arr2
// 			for (var j = 0; j < 8; j++) {
// 				arr2.push(randomCell());
// 			}
// 			// Unknown
// 			expected = null;
// 		}
//
// 		console.log("Test #" + (i+1) + " of " + num);
// 		if (expected !== null) {
// 			if (expected !== adjEquals(arr1, arr2)) {
// 				console.log("Expected " + expected);
// 				console.log("arr1: " + getString(arr1));
// 				console.log("arr2: " + getString(arr2));
// 				console.log("Return: " + adjEquals(arr1, arr2));
// 			} else {
// 				console.log("Test passed.");
// 			}
// 		} else {
// 			console.log("No expectation");
// 			console.log("arr1: " + getString(arr1));
// 			console.log("arr2: " + getString(arr2));
// 			console.log("Return: " + adjEquals(arr1, arr2));
// 		}
// 	}
// }
//
// var randomCell = function() {
// 	var ran = Math.floor(Math.random() * 11);
// 	var c = null;
// 	if (ran >= 0 && ran <= 8) {
// 		c = cell(0, 0, ran);
// 		c.setIsClicked(true);
// 		return c;
// 	} else if (ran === 9) {
// 		c = cell(0, 0, ran);
// 		c.setIsClicked(true);
// 		return c;
// 	} else {
// 		c = cell(0, 0, ran);
// 		c.setIsClicked(true);
// 		return c;
// 	}
// }
//
// var getString = function(arr) {
// 	var str = "[";
// 	for (var i = 0; i < arr.length; i++) {
// 		str += arr[i].getShownValue() + ", ";
// 	}
// 	return str + "]";
// }

/**
 * Things needed:
 * - bot (all ACTIONS)
 * - some snapshot of adjacent cells and percentage of it not being a mine
 * - array holding all unique snapshots that are not surrounded by all blanks and/or NaNs
 */

/**
 * Order of TODO:
 * 1) Create bot [x]
 * 2) Click randomly [x]
 * 3) Confirm correct number of games are being played [x]
 * 4) Create array compare and TEST TEST TEST [x]
 * 5) Create snapshot object
 * 6) Create array of unique snapshots (make sure no all blank/NaNs!!!!)
 */

/**
 * Converts, then compares two adjacent cell arrays
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Boolean}
 */
var adjEquals = function(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i].getShownValue() !== arr2[i].getShownValue()) {
      return false;
    }
  }

  return true;
};

/**
 * Checks to see if a cell is surrounded by blanks/NaNs
 * @param {Object} cellToCheck
 * @return {Boolean}
 */
var isBlankAdj = function(cellToCheck) {
  var adj = botGetAdjacentCells(cellToCheck);
  for (var i = 0; i < adj.length; i++) {
    if (adj[i].getShownValue() !== blank() &&
        !isNaN(adj[i].getShownValue())) {
      return false;
    }
  }

  return true;
};

/**
 * The bot's view of a click
 * @param {Object} cellToUse
 * @param {Boolean} wasMine
 */
var clickSnapshot = function(cellToUse, wasMine) {
  var chanceOfMine = (wasMine) ? 1 : 0;
  // Must be calcualted immediately to accurately represent what
  // was seen at the time of the click
  var adjacentCells = botGetAdjacentCells(cellToUse);
  var numOfClicks = 1;

  return {
    getAdjCells: function() {
      return adjacentCells;
    },
    getChanceOfMine: function() {
      return chanceOfMine;
    },
    getNumOfClicks: function() {
      return numOfClicks;
    },
    addMineClick: function() {
      var numOfMines = chanceOfMine * numOfClicks;
      numOfClicks += 1;
      numOfMines += 1;
      chanceOfMine = numOfMines / numOfClicks;
    },
    addSafeClick: function() {
      // Since we store the chance of a mine,
      // we simply add a click and recalc the percentage
      numOfClicks += 1;
      chanceOfMine = numOfMines / numOfClicks;
    }
  };
};

/**
 * TODO:
 * - store new clicks (no duplicates! no all blanks/NaN!)
 * - retrieve clicks
 * - .contains(new click)
 */
var clickContainer = function() {
  var arr = [];

  return {
    getLength: function() {
      return arr.length;
    },
    /**
     * Handles adding a click to {Array} arr
     * Does not add: duplicates, cells with all blank
     * and/or NaN adjacent cells
     * Instead: calculates new percentage for duplicates, does not add cells with
     * all blank and/or NaN adjacent cells
     * @param {Object} cellToAdd
     */
    addClick: function(cellToAdd) {
      var adj = botGetAdjacentCells(cellToAdd);
      var isValid = isBlankAdj(cellToAdd);

      console.log("Valid?: " + isValid);

      var foundMatch = false;
      if (isValid) {
        for (var i = 0; i < arr.length && !foundMatch; i++) {
          if (adjEquals(arr[i].getAdjCells(), adj)) {
            if (cellToAdd.getShownValue() === mine()) {
              arr[i].addMineClick();
              foundMatch = true;
            } else {
              arr[i].addSafeClick();
              foundMatch = true;
            }
          }
        }

        if (!foundMatch) {
          var isMine = cellToAdd.getShownValue() === mine();
          arr.push(clickSnapshot(cellToAdd, isMine));
        }
      }
    },
    /**
     * Returns the percentage of whether the cell is a mine
     * Returns NaN on failure to find cell
     * @param {Object} cellCompare
     * @return {Object} clickSnapshot
     */
    getMineChance: function(cellCompare) {
      for (var i = 0; i < arr.length; i++) {
        if (adjEquals(arr[i].getAdjCells(), botGetAdjacentCells(cellCompare))) {
          return arr[i].getChanceOfMine();
        }

        return NaN;
      }
    }
  };
}();

// Contains all actions for the bot
var bot = function() {
  var isGameOver = false;
  var didWinLast = false;

  var clickCell = function(cellToClick) {
    // Standard cell click procedure
    cellToClick.setIsClicked(true);
    gameView.refreshCell(cellToClick);
    gameView.setClickedClass(cellToClick, true);

    // Reveal cells if applicable
    if (cellToClick.getShownValue() === blank()) {
      gameView.revealAdjacentCells(cellToClick);
    }

    clickContainer.addClick(cellToClick);

    // Handle win or loss
    if (checkWin()) {
      bot.setIsGameOver(true);
      bot.setDidWinLast(true);
    } else if (cellToClick.getRealValue() === mine()) {
      bot.setIsGameOver(true);
      bot.setDidWinLast(false);
   }
 };

  return {
    getIsGameOver: function() {
      return isGameOver;
    },
    setIsGameOver: function(val) {
      isGameOver = (typeof val === "boolean") ? val : false;
    },
    getDidWinLast: function() {
      return didWinLast;
    },
    setDidWinLast: function(val) {
      didWinLast = (typeof val === "boolean") ? val : false;
    },
    randomClick: function() {
      var randRow = Math.floor(Math.random() * (gameField.getRows()));
      var randCol = Math.floor(Math.random() * (gameField.getColumns()));

      // Keep generating cells until an unclicked cell is found
      while (gameField.getCell(randRow, randCol).getIsClicked()) {
        randRow = Math.floor(Math.random() * (gameField.getRows()));
        randCol = Math.floor(Math.random() * (gameField.getColumns()));
      }

      console.log("randomly clicking");
      console.log("r: " + randRow);
      console.log("c: " + randCol);

      clickCell(gameField.getCell(randRow, randCol));
    },
    smartClick: function() {
      var map = {};
      var hasClicked = false;
      // Iterate over grid
      for (var i = 0; i < gameField.getRows() && !hasClicked; i++) {
        for (var j = 0; j < gameField.getColumns() && !hasClicked; j++) {
          var fieldCell = gameField.getCell(i, j);
          // Is it surrounded by invalid date? Then skip it
          if (!isBlankAdj(fieldCell)) {
            // Otherwise, continue
            var chance = clickContainer.getMineChance(fieldCell);
            // Is the chance a real number (eg. exist)?
            if (!isNaN(chance)) {
              // Is there no chance its a mine?
              if (chance === 0) {
                // Then click it!
                clickCell(fieldCell);
                hasClicked = true;
              } else {
                // Otherwise it might be a mine, so lets get all data first
                if (map.hasOwnProperty(chance)) {
                  map[chance].push(fieldCell);
                } else {
                  map[chance] = [fieldCell];
                }
              }
            }
          }

          // If there were no sure things found
          if (!hasClicked) {
            // Then lets look at any data we collected
            var percentageArr = [];
            for (var prop in map) {
              // Add all arrays of cells to one array to sort
              percentageArr.push(prop);
            }

            // Did we find anything?
            if (percentageArr.length > 0) {
              // If so, lets sort it
              percentageArr.sort(function(a, b) { return a-b; });
              // Since it sorts in ascending order, we should get the
              // cell with the lowest possible chance of being a mine
              // eg. the first cell

              // map contains percentages as keys and an array of cells as vals
              // percentageArr contains the percenteages
              // Therefore, percentageArr[0] is the lowest possible percentage
              // and map[percentageArr[0]] is the array of that possibility
              // Finally, map[percentageArr[0]][0] is the first cell of that arr
              clickCell(map[percentageArr[0]][0]);
              hasClicked = true;
            } else {
              // No information we collected helped yet, so just click randomly
              this.randomClick();
            }
          }
        }
      }
    }
  };
}();
