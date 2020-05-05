const execa = require("execa");
const fs = require("fs");

(async () => {
  try {
    console.log("Ensuring there is not gh-pages branch...");
    await execa("git", ["checkout", "-f", "master"]);
    try {
      await execa("git", ["branch", "-D", "gh-pages"]);
    }
    catch (e) {
      console.log("No gh-pages branch")
    }

    console.log("Creating gh-pages branch...");
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    console.log("Building...");
    await execa("npm", ["run", "build"]);
    // Understand if it's dist or build folder
    const folderName = fs.existsSync("dist") ? "dist" : "build";
    console.log("Committing changes...");
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    // await execa("del", [folderName, "/s", "/q"]);
    console.log("Checking out master...");
    await execa("git", ["checkout", "-f", "master"]);
    console.log("Deleting gh-pages branch...");
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
    console.log("Reverting back to master...");
    await execa("git", ["checkout", "-f", "master"]);
    try {
      console.log("Deleting gh-pages branch...");
      await execa("git", ["branch", "-D", "gh-pages"]);
    }
    catch (e) {
      console.log("No gh-pages branch")
    }
    process.exit(1);
  }
})();