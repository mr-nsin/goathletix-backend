// PostToolUse (Edit|Write): append each edited file path to a per-session list.
// Used by check-memory-bank.js at Stop to enforce CLAUDE.md section 0's update obligation.
// Node, not jq — jq is not installed on this machine.
const fs = require("fs");
const os = require("os");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const j = JSON.parse(raw || "{}");
    const file =
      (j.tool_input && j.tool_input.file_path) ||
      (j.tool_response && j.tool_response.filePath) ||
      "";
    if (!file) return;
    const sid = String(j.session_id || "nosession").replace(/[^A-Za-z0-9_-]/g, "");
    // Normalise Windows separators so the Stop check only deals with "/".
    fs.appendFileSync(
      path.join(os.tmpdir(), `claude-edits-${sid}.txt`),
      file.replace(/\\/g, "/") + "\n",
    );
  } catch {
    // Never fail a tool call because of this hook.
  }
});
