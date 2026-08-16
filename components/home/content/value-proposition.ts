import { ArrowSquareIcon, GrowthIcon, LockIcon, RocketIcon } from "../icons";
import type { ValueCard } from "./types";

export const valueCards: ValueCard[] = [
  {
    step: "01",
    title: "Nuevas formas de crecer",
    description:
      "Ofrezca servicios financieros dentro de su propio producto y descubra oportunidades de ingreso que antes no estaban a su alcance.",
    icon: RocketIcon,
  },
  {
    step: "02",
    title: "Empiece sin complicaciones",
    description:
      "Le dejamos todo listo para arrancar: documentación clara y un entorno de pruebas para experimentar con total tranquilidad.",
    icon: ArrowSquareIcon,
  },
  {
    step: "03",
    title: "Tranquilidad en cada paso",
    description:
      "Detrás de cada conexión está Davivienda, cuidando la seguridad de su negocio y la confianza de sus clientes.",
    icon: LockIcon,
    wide: true,
  },
  {
    step: "04",
    title: "Crezca a su propio ritmo",
    description:
      "Comience con algo pequeño y escale cuando lo necesite. Nuestra tecnología avanza junto con usted.",
    icon: GrowthIcon,
    wide: true,
  },
];
