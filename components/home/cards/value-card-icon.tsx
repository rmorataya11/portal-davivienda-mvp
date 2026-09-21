type ValueCardIconProps = {
  step: string;
  className?: string;
};

export function ValueCardIcon({ step, className = "" }: ValueCardIconProps) {
  return (
    <span className={`why-card-icon ${className}`}>
      {step === "01" ? <RocketIcon /> : null}
      {step === "02" ? <ArrowIcon /> : null}
      {step === "03" ? <LockIcon /> : null}
      {step === "04" ? <GraphIcon /> : null}
    </span>
  );
}

function RocketIcon() {
  return (
    <img src="/home/icons/cohete.svg" alt="" width={72} height={72} aria-hidden="true" />
  );
}

function ArrowIcon() {
  return (
    <img
      src="/home/icons/next.svg"
      alt=""
      width={58}
      height={58}
      className="why-card-icon-img-sm"
      aria-hidden="true"
    />
  );
}

function LockIcon() {
  return (
    <img
      src="/home/icons/candado.svg"
      alt=""
      width={58}
      height={58}
      className="why-card-icon-img-sm"
      aria-hidden="true"
    />
  );
}

function GraphIcon() {
  return (
    <img
      src="/home/icons/graph.svg"
      alt=""
      width={58}
      height={58}
      className="why-card-icon-img-sm"
      aria-hidden="true"
    />
  );
}
