export interface Classroom50CommandResult {
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export interface RosterSyncSummaryData {
  rosterResult: Classroom50CommandResult;
  rosterCount: number;
  updated: string[];
  updateResults: Classroom50CommandResult[];
  unmatchedCanvas: { name: string; email: string }[];
  unmatchedRoster: string[];
}
