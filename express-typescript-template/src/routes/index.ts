import express, {NextFunction, Request, Response} from "express";
import fs from "fs";
import path from "path";

const router = express.Router({strict: false});

const release = fs.readFileSync(path.join(__dirname, "../../release"), "utf8").trim();

router.use((req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.release = release;
    res.locals.user = req.user;
  } catch (error) {
    console.error(error);
  }
  next();
});

router.get("/", (req: Request, res: Response) => {
  res.render("index");
});

router.get(["/admin", "/admin/**"], (req: Request, res: Response) => {
  if (req.isAuthenticated())
    return res.render("admin");
  res.redirect("/");
});

export default router;
