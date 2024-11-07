import { Request, Response, Router } from "express";
import StringUtility from "../../util/string.utility";

const v0Router: Router = Router();

v0Router.get("/", (req: Request, res: Response) => {
  console.log(StringUtility.testRegexPattern("^.*.router.*$", __filename));
  res.send({
    dir: __dirname,
    file: __filename,
    method: req.method,
  });
});

export default v0Router;
