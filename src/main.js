if (
  !workingDirectory.startsWith("V:/") &&
  !navigator.userAgent.toLowerCase().includes("electron")
)
  return;

const shellPid = +env.get("shell_pid");
const { proc } = await load("js/process.js");

runAppDirect(proc, $METADATA, shellPid);
