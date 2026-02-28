import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./children.authorization";
import childrenService from "./children.service";
import { Validation } from "../../middelwares/validation.middelware";
import {
  SignUpForChildSchema,
  UpdateChildSchema,
  ChildIdParamSchema,
} from "./children.validation";

const router: Router = Router();

router.post(
  "/",
  Validation(SignUpForChildSchema),
  authentication(endpoints.manageChildren),
  childrenService.createChild,
);

router.get(
  "/",
  authentication(endpoints.manageChildren),
  childrenService.getChildren,
);

router.get(
  "/:childId",
  Validation(ChildIdParamSchema),
  authentication(endpoints.manageChildren),
  childrenService.getChild,
);

router.patch(
  "/:childId",
  Validation(ChildIdParamSchema),
  Validation(UpdateChildSchema),
  authentication(endpoints.manageChildren),
  childrenService.updateChild,
);

router.delete(
  "/:childId",
  Validation(ChildIdParamSchema),
  authentication(endpoints.manageChildren),
  childrenService.deleteChild,
);

export default router;
