import clsx from "clsx";
import type { TriangleFieldKey } from "../../model/triangleFields";
import "./triangleFigure.css";

type Props = {
    activeField?: TriangleFieldKey | null;
    disabledMap: Record<TriangleFieldKey, boolean>;
};

export function TriangleFigure({ activeField, disabledMap }: Props) {
    const part = (key: TriangleFieldKey) =>
        clsx(
            "triangle-part",
            activeField === key && "active",
            disabledMap[key] && "disabled"
        );

    return (
        <svg
            viewBox="0 0 200 160"
            className="triangle-figure"
            aria-hidden
        >
            {/* Katet a */}
            <line
                x1="40" y1="20"
                x2="40" y2="140"
                className={part("a")}
            />

            {/* Katet b */}
            <line
                x1="40" y1="140"
                x2="160" y2="140"
                className={part("b")}
            />

            {/* Hypotenus c */}
            <line
                x1="40" y1="20"
                x2="160" y2="140"
                className={part("c")}
            />

            {/* Vinkel alpha (ved topp-venstre) */}
            <path
                d="M40 45 A25 25 0 0 0 57.7 37.7"
                className={part("alpha")}
            />

            {/* Vinkel beta (ved bunn-høyre) */}
            <path
                d="M135 140 A25 25 0 0 1 142.3 122.3"
                className={part("beta")}
            />

            {/* Rett vinkel */}
            <rect
                x="40" y="120"
                width="20" height="20"
                className="right-angle"
            />
        </svg>
    );
}
