import defineAction from '../../../../helpers/define-action.js';
import iteratorTable from '../../../../helpers/iterator-table.js';

export default defineAction({
  name: 'Iterator Begin',
  key: 'iteratorBegin',
  description: 'Start iterating through an array',
  arguments: [
    {
      label: 'Array',
      key: 'array',
      type: 'string',
      required: true,
      description: 'Select array to iterate through',
      variables: true,
    },
  ],

  async run($) {
    const array = JSON.parse($.step.parameters.array); // turn string into array
    const currentStep = $.step.id;  // Ensure currentStep is defined
    
    // Look for an existing entry in the iterator table for this step
    let existingEntry = iteratorTable.find(entry => entry.stepLoc === currentStep);

    if (!existingEntry) {
      // If not found, create a new entry for this step in the iteratorTable
      existingEntry = {
        Id: iteratorTable.length + 1,      // Unique Id for the entry
        Flag: true,                         // Flag starts as true
        currentIteration: 0,                // Initial iteration is 0
        stepLoc: currentStep,               // Track step location
      };
      iteratorTable.push(existingEntry);
    } else {
      // If entry is found, check if iteration should be updated
      if (existingEntry.Flag === true) {
        existingEntry.currentIteration++;

        // Check if all iterations are complete for this step
        if (existingEntry.currentIteration >= array.length) {
          existingEntry.Flag = false;  // Mark iterator as completed
          
          // Remove the row from iteratorTable after the last iteration
          const index = iteratorTable.indexOf(existingEntry);
          if (index > -1) {
            iteratorTable.splice(index, 1); // Remove entry from iteratorTable
          }       
        }
      }
    }

    // Ensure we're not trying to access an out-of-bounds index
    const currentIteration = existingEntry.currentIteration;
    const currentItem = array[currentIteration] || null; // Return null if out of bounds

    // Set the output for the current iteration
    $.setActionItem({
      raw: {
        output: currentItem,
      },
    });
  },
});
