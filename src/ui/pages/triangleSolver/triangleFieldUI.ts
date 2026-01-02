// ui/triangleSolver/triangleFieldUI.ts

import type { FieldUIState } from "@ui/field";
import { enabledField, lockedField } from "@ui/field/fieldUI";
import type { TriangleFields } from "./triangleTypes";
import { getTriangleAvailability } from "./getTriangleAvailability";

/**
 * UI-regler for rettvinklet trekant.
 *
 * Prinsipper:
 * - Kun UI-logikk (ingen tall, ingen core)
 * - Availability er sannheten
 * - Brukerfelter låses aldri
 * - Felter som kan utledes låses, selv om de er tomme
 * - Resultat-modus overstyrer all låsing
 */
export function getTriangleFieldUI(
  fields: TriangleFields,
  availability: ReturnType<typeof getTriangleAvailability>,
  opts: {
    hasResult: boolean;
  }
): Record<keyof TriangleFields, FieldUIState> {
  // --------------------------------------------------
  // RESULTAT-MODUS
  // --------------------------------------------------
  if (opts.hasResult) {
    return {
      a: enabledField(),
      b: enabledField(),
      c: enabledField(),
      alpha: enabledField(),
      beta: enabledField(),
    };
  }

  // --------------------------------------------------
  // BASIS: alt aktivt
  // --------------------------------------------------
  const ui: Record<keyof TriangleFields, FieldUIState> = {
    a: enabledField(),
    b: enabledField(),
    c: enabledField(),
    alpha: enabledField(),
    beta: enabledField(),
  };

  // --------------------------------------------------
  // HJELPER
  // --------------------------------------------------
  const isUser = (key: keyof TriangleFields) =>
    fields[key].source === "user";

  // --------------------------------------------------
  // HYPOTENUS c
  // --------------------------------------------------
  // a + b → c kan utledes
  if (availability.canDeriveC && !isUser("c")) {
    ui.c = lockedField("Beregnes fra a og b");
  }

  // --------------------------------------------------
  // VINKLER α og β
  // --------------------------------------------------
  // To sider → begge vinkler kan utledes
  if (availability.canDeriveAngles) {
    if (!isUser("alpha")) {
      ui.alpha = lockedField("Beregnes fra sider");
    }
    if (!isUser("beta")) {
      ui.beta = lockedField("Beregnes fra sider");
    }
  }

  // Én vinkel oppgitt → den andre kan utledes
  if (availability.hasAlpha && !isUser("beta")) {
    ui.beta = lockedField("β = 90° − α");
  }

  if (availability.hasBeta && !isUser("alpha")) {
    ui.alpha = lockedField("α = 90° − β");
  }

  return ui;
}
