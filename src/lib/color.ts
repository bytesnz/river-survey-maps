export default function hslColor(color?: HSLColor | string): string | undefined {
  if (typeof color === 'string') {
    return color;
  } else if (color instanceof Array) {
    if (color.length === 4) {
      return `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${color[3]})`;
    }
    return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`;
  }
}
