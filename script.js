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



  str = str.replace(/(\d),(\d{3})/g, "$1 $2");
  str = str.replace(/\d+/g, (match) => {
    return match.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  });

  // Replacing \begin{bmatrix} with [[ and \end{bmatrix} with ]]
  str = str.replaceAll("\\begin{bmatrix}", "[[");
  str = str.replaceAll("\\end{bmatrix}", "]]");

  str = str.replaceAll("\\dots", "cdots");

  str = str.replace(/\[\[([\s\S]*?)\]\]/g, function (match, insideMatrix) {
    insideMatrix = insideMatrix.replace(/&/g, ",");
    insideMatrix = insideMatrix.replace(/\\\\s*/g, "],[");
    return "[[" + insideMatrix + "]]";
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
  findAndRemove("####");
  findAndRemove("###");
  findAndRemove("***");
  findAndRemove("##");
  findAndRemove("**");
  findAndRemove(".\n");
  findAndRemove(":\n");


   // Making "Step X : text" bold and replacing ":" with ")"
   str = str.replace(/(Step \d+):(.*)/g, "**$1) $2**");
   str = str.replace(/(Problem \d+):(.*)/g, "**$1) $2**");

  str = str.replace(/\\boxed{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g, "$1");

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
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .join("\n");

  return str;
}


// Button for "Process and Copy"
document.getElementById("processButton").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value;
  const processedText = processText(inputText);

  const outputDiv = document.getElementById("output");
  outputDiv.hidden = false;
  outputDiv.innerHTML = '<span class="text-jump">Copied</span>'; // Wrap text in a span for animation

  // Copy text to clipboard
  navigator.clipboard.writeText(processedText)
      .catch((err) => {
          alert("Failed to copy to clipboard!");
          console.error("Error copying text: ", err);
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
