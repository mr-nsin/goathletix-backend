// Stop hook: warn (never block) when source files changed this session but
// goathletix-backend/memory-bank/activeContext.md was not updated.
// Implements the update obligation in CLAUDE.md section 0.
const fs = require("fs");
const os = require("os");
const path = require("path");

const SRC = /goathletix-(backend|frontend)\/src\//i;
const CTX = /memory-bank\/activeContext\.md/i;

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const j = JSON.parse(raw || "{}");
    const sid = String(j.session_id || "nosession").replace(/[^A-Za-z0-9_-]/g, "");
    const list = path.join(os.tmpdir(), `claude-edits-${sid}.txt`);
    if (!fs.existsSync(list)) return;

    const edited = fs.readFileSync(list, "utf8");
    if (!SRC.test(edited) || CTX.test(edited)) return;

    const touched = [
      ...new Set(
        edited
          .split("\n")
          .filter((l) => SRC.test(l))
          .map((l) => l.replace(/^.*?(goathletix-(?:backend|frontend)\/src\/)/i, "$1")),
      ),
    ];

    process.stdout.write(
      JSON.stringify({
        systemMessage:
          "Memory bank not updated (CLAUDE.md section 0). Source changed this session but " +
          "goathletix-backend/memory-bank/activeContext.md was not:\n  " +
          touched.slice(0, 8).join("\n  ") +
          (touched.length > 8 ? `\n  ...and ${touched.length - 8} more` : ""),
      }),
    );
  } catch {
    // Never block the turn because of this hook.
  }
});
