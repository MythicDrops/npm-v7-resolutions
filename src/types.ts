import { PackageJson } from "type-fest";

/**
 * Type for npm's `package-lock.json`'s
 * [`dependencies` mapping](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json#dependencies).
 */
export interface PackageLockDependency {
  /**
   * A specifier that varies depending on the nature of the package, and is usable in fetching a new copy of it.
   * - bundled dependencies: Regardless of source, this is a version number that is purely for informational purposes.
   * - registry sources: This is a version number. (eg, 1.2.3)
   * - git sources: This is a git specifier with resolved committish. (eg, git+https://example.com/foo/bar#115311855adb0789a0466714ed48a1499ffea97e)
   * - http tarball sources: This is the URL of the tarball. (eg, https://example.com/example-1.3.0.tgz)
   * - local tarball sources: This is the file URL of the tarball. (eg file:///opt/storage/example-1.3.0.tgz)
   * - local link sources: This is the file URL of the link. (eg file:libs/our-module)
   */
  version?: string;

  /**
   * `sha512` or `sha1` [Standard Subresource Integrity](https://w3c.github.io/webappsec/specs/subresourceintegrity/)
   * string for the artifact that was unpacked in this location. For git dependencies, this is the commit sha.
   */
  integrity?: string;

  /**
   * For registry sources this is path of the tarball relative to the registry URL. If the tarball URL isn't on the
   * same server as the registry URL then this is a complete URL.
   */
  resolved?: string;

  /**
   * If true, this is the bundled dependency and will be installed by the parent module. When installing, this
   * module will be extracted from the parent module during the extract phase, not installed as a separate dependency.
   */
  bundled?: boolean;

  /**
   * If true then this dependency is either a development dependency ONLY of the top level module or a transitive
   * dependency of one. This is false for dependencies that are both a development dependency of the top level
   * and a transitive dependency of a non-development dependency of the top level.
   */
  dev?: boolean;

  /**
   * If true then this dependency is either an optional dependency ONLY of the top level module or a transitive
   * dependency of one. This is false for dependencies that are both an optional dependency of the top level and
   * a transitive dependency of a non-optional dependency of the top level.
   */
  optional?: boolean;

  /**
   * This is a mapping of module name to version. This is a list of everything this module requires, regardless
   * of where it will be installed. The version should match via normal matching rules a dependency either in
   * our dependencies or in a level higher than us.
   */
  requires?: Record<string, string>;

  /**
   * The dependencies of this dependency, exactly as at the top level.
   */
  dependencies?: PackageLockDependency;
}

/**
 * Type for npm's `package-lock.json`'s
 * [`packages` mapping](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json#packages).
 */
export interface PackageLockPackage {
  /**
   * Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
   */
  version?: string;

  /**
   * Place where the dependency was resolved from (e.g., tarball url, git url, filesystem location, etc.).
   */
  resolved?: string;

  /**
   * `sha512` or `sha1` [Standard Subresource Integrity](https://w3c.github.io/webappsec/specs/subresourceintegrity/)
   * string for the artifact that was unpacked in this location.
   */
  integrity?: string;

  /**
   * Flag to indicate that this package is symbolic link.
   */
  link?: boolean;

  /**
   * Flag to indicate that this package is strictly part of the `devDependencies` tree.
   */
  dev?: boolean;

  /**
   * Flag to indicate that this package is strictly part of the `optionalDependencies` tree.
   */
  optional?: boolean;

  /**
   * Flag to indicate that this package is in both `devDependencies` and `optionalDependencies`.
   */
  devOptional?: boolean;

  /**
   * Flag to indicate that this package is a bundled dependency.
   */
  inBundle?: boolean;

  /**
   * Flag to indicate that this package has a `preinstall`, `install`, or `postinstall` script.
   */
  hasInstallScript?: boolean;

  /**
   * Flag to indicate that this package has an `npm-shrinkwrap.json` file included.
   */
  hasShrinkwrap?: boolean;

  /**
   * Contents of the `bin` field from this package's `package.json`.
   */
  bin?: string | Record<string, string>;

  /**
   * Contents of the `license` field from this package's `package.json`.
   */
  license?: string;

  /**
   * Contents of the `engines` field from this package's `package.json`.
   */
  engines?: {
    [EngineName in "npm" | "node" | string]: string;
  };

  /**
   * Contents of the `dependencies` field from this package's `package.json`.
   */
  dependencies?: PackageJson.Dependency;

  /**
   * Contents of the `optionalDependencies` field from this package's `package.json`.
   */
  optionalDependencies?: PackageJson.Dependency;
}

/**
 * Type for [npm's `package-lock.json` file](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json).
 * Containing standard npm properties.
 */
export interface PackageLockJson {
  /**
   * The name of the package.
   */
  name?: string;

  /**
   * Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
   */
  version?: string;

  /**
   * Lockfile version, defined by [`npm`](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json).
   */
  lockfileVersion?: number;

  /**
   * Maps package locations to package information.
   *
   * @see https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json#packages
   */
  packages?: Record<string, PackageLockPackage>;

  /**
   * Legacy data for supporting versions of npm that use `lockfileVersion: 1`. This is a mapping of
   * package names to dependency objects. Because the object structure is strictly hierarchical, symbolic link
   * dependencies are somewhat challenging to represent in some cases.
   *
   * npm v7 ignores this section entirely if a packages section is present, but does keep it up to date
   * in order to support switching between npm v6 and npm v7.
   */
  dependencies?: Record<string, PackageLockDependency>;
}
