import { useConstraintGroups } from
  "@ui/pages/shared/domain/constraints";

import type { TriangleFields } from "../../model/triangleFields";
import { triangleConstraints } from "./types";

export function useTriangleConstraints(
  fields: TriangleFields,
  setFields: React.Dispatch<React.SetStateAction<TriangleFields>>,
) {
  useConstraintGroups({
    fields,
    setFields,
    validSets: triangleConstraints,
  });

  return {
    constraints: triangleConstraints,
  };
}
