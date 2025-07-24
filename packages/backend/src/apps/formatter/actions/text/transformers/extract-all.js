const extractAll = ($) => {
  const input = $.step.parameters.input;
  const find = $.step.parameters.find;
  const useRegex = $.step.parameters.useRegex;

  if (useRegex) {
    // If the user is using regex, create the RegExp object
    const ignoreCase = $.step.parameters.ignoreCase;
    
    const flags = [ignoreCase && 'i', 'g'].filter(Boolean).join('');  // Add 'i' flag if ignoreCase is true
    
    const timeoutId = setTimeout(() => {
      $.execution.exit();
    }, 100);
    
    const regex = new RegExp(find, flags);  // Create a regex with the provided pattern and flags

    // Use regex to extract all matches
    const matches = input.match(regex);  // Find all matches using the regex

	clearTimeout(timeoutId);
	
    return matches || [];  // Return the matches (or an empty array if no matches are found)
  }

  // If not using regex, perform a simple string search
  const matches = [];
  let lastIndex = 0;

  // While we find the 'find' string in the input, keep pushing matches
  while ((lastIndex = input.indexOf(find, lastIndex)) !== -1) {
    matches.push(find);  // Push the found string to the matches array
    lastIndex += find.length;  // Move past the found match to search for the next one
  }
  
  return matches;  // Return all found matches
};

export default extractAll;
