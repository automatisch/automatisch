import defineAction from '../../../../helpers/define-action.js';
import iteratorTable from '../../../../helpers/iterator-table.js';

export default defineAction({
  name: 'Iterator End',
  key: 'iteratorEnd',
  description: 'Check if iterations are complete or continue with the next iteration',
  arguments: [
  ],
  
  async run($) {
    // Check if iteratorTable exists and is an array
    if (!Array.isArray(iteratorTable)) {
      $.setActionItem({
        raw: {
          output: 'Error: iteratorTable is not available or not an array.',
        },
      });
      return;
    }

    // Filter the entries with Flag set to true (pending iterations)
    const pendingIterations = iteratorTable.filter(entry => entry.Flag === true);

    console.log(pendingIterations);
    if (pendingIterations.length === 0) {
      // If no flags are true, all iterations are complete
      $.setActionItem({
        raw: {
          output: 'All iterations are complete, proceeding to the next step.',
        },
      });
    } else {
      // Use the LIFO (Last In, First Out) method to get the last pending iteration
      const nextIteration = pendingIterations[pendingIterations.length - 1]; // Last entry in the filtered list

      if (nextIteration) {
        const nextStep = nextIteration.stepLoc;

        $.setActionItem({
          raw: {
            output: `Continuing with iteration for stepLoc ${nextStep}.`,
          },
        });
        // Update the step to continue iteration at the selected stepLoc
        $.nextStep.id=nextStep;
      
      } else {
        // If no valid iteration is found, notify that the iteration is complete
        $.setActionItem({
          raw: {
            output: 'No valid iteration found, unable to continue.',
          },
        });
      }
    }
  }
});
