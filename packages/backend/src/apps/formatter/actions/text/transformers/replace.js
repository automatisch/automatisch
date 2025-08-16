const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const isValidRegexPattern = (pattern) => {
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /(\*\+|\+\*|\*\*|\+\+)/,  // Nested quantifiers
    /\(\?\!/,                  // Negative lookahead
    /\(\?\</,                  // Lookbehind
    /(\.\*){3,}/,             // Multiple .* patterns
    /(\.\+){3,}/,             // Multiple .+ patterns
  ];
  
  return !dangerousPatterns.some(dangerous => dangerous.test(pattern));
};

const safeRegexReplace = (text, searchValue, replaceValue, flags = 'g') => {
  // Limit pattern length to prevent complexity attacks
  if (searchValue.length > 1000) {
    throw new Error('Search pattern too long');
  }
  
  // Validate the pattern for dangerous constructs
  if (!isValidRegexPattern(searchValue)) {
    // Fall back to literal string replacement for safety
    return text.split(searchValue).join(replaceValue);
  }
  
  try {
    // Create regex with timeout protection
    const regex = new RegExp(searchValue, flags);
    
    // Test with a small sample first to detect potential ReDoS
    const testString = text.substring(0, Math.min(100, text.length));
    const startTime = Date.now();
    regex.test(testString);
    const testTime = Date.now() - startTime;
    
    // If test takes too long, fall back to string replacement
    if (testTime > 10) {
      return text.split(searchValue).join(replaceValue);
    }
    
    return text.replace(regex, replaceValue);
  } catch (error) {
    // If regex construction fails, fall back to literal replacement
    return text.split(searchValue).join(replaceValue);
  }
};

const replace = ({ text, searchValue, replaceValue, useRegex = false }) => {
  if (!text || searchValue === undefined) {
    return text;
  }
  
  if (!useRegex) {
    // Use literal string replacement
    return text.split(searchValue).join(replaceValue || '');
  }
  
  // Use safe regex replacement
  return safeRegexReplace(text, searchValue, replaceValue || '');
};

module.exports = replace;
