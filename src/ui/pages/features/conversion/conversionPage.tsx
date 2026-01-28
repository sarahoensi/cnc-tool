import { InputPanel } from "@ui/components/PanelSections";
import { SplitPage } from "@ui/pages/shared/layout/SplitPage";
import { CalculateButton, ResetButton } from "@ui/components/Button/Button";

import { useConversionFieldsState } from "./model/useConversionFieldState";
import { useConversionSolve } from "./workflow/useConversionSolve";
import { conversionFieldConfig } from "./ui/conversionFieldConfig";

import { useFormFieldRenderer } from "@ui/pages/shared/workflow/fields";

export function ConversionPage() {
  const [fields, setFields, resetFields] =
    useConversionFieldsState();

  const { solve } = useConversionSolve(fields, setFields);

  const renderField =
    useFormFieldRenderer({
      fields,
      updateField: (key, next) =>
        setFields(prev => ({ ...prev, [key]: next })),
      focus: { register: () => null }, // evt. ekte focus senere
    });

  return (
    <SplitPage
      left={
        <InputPanel title="Konvertering">
          {conversionFieldConfig.map(f =>
            renderField(
              f.key,
              f.label,
              f.unit,
              undefined,
              f.autoFocus
            )
          )}

          <div className="button-row">
            <CalculateButton onClick={solve} />
            <ResetButton onClick={resetFields} />
          </div>
        </InputPanel>
      }
      right={null}
    />
  );
}
