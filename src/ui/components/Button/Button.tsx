// src/ui/components/Button/Button.tsx

import React from "react";
import "./Button.css";
import SettingsIcon from "@assets/settings-icon.svg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "icon";
  size?: "small" | "medium" | "large" | "icon";
};

export function Button({
  variant = "primary",
  size = "medium",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = `app-button ${variant} ${size} ${className}`;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

/* -------------------------------------------------- */
/* PRESET BUTTONS (Calculate / Reset / etc.)          */
/* -------------------------------------------------- */

export function CalculateButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="primary" size="large" {...props}>
      Beregn
    </Button>
  );
}

export function ResetButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="danger" size="medium" {...props}>
      Nullstill
    </Button>
  );
}

export function RegisterButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="primary" size="small" {...props}>
      Registrer
    </Button>
  );
}

export function UpdateButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="secondary" size="small" {...props}>
      Oppdater
    </Button>
  );
}

export function SettingsButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="icon" size="icon" {...props}>
      <img src={SettingsIcon} alt="settings" className="icon-img" />
    </Button>
  );}

  export function OkButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="primary" size="small" {...props}>
      OK
    </Button>
  );
}

export function CancelButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="secondary" size="small" {...props}>
      Avbryt
    </Button>
  );
}
