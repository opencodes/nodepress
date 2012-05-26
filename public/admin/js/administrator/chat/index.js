$(document).ready(function() {
  
  // Debug quick function
  var log = console.log;
  
  
  // Cache the main path container
  var $paths = $('#chatPathsManager > .allSavedPaths > .paths');
  
  
  // Return an HTML code ready to ne included in the main paths container
  function getPathHTML(path, available, isFirstPath) {
    // Create more general path object
    var pathObj = {
        "path"       : path,
        "isFirstPath": isFirstPath,
        "available"  : available
    };
    
    // Calculate the timing it needed
    if(available.from) {
      pathObj.available = {
          "from": getFormatTime(available.from),
          "to"  : getFormatTime(available.to)
      };
    }
    
    // Return the path HTML
    return new EJS({url: '/ejs/chat/path.ejs'}).render({'pathObj': pathObj});
  }
  
  
  // Returns a human formated time from income milliseconds
  function getFormatTime(milliseconds) {
    var totalMinutes = milliseconds / 1000;
    
    var hours   = Math.floor(totalMinutes/ 3600) % 24;  // Secure and hour less than 24 even if the time frame overlap the noon time, for example from 21:00 till 9:00 on the next morning
    var minutes = (totalMinutes % 3600) /60;
        minutes = minutes < 10 ? '0'+minutes : minutes;

    return hours +':'+ minutes;
  }
  
  
  // Common function to load a HTML from a EJS chat form file with the income form JSON
  function showForm(formObj) {
    var $pathForm = $('#chatPathsManager .pathForm');
    
    // Hide the form till it's loaded
    $pathForm.hide();
    
    // Load the form
    $pathForm.html(new EJS({url: '/ejs/chat/form.ejs'}).render({'formObj': formObj}));
    
    // Animate the form appearance
    $pathForm.fadeIn(300);
    
    // Set a focus to the first editable field
    $pathForm.find('input[name=path]').focus();
  }
  
  
  // Load the Add Path form in the main .pathForm node 
  function showAddPathForm() {
    
    // JSON object with all "Add Path" form details
    var addFormObj = {
        "title"    : "Add New Path",
        "class"    : "addNewPath",
        "available": "true",
        "btnTitle" : "Save"
    };
    
    // Use a common function to load the form EJS file with the Add Form data
    showForm(addFormObj);
  }
  
  
  // Load the Edit Path form in the main .pathForm node 
  function showEditPathForm(path, available) {
    
    // JSON object with all "Add Path" form details
    var editFormObj = {
        "title"    : "Edit Path",
        "class"    : "editPath",
        "path"     : path,
        "available": ututils.clone(available),
        "btnTitle" : "Edit"
    };
    
    // Calculate the time frame components if needed
    if(editFormObj.available.from) {
      editFormObj.available.from = getFormatTime(available.from);
      editFormObj.available.to   = getFormatTime(available.to);
    }
    
    // Use a common function to load the form EJS file with the Edit Form data
    showForm(editFormObj);
  }
  
  
  // Lock all form editable fields and buttons
  function lockFormElements(lock) {
    $pathForm.find('input, button').each(function(index, element) {
      $(element).attr("disabled", lock);
    });
    
    // Return the original lock state of the time availability option 
    $pathForm.find('input[name=available]:checked').click();
  }
  
  
  // Convert HH:MM format to milliseconds
  function calcMilliSecs(time) {
    // Split time components
    time = time.split(':');
    
    var hours   = time[0]; 
    var minutes = time[1];
    
    return (hours*60 + minutes*1)*60*1000;
  }
  
  
  // Common function for path form validation
  // return a response JSON object with the valid path or null 
  function validateForm() {
    // Validation response
    var response = null;
    
    // Lock the form to prevent multiple requests
    lockFormElements(true);
    
    // Error details
    var errorMessage = '';
    var $someOnFocus = null;
    
    
    // Check the input path
    var $path      = $pathForm.find('input[name=path]');
    var path       = $path.val();
    var pathRegExp = new RegExp(/^(\/[a-z0-9_-]+)+(\/\*)?$/);
    
    if(!pathRegExp.test(path)) {
      errorMessage += 'Please enter a valid Path!\n';
      $someOnFocus  = $someOnFocus ? $someOnFocus : $path.focus();
    }
    
    
    // Check the available timing
    var available = $pathForm.find('input[name=available]:checked').val();
    if(available == 'time') {
      
      // Get time frame details
      var $from = $pathForm.find('input.time.from');
      var $to   = $pathForm.find('input.time.to'  );
      
      var from = $from.val();
      var to   = $to.val();
      
      // Check a time from 00:00 to 23:59
      var timeRegExp = new RegExp(/^(([0-1]?[0-9])|(2[0-3])):[0-5][0-9]$/);
      var validTimes = true;
      
      // Check from time
      if(!timeRegExp.test(from)) {
        errorMessage += 'Please enter a valid From time!\n';
        $someOnFocus  = $someOnFocus ? $someOnFocus : $from.focus();
        validTimes    = false;
      }
      
      // Check to time
      if(!timeRegExp.test(to)) {
        errorMessage += 'Please enter a valid To time!\n';
        $someOnFocus  = $someOnFocus ? $someOnFocus : $to.focus();
        validTimes    = false;
      }
      
      
      // Duplicate check
      if(validTimes && from == to) {
        errorMessage += 'From Time should be different from To Time!\nOtherwise you can just check Always.\n';
        $someOnFocus  = $someOnFocus ? $someOnFocus : $to.focus();
      
      } else {
        // if both times are valid we'll record their milliseconds
        
        // Calculate time components
        var fromTime = calcMilliSecs(from);
        var toTime   = calcMilliSecs(to);
        
        // Check if the time frame cover the middle of the night
        // For example, from 21:00 till 9:00 in the next morning
        if(fromTime > toTime) {
          // Add 24 hours
          toTime += 24*60*60*1000;
        }
        
        // Keep the data in JSON
        available = {
            "from": fromTime,
            "to"  : toTime
        };
      }
    }
    
    
    // Check if the form is valid
    if($someOnFocus) {
      // Show the sum of error messages
      alert(errorMessage + '\nCheck the Notes.');
      
      // Some Browsers lose the object focus coz the user click the Alert [OK] bth
      // That's why we return it manually after short time slot
      setTimeout(function() {
        $someOnFocus.focus();
      }, 100);
      
      // Unlock the form
      lockFormElements(false);
      
    } else {
      
      // Prepare the new path JSON object
      response = {
          "path"     : path,
          "available": available
      };
    }
    
    // Return the validation response object
    return response;
  }
  
  
  // Cache the path form
  var $pathForm = $('#chatPathsManager > .pathForm');
  
  
  // Click event for the 'hide' form top-right btn
  $pathForm.on('click', '.btn.hide', function(event) {
    $pathForm.fadeOut();
  });
  
  
  // Set a event handler to check for any change in the time options
  // so it could (un)lock the time frame fields
  $pathForm.on('click', 'input[name=available]', function(event) {
    var $option = $(event.target);
    
    var lockTimeFrameOptions = $option.val() != 'time';
    $pathForm.find('input.time').attr('disabled', lockTimeFrameOptions);
  });
  
  
  // Set a click event for the Save btn in the Add Path Form to checkthe input and eventually submit the form
  $('.pathForm').on('click', '.addNewPath > .btn.success', function() {
    
    // Get a new path if the form is valid
    var validPath = validateForm();
    
    if(validPath) {
      
      // Populate the new path that will be send to the server
      var newPath                = {};
          newPath[validPath.path]= {"available": validPath.available};
      
      // Send the new path object to be saved from the server
      $.post('/chat/addPath', {"newPath": newPath}, function(response) {
        // Unlock the form
        lockFormElements(false);
        
        // Check if the adding went well
        if(response.status) {
          // Hide the Add New Path Form
          $pathForm.fadeOut();
          
          // Include the verified new path in the main paths container
          $paths.append( getPathHTML(validPath.path, validPath.available) );
          
          // Include the new path in the cached paths local object
          allPaths[validPath.path] = {"available": validPath.available};
        
        } else {
          
          // Show the server error message
          alert(response.message);
        }
      });
    }
    
    // Prevent submit
    return false;
  });
  
  
  // Watch for any submit event and redirect it to the default btn click event 
  $pathForm.on('submit', function() {
    $pathForm.find('.btn.success').click();
    
    // Prevent submit
    return false;
  });
  
  
  // Click event handler for the "Add Path" btn in the "All Saved Paths" list
  $paths.parent().find('.btn.success').on('click', function() {
    showAddPathForm();
  });

  
  // Keeps all paths from the Database
  var allPaths = null;
  
  // Prints all income paths in the main paths container
  $.get('/chat/getAllPaths', function(paths) {
    // Caching the paths
    allPaths = paths;
    
    // Add all paths in the main paths container
    var isFirstPath = true; 
    for(var path in paths) {
      $paths.append( getPathHTML(path, paths[path].available, isFirstPath) );
      isFirstPath = false;
    }
  });
  
  
  // Return a path for a given index
  function getPath(pathIndex) {
    var i = 0;
    for(var path in allPaths) {
      if(pathIndex == i++) {
        
        return {
          "path"     : path,
          "available": allPaths[path].available
        };
      }
    }
    
    return null;
  }
  
  
  // Delete a specific path from all path cache
  function deletePathFromCache(pathIndex) {
    var i = 0;
    for(var path in allPaths) {
      if(pathIndex == i++) {
        delete(allPaths[path]);
        break;
      }
    }
  }
  
  
  // Return path index in the local cache
  function getPathIndex(incomePath) {
    var index = -1;
    for(var path in allPaths) {
      index++;
      if(incomePath == path) {
        return index;
      }
    }
    
    return -1;
  }
  
  
  
  // Cache all delete btns selector
  var deleteBtnsSelector = '.btn.danger';
  
  // Delete btn event handler
  $paths.on('click', deleteBtnsSelector, function(event) {
    
    // Getting path jQuery object
    var $btn  = $(event.target);
    var $path = $btn.closest('.pathContainer');
    
    
    // Confirmation details
    var pathLabel = $path.find('.pathLabel').text();
    
    // Ask for delete confirmation
    if(!confirm('Are you sure you want to delete\npath = '+ pathLabel.trim() +' ?')) {
      return;
    }
    
    
    // Common locking function for the delete btns
    function lockDeleteBtns(lock) {
      $paths.find(deleteBtnsSelector).each(function(index, btn) {
        btn.disabled = lock;
      });
    }
    
    
    // Chacing path index
    var pathIndex = $path.index();
    
    // Lock all delete btns to prevent multiple delete requests
    lockDeleteBtns(true);
    
    // Send a delete request to the server
    $.post('/chat/deletePath', {"pathIndex": pathIndex}, function(response) {
      // Unlock all delete btns
      lockDeleteBtns(false);
      
      // Check for errors while deleting
      if(!response.status) {
        alert(response.message);
        
      } else {
        
        // Delete the path element from the local cache
        deletePathFromCache(pathIndex);
        
        // Hide and delete the path from the user menu
        $path.slideUp(function() {
          // Delete the HTML node from the DOM tree
          $path.remove();
          
          // Update the list style
          var $allPathsLeft = $paths.find('.pathContainer');
          
          // Check if there's any paths left
          if($allPathsLeft.length) {
            $allPathsLeft.first().find('hr').hide();
          }
        });
      }
    });
  });
  
  
  // Keeps the original path parameter of the edited path object
  var editPathIndex = -1;
  
  // Create a click event handler for all Edit btns in the All Saved Paths list
  $paths.on('click', '.btn.primary', function(event) {
    // Get the clicked btn
    var $target = $(event.target);
    
    // Get the clicked path index
    editPathIndex = $target.closest('.pathContainer').index();
    
    // Get the clicked path in all cached paths
    var editPath = getPath(editPathIndex);
    
    // Show the Edit Path Form with the clicked path details in it
    showEditPathForm(editPath.path, editPath.available);
  });
  
  
  // Click handler to check any submit in the Edit Path Form
  $pathForm.on('click', '.editPath .btn.success', function() {
    
    // Get a valid path
    var validPath = validateForm();
    
    
    // Check if the updated path name already exist in the database
    var pathAlreadyExist = true;
    if(validPath) {
      var pathAlreadyExist = allPaths[validPath.path] && getPathIndex(validPath.path) != editPathIndex;
      
      if(validPath && pathAlreadyExist) {
        // Show an error message
        alert('The path '+ validPath.path +' already exist in the database!');
        
        // Unlock the form so the user could make the updates
        lockFormElements(false);
        
        // Focus on the path name so the user could easily update it
        $pathForm.find('input[name=path]').focus();
      }
    }
    
    
    if(validPath && !pathAlreadyExist) {
      // Prepare the edit path Object for the server calculations
      var editPath               = validPath;
          editPath.editPathIndex = editPathIndex;
      
      // Send the edited path and handle the server response
      $.post('/chat/editPath', {"editPath": editPath}, function(response) {
        
        // Unlock the form for future use
        lockFormElements(false);
        
        // On edit success we'll update the list of All Saved Paths
        if(response.status) {
          
          // Hide the edit path form
          $pathForm.hide();
          
          
          // Check state if the path was deleted or just updated
          var wasDeleted = response.wasDeleted;
          
          // Get the edited path HMTL with the server data
          var editedPath     = response.editedPath;
          var editedPathHTML = getPathHTML(editedPath.path, editedPath.available, !editPathIndex && !wasDeleted);
          
          // Switch the existing path with it's edited copy
          var $existingPath = $paths.find('.pathContainer:eq('+ editPathIndex +')');
          
          // Check if the path was deleted or just updated
          if(wasDeleted) {
            // Insert the path field in the last position since it will be as last in the local cache
            $paths.append(editedPathHTML);
            
          } else {
            // Insert the copy after it's original field
            $existingPath.after(editedPathHTML);
          }
          
          // Remove the old path field
          $existingPath.remove();
          
          // Hide the <hr /> of the first path box
          $paths.find('.pathContainer:eq(0) > hr').hide();
          
          
          // Update the local cache copy of all paths
          
          // Check if the old path was deleted or just updated
          if(wasDeleted) {
            // Remove the existing old path from the cache
            deletePathFromCache(editPathIndex);
          }
          
          // Update the local cache
          allPaths[editedPath.path] = {"available": editedPath.available};
          
        } else {
          
          // Show the server error message
          alert(response.message);
        }
      });
    }
    
    // Prevent submit
    return false;
  });
});