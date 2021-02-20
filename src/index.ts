import debugLogger from "debug";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { PackageJson } from "type-fest";
import { failure, isSuccess, success } from "./results";
import { PackageLockJson } from "./types";

const debug = debugLogger("npm-v7-resolutions");

/**
 * Updates package-lock.json with resolutions from package.json in the given directory.
 * @param directory
 */
export const resolutions = async (directory: string) => {
  // define the paths to the files in the given directory
  const pathToPackageJson = resolve(directory, "package.json");
  const pathToPackageLockJson = resolve(directory, "package-lock.json");

  // load the contents of the files; we need both to exist and have contents
  let packageJsonRawContents: string;
  try {
    packageJsonRawContents = await readFile(pathToPackageJson, {
      encoding: "utf-8",
    });
  } catch (e) {
    debug("Unable to read package.json: e=%o");
    return failure(e);
  }
  let packageLockJsonRawContents: string;
  try {
    packageLockJsonRawContents = await readFile(pathToPackageLockJson, {
      encoding: "utf-8",
    });
  } catch (e) {
    debug("Unable to read package-lock.json: e=%o");
    return failure(e);
  }

  // parse the raw strings into the actual JSON values
  const packageJson: PackageJson = JSON.parse(packageJsonRawContents);
  const packageLockJson: PackageLockJson = JSON.parse(
    packageLockJsonRawContents
  );

  // make sure we have the bare minimum requirements
  if (packageJson.resolutions === undefined) {
    debug("No resolutions in package.json; not performing resolutions");
    return success("Dependencies match resolutions");
  }
  if (packageLockJson.packages === undefined) {
    debug("No packages in package-lock.json; not performing resolutions");
    return success(
      "package-lock.json has no packages; maybe try running `npm install` and then re-running"
    );
  }

  // loop through all of the resolutions
  for (const [name, version] of Object.entries(packageJson.resolutions)) {
    debug("Checking for resolution: name=%s version=%s", name, version);

    // get the names of all packages in the package-lock.json
    const packagePaths = Object.keys(packageLockJson.packages);

    // container for any package paths we need to delete for this resolution
    const deletePaths = [];

    // iterate through all of the packages in the package-lock.json
    // and find any that need to be deleted
    for (const packagePath of packagePaths) {
      if (packagePath.endsWith(`/${name}`)) {
        if (packageLockJson.packages[packagePath].version !== version) {
          debug(
            "%s version (%s) does not match resolution (%s); adding to delete paths"
          );
          deletePaths.push(packagePath);
        }
      }
    }

    // iterate through and delete all of the package paths to be deleted
    for (const packagePath of deletePaths) {
      for (const deletePath of deletePaths) {
        if (
          packagePath === deletePath ||
          packagePath.startsWith(`${deletePath}/`)
        ) {
          debug("Deleting %s", packagePath);
          delete packageLockJson.packages[packagePath];
        }
      }
    }
  }

  try {
    debug("Writing package-lock.json to file");
    await writeFile(
      pathToPackageLockJson,
      JSON.stringify(packageLockJson, null, 2),
      { encoding: "utf-8" }
    );
    debug("Wrote package-lock.json to file");
    return success("Updated package-lock.json to match resolutions");
  } catch (e) {
    debug("Error writing package-lock.json to file: e=%o", e);
    return failure("Unable to write updated package-lock.json");
  }
};

export const cli = async () => {
  const result = await resolutions(process.cwd());
  if (isSuccess(result)) {
    console.log(result.value);
    return;
  }
  console.error(result.reason);
  process.exit(1);
};
