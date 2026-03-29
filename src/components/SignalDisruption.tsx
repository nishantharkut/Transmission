import { useImperativeHandle, forwardRef } from "react";

export interface SignalDisruptionHandle {
  fire: () => void;
}

const SignalDisruption = forwardRef<SignalDisruptionHandle>((_props, ref) => {
  useImperativeHandle(ref, () => ({
    fire: () => {},
  }));

  return null;
});

SignalDisruption.displayName = "SignalDisruption";
export default SignalDisruption;
