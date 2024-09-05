export interface Mean {
  storage: string;
  serial_number: string;
  licence_number: string;
  name: string;
  type: string;
  meanNumber: string;
  in_out: State;
  username: string;
  lastDate: string; // Utiliser 'string' pour le format ISO 8601, que vous pourrez convertir en `Date` si nécessaire
}

// Enum pour `State` si ce n'est pas déjà défini dans votre projet
export enum State {
  E = "E", // Entrée
  S = "S", // Sortie
}
