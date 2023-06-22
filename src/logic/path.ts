import { existsSync, mkdirSync } from "fs";
import os from "os";
import path from "path";

export default class PathLogic {
  static mainDir: string = ".";
  static ensureDataDir = (
    appName?: string,
    appAuthor?: string,
    rest?: string
  ): string => {
    let dir = this.userDataDir(appName, appAuthor);
    if (rest) dir = path.join(dir, rest);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    return dir;
  };
  static userDataDir = (
    appname?: string,
    appauthor?: string | boolean,
    version?: string,
    roaming: boolean = false
  ): string => {
    let system = os.platform();
    let dirPath: string;

    if (system === "win32") {
      if (appauthor === undefined) {
        appauthor = appname;
      }
      const constFolder = roaming ? "AppData/Roaming" : "AppData/Local";
      dirPath = path.normalize(path.join(os.homedir(), constFolder));
      if (appname) {
        if (appauthor !== false) {
          dirPath = path.join(dirPath, String(appauthor), appname);
        } else {
          dirPath = path.join(dirPath, appname);
        }
      }
    } else if (system === "darwin") {
      dirPath = path.join(os.homedir(), "Library", "Application Support");
      if (appname) {
        dirPath = path.join(dirPath, appname);
      }
    } else {
      dirPath =
        process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
      if (appname) {
        dirPath = path.join(dirPath, appname);
      }
    }

    if (appname && version) {
      dirPath = path.join(dirPath, version);
    }

    return dirPath;
  };
}
