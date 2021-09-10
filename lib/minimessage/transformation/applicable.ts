export interface Applicable {
  applicable: (value: string) => boolean;
}

export function findApplicable<T extends Applicable>(
  transformations: readonly T[],
  name: string
): T | null {
  for (const transformation of transformations) {
    if (transformation.applicable(name)) {
      return transformation;
    }
  }
  return null;
}
