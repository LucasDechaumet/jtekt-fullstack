export interface History {
  id: number;
  username: string | null;
  created_at: Date; // Vous pouvez également utiliser `Date` si vous prévoyez de manipuler les dates en tant qu'objets Date en TypeScript.
  in_out: "E" | "S"; // Si les seules valeurs possibles sont 'E' et 'S', sinon utilisez `string`.
  duration_out: number | null; // Assurez-vous que c'est bien un nombre sinon utilisez `string`.
  duration_in: number | null; // Assurez-vous que c'est bien un nombre sinon utilisez `string`.
}
