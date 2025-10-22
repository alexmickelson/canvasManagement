type FeedbackType = "+" | "-" | "...";

const isFeedbackStart = (
  trimmedLine: string,
  feedbackType: FeedbackType
): boolean => {
  const prefix = feedbackType === "..." ? "... " : `${feedbackType} `;
  return trimmedLine.startsWith(prefix) || trimmedLine === feedbackType;
};

const extractFeedbackContent = (
  trimmedLine: string,
  feedbackType: FeedbackType
): string => {
  if (trimmedLine === feedbackType) return "";

  const prefixLength = feedbackType === "..." ? 4 : 2; // "... " is 4 chars, "+ " and "- " are 2
  return trimmedLine.substring(prefixLength);
};

const saveFeedback = (
  feedbackType: FeedbackType | null,
  feedbackLines: string[],
  comments: {
    correct?: string;
    incorrect?: string;
    neutral?: string;
  }
): void => {
  if (!feedbackType || feedbackLines.length === 0) return;

  const feedbackText = feedbackLines.join("\n");
  if (feedbackType === "+") {
    comments.correct = feedbackText;
  } else if (feedbackType === "-") {
    comments.incorrect = feedbackText;
  } else if (feedbackType === "...") {
    comments.neutral = feedbackText;
  }
};

export const quizFeedbackMarkdownUtils = {
  extractFeedback(
    linesWithoutPoints: string[],
    isAnswerLine: (trimmedLine: string) => boolean
  ): {
    correctComments?: string;
    incorrectComments?: string;
    neutralComments?: string;
    linesWithoutFeedback: string[];
  } {
    const comments: {
      correct?: string;
      incorrect?: string;
      neutral?: string;
    } = {};
    const linesWithoutFeedback: string[] = [];

    let currentFeedbackType: FeedbackType | null = null;
    let currentFeedbackLines: string[] = [];

    for (const line of linesWithoutPoints) {
      const trimmed = line.trim();

      // Check if this is a new feedback line
      let newFeedbackType: FeedbackType | null = null;
      if (isFeedbackStart(trimmed, "+")) {
        newFeedbackType = "+";
      } else if (isFeedbackStart(trimmed, "-")) {
        newFeedbackType = "-";
      } else if (isFeedbackStart(trimmed, "...")) {
        newFeedbackType = "...";
      }

      if (newFeedbackType) {
        // Save previous feedback if any
        saveFeedback(currentFeedbackType, currentFeedbackLines, comments);

        // Start new feedback
        currentFeedbackType = newFeedbackType;
        const content = extractFeedbackContent(trimmed, newFeedbackType);
        currentFeedbackLines = content ? [content] : [];
      } else if (currentFeedbackType && !isAnswerLine(trimmed)) {
        // This is a continuation of the current feedback
        currentFeedbackLines.push(line);
      } else {
        // Save any pending feedback
        saveFeedback(currentFeedbackType, currentFeedbackLines, comments);
        currentFeedbackType = null;
        currentFeedbackLines = [];

        // This is a regular line
        linesWithoutFeedback.push(line);
      }
    }

    // Save any remaining feedback
    saveFeedback(currentFeedbackType, currentFeedbackLines, comments);

    return {
      correctComments: comments.correct,
      incorrectComments: comments.incorrect,
      neutralComments: comments.neutral,
      linesWithoutFeedback,
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
