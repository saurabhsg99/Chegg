function processText(input) {
    let str = input;
  
    // Removing specific patterns
    for (let i = 0; i < str.length; i++) {
      if (
        str[i] === "\\" &&
        (str[i + 1] === "(" ||
          str[i + 1] === ")" ||
          str[i + 1] === "[" ||
          str[i + 1] === "]")
      ) {
        str = str.slice(0, i) + str.slice(i + 2);
        i--;
      }
      if (str[i] === " " && str[i + 1] === " ") {
        str = str.slice(0, i) + str.slice(i + 1);
        i--;
      }
      if (str[i] === ":" && str[i + 1] === "\n") {
        str = str.slice(0, i) + str.slice(i + 1);
      }
      if (str[i] === "\\" && str[i + 1] === ",") {
        str = str.slice(0, i) + " " + str.slice(i + 2);
        i--;
      }
    }

    // Replacing \begin{bmatrix} with [[ and \end{bmatrix} with ]]
    str = str.replaceAll("\\begin{bmatrix}", "[[");
    str = str.replaceAll("\\end{bmatrix}", "]]");
  
    // Using a regular expression to target text within \begin{bmatrix} and \end{bmatrix}
    str = str.replace(/\[\[([\s\S]*?)\]\]/g, function (match, insideMatrix) {
      // Replace & with comma and \\ with closing row
      insideMatrix = insideMatrix.replace(/&/g, ","); // Replace matrix element separator
      insideMatrix = insideMatrix.replace(/\\\\s*/g, "],["); // Remove the backslash and extra spaces (for \\)
  
      // Rebuild the matrix with replaced elements
      return "[[" + insideMatrix + "]]";
    });
    // Replacing \begin{bmatrix} with [[ and \end{bmatrix} with ]]
    str = str.replaceAll("\\begin{cases}", "{(");
    str = str.replaceAll("\\end{cases}", "):}");
  
    // Using a regular expression to target text within \begin{bmatrix} and \end{bmatrix}
    str = str.replace(/\{\(([\s\S]*?)\):\}/g, function (match, insideMatrix) {
      // Replace & with comma and \\ with closing row
      insideMatrix = insideMatrix.replace(/&/g, " "); // Replace matrix element separator
      insideMatrix = insideMatrix.replace(/\\\\s*/g, "),("); // Remove the backslash and extra spaces (for \\)
  
      // Rebuild the matrix with replaced elements
      return "{(" + insideMatrix + "):}";
    });

    str = str.replaceAll("\\begin{vmatrix}", "[[");
    str = str.replaceAll("\\end{vmatrix}", "]]");
  
    // Using a regular expression to target text within \begin{bmatrix} and \end{bmatrix}
    str = str.replace(/\[\[([\s\S]*?)\]\]/g, function (match, insideMatrix) {
      // Replace & with comma and \\ with closing row
      insideMatrix = insideMatrix.replace(/&/g, ","); // Replace matrix element separator
      insideMatrix = insideMatrix.replace(/\\\\s*/g, "],["); // Remove the backslash and extra spaces (for \\)
  
      // Rebuild the matrix with replaced elements
      return "[[" + insideMatrix + "]]";
    });
    str = str.replaceAll("\\begin{pmatrix}", "((");
    str = str.replaceAll("\\end{pmatrix}", "))");
  
    // Using a regular expression to target text within \begin{bmatrix} and \end{bmatrix}
    str = str.replace(/\(\(([\s\S]*?)\)\)/g, function (match, insideMatrix) {
      // Replace & with comma and \\ with closing row
      insideMatrix = insideMatrix.replace(/&/g, ","); // Replace matrix element separator
      insideMatrix = insideMatrix.replace(/\\\\s*/g, "),("); // Remove the backslash and extra spaces (for \\)
  
      // Rebuild the matrix with replaced elements
      return "((" + insideMatrix + "))";
    });
  
    // Removing specific substrings
    const findAndRemove = (subStr) => {
      let pos = str.indexOf(subStr);
      while (pos !== -1) {
        str = str.slice(0, pos) + str.slice(pos + subStr.length);
        pos = str.indexOf(subStr);
      }
    };
  
    findAndRemove("\\left");
    findAndRemove("\\right");
    findAndRemove("---");
    findAndRemove("###");
    findAndRemove("***");
    findAndRemove("##");
    findAndRemove("**");
    findAndRemove(".\n");
    findAndRemove(":\n");
    findAndRemove("\\boxed{");
  
    let neqPos = str.indexOf("\\neq");
    while (neqPos !== -1) {
      str = str.slice(0, neqPos + 3) + str.slice(neqPos + 4);
      neqPos = str.indexOf("\\neq");
    }
  
    let r_angle = str.indexOf("\\rangle");
    while (r_angle !== -1) {
      str = str.slice(0, r_angle + 0) + str.slice(r_angle + 1);
      r_angle = str.indexOf("\\rangle");
    }
  
    str = str
      .split("\n") // Split the string into lines
      .map((line) => line.trim()) // Remove leading/trailing whitespaces
      .filter((line) => line) // Remove empty lines
      .join("\n"); // Rejoin the lines into a single string
  
    return str;
  }
  
  // Button for "Process and Copy"
  document.getElementById("processButton").addEventListener("click", () => {
    const inputText = document.getElementById("inputText").value;
    const processedText = processText(inputText);
  
    // Display the processed output
    const outputDiv = document.getElementById("output");
    outputDiv.hidden = false;
    outputDiv.textContent = "Copied";
  
    // Copy the processed text to clipboard
    navigator.clipboard
      .writeText(processedText)
      .then(() => {})
      .catch((err) => {
        alert("Processed text failed to copied to clipboard!");
  
        console.error("Failed to copy text: ", err);
      });
  });
  
  // Button for "Show Output"
  document.getElementById("showOutputButton").addEventListener("click", () => {
    const inputText = document.getElementById("inputText").value;
    const processedText = processText(inputText);
  
    const outputDiv = document.getElementById("output");
    outputDiv.hidden = false;
    outputDiv.textContent = processedText;
  });
