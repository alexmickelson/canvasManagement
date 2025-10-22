type feedbackTypeOptions = "correct" | "incorrect" | "neutral" | "none";

export const quizFeedbackMarkdownUtils = {
  extractFeedback(lines: string[]): {
    correctComments?: string;
    incorrectComments?: string;
    neutralComments?: string;
    otherLines: string[];
  } {
    const comments = {
      correct: [] as string[],
      incorrect: [] as string[],
      neutral: [] as string[],
    };

    const otherLines: string[] = [];

    const feedbackIndicators = {
      correct: "+",
      incorrect: "-",
      neutral: "...",
    };

    let currentFeedbackType: feedbackTypeOptions = "none";

    for (const line of lines.map((l) => l)) {
      const lineFeedbackType: feedbackTypeOptions = line.startsWith("+")
        ? "correct"
        : line.startsWith("-")
        ? "incorrect"
        : line.startsWith("...")
        ? "neutral"
        : "none";

      if (lineFeedbackType === "none" && currentFeedbackType !== "none") {
        const lineWithoutIndicator = line
          .replace(feedbackIndicators[currentFeedbackType], "")
          .trim();
        comments[currentFeedbackType].push(lineWithoutIndicator);

      } else if (lineFeedbackType !== "none") {

        const lineWithoutIndicator = line
          .replace(feedbackIndicators[lineFeedbackType], "")
          .trim();
        currentFeedbackType = lineFeedbackType;
        comments[lineFeedbackType].push(lineWithoutIndicator);

      } else {
        otherLines.push(line);
      }
    }

    const correctComments = comments.correct.filter((l) => l).join("\n");
    const incorrectComments = comments.incorrect.filter((l) => l).join("\n");
    const neutralComments = comments.neutral.filter((l) => l).join("\n");

    return {
      correctComments: correctComments || undefined,
      incorrectComments: incorrectComments || undefined,
      neutralComments: neutralComments || undefined,
      otherLines,
    };
  },

  formatFeedback(
    correctComments?: string,
    incorrectComments?: string,
    neutralComments?: string
  ): string {
    let feedbackText = "";
    if (correctComments) {
      feedbackText += `+ ${correctComments}\n`;
    }
    if (incorrectComments) {
      feedbackText += `- ${incorrectComments}\n`;
    }
    if (neutralComments) {
      feedbackText += `... ${neutralComments}\n`;
    }
    return feedbackText;
  },
};
