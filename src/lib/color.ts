export default function hslColor(color: HSLColor) {
  if (color.length === 4) {
    return `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${color[3]})`;
  }
  return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;
}
