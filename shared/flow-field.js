// Sum of sines is cheap and smooth enough to pass for a flow field at this density.
export function emberFlowAngle(x, y, t) {
  return (
    Math.sin(x * 0.0032 + t * 0.4) * 1.3 +
    Math.cos(y * 0.0041 - t * 0.3) * 1.1 +
    Math.sin((x + y) * 0.0018 + t * 0.15)
  );
}

export function inkFlowAngle(x, y, t) {
  return (Math.sin(x * 0.0035 + t) + Math.cos(y * 0.0028 - t * 0.6)) * Math.PI;
}
