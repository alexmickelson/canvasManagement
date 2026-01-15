export interface FeedbackDelimiters {
  correct: string;
  incorrect: string;
  neutral: string;
}

export const defaultFeedbackDelimiters: FeedbackDelimiters = {
  correct: "+",
  incorrect: "-",
  neutral: "...",
};

type feedbackTypeOptions = "correct" | "incorrect" | "neutral" | "none";

export const quizFeedbackMarkdownUtils = {
  extractFeedback(
    lines: string[],
    delimiters: FeedbackDelimiters = defaultFeedbackDelimiters
  ): {
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

    const feedbackIndicators = delimiters;

    let currentFeedbackType: feedbackTypeOptions = "none";

    for (const line of lines.map((l) => l)) {
      const lineFeedbackType: feedbackTypeOptions = line.startsWith(
        feedbackIndicators.correct
      )
        ? "correct"
        : line.startsWith(feedbackIndicators.incorrect)
        ? "incorrect"
        : line.startsWith(feedbackIndicators.neutral)
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
    neutralComments?: string,
    delimiters: FeedbackDelimiters = defaultFeedbackDelimiters
  ): string {
    let feedbackText = "";
    if (correctComments) {
      feedbackText += `${delimiters.correct} ${correctComments}\n`;
    }
    if (incorrectComments) {
      feedbackText += `${delimiters.incorrect} ${incorrectComments}\n`;
    }
    if (neutralComments) {
      feedbackText += `${delimiters.neutral} ${neutralComments}\n`;
    }
    // Ensure there's a blank line after feedback block so answers are separated
    if (feedbackText) feedbackText += "\n";
    return feedbackText;
  },
};
