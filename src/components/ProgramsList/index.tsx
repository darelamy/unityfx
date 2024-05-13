import styles from "./ProgramsList.module.scss";
import { AfterEffectsIcon } from "../ui/icons/AfterEffectsIcon";
import { ProgramsListItem } from "../ProgramsListItem";
import React from "react";
import { PremiereProIcon } from "../ui/icons/PremiereProIcon";
import { MovaviIcon } from "../ui/icons/MovaviIcon";
import { VegasProIcon } from "../ui/icons/VegasProIcon";
import { DaVinciResolveIcon } from "../ui/icons/DaVinciResolveIcon";

export const ProgramsList = () => {
  const programs = [
    {
      id: 1,
      style: {
        background: `radial-gradient(
            50% 50% at 50% 50%,
            rgb(114, 76, 217),
            rgba(114, 76, 217, 0) 100%
        )`,
      },
      icon: <AfterEffectsIcon />,
    },
    {
      id: 2,
      style: {
        background: `radial-gradient(
            50.00% 50.00% at 50% 50%,
            rgb(245, 103, 255),
            rgba(114, 76, 217, 0) 100%
        )`,
      },
      icon: <PremiereProIcon />,
    },
    {
      id: 3,
      style: {
        background: `radial-gradient(
            50.00% 50.00% at 50% 50%,
            rgb(228, 115, 115) 14.504%,
            rgba(114, 76, 217, 0) 99.237%
        )`,
      },
      icon: <MovaviIcon />,
    },
    {
      id: 4,
      style: {
        background: `radial-gradient(
            50.00% 50.00% at 50% 50%,
            rgb(17, 153, 204),
            rgba(114, 76, 217, 0) 100%
        )`,
      },
      icon: <VegasProIcon />,
    },
    {
      id: 5,
      style: {
        background: `radial-gradient(
            50.00% 50.00% at 50% 50%,
            rgb(255, 64, 82),
            rgba(114, 76, 217, 0) 100%
        )`,
      },
      icon: <DaVinciResolveIcon />,
    },
  ];

  return (
    <div className="flex justify-between">
      {programs.map((program) => (
        <ProgramsListItem key={program.id} style={program.style}>
          {program.icon}
        </ProgramsListItem>
      ))}
    </div>
  );
};
