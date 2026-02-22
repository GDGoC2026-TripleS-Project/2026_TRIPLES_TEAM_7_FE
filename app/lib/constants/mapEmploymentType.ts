export type EmploymentType = "FULL_TIME" | "CONTRACT" | "INTERN";

export function mapEmploymentTypeToLabel(type: EmploymentType): string {
  switch (type) {
    case "FULL_TIME":
      return "정규직";
    case "CONTRACT":
      return "계약직";
    case "INTERN":
      return "인턴";
  }
}
